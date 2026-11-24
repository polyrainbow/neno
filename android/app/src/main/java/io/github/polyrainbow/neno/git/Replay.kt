package io.github.polyrainbow.neno.git

import org.eclipse.jgit.diff.DiffAlgorithm
import org.eclipse.jgit.diff.DiffEntry
import org.eclipse.jgit.diff.RawText
import org.eclipse.jgit.diff.RawTextComparator
import org.eclipse.jgit.dircache.DirCache
import org.eclipse.jgit.dircache.DirCacheEditor
import org.eclipse.jgit.dircache.DirCacheEntry
import org.eclipse.jgit.lib.CommitBuilder
import org.eclipse.jgit.lib.Constants
import org.eclipse.jgit.lib.FileMode
import org.eclipse.jgit.lib.ObjectId
import org.eclipse.jgit.lib.ObjectInserter
import org.eclipse.jgit.lib.RefUpdate
import org.eclipse.jgit.lib.Repository
import org.eclipse.jgit.merge.ContentMergeStrategy
import org.eclipse.jgit.merge.MergeAlgorithm
import org.eclipse.jgit.merge.MergeFormatter
import org.eclipse.jgit.revwalk.RevCommit
import org.eclipse.jgit.revwalk.RevSort
import org.eclipse.jgit.revwalk.RevWalk
import org.eclipse.jgit.treewalk.TreeWalk
import org.eclipse.jgit.treewalk.filter.AndTreeFilter
import org.eclipse.jgit.treewalk.filter.PathFilter
import org.eclipse.jgit.treewalk.filter.TreeFilter
import java.io.ByteArrayOutputStream

/**
 * Replays the local commits onto what was fetched, settling every
 * conflict last writer wins — the rules of electron/git/rebase.ts:
 *
 * - Per file, the side whose latest commit touching it is newer wins
 *   the overlapping hunks; hunks that do not overlap are kept from both
 *   sides, as git's own merge would keep them.
 * - A binary file goes whole to the newer side.
 * - An edit always beats a deletion.
 * - When the local side loses anything, its commit is kept under
 *   refs/neno/overwritten/, because the replay drops it from the branch.
 *
 * Unlike `git rebase`, nothing here touches the working tree or leaves
 * state behind: the commits are built in memory, and the caller checks
 * out the result in one step. A crash halfway leaves the branch where it
 * was, and the next pull does it again.
 */
class Replay(
  private val repository: Repository,
  /** Who replays: the committer of every rewritten commit. */
  private val committer: GitAuthor,
  private val now: () -> Long = System::currentTimeMillis,
) {

  /** The new tip of the branch, and whether the local side lost anything. */
  data class Result(val head: ObjectId, val localLost: Boolean)

  /** Replays the commits of `local` that `upstream` lacks onto `upstream`. */
  fun onto(local: ObjectId, upstream: ObjectId): Result {
    RevWalk(repository).use { walk ->
      repository.newObjectInserter().use { inserter ->
        walk.sort(RevSort.TOPO, true)
        walk.sort(RevSort.REVERSE, true)
        walk.markStart(walk.parseCommit(local))
        walk.markUninteresting(walk.parseCommit(upstream))
        // Like `git rebase`, merge commits are not replayed.
        val toReplay = walk.filter { it.parentCount <= 1 }.toList()

        var head = walk.parseCommit(upstream)
        var lostAny = false
        for (commit in toReplay) {
          val (next, lost) = replayOne(walk, inserter, head, commit)
          head = next
          lostAny = lostAny || lost
        }
        inserter.flush()
        return Result(head, lostAny)
      }
    }
  }

  private fun blobAt(walk: RevWalk, commit: RevCommit, path: String): ObjectId? =
    TreeWalk.forPath(repository, path, walk.parseCommit(commit).tree)
      ?.use { if (it.getFileMode(0).objectType == Constants.OBJ_BLOB) it.getObjectId(0) else null }

  private fun bytes(id: ObjectId?): ByteArray =
    if (id == null) ByteArray(0)
    else repository.open(id, Constants.OBJ_BLOB).bytes

  /** Author time, in seconds, of the newest commit from `head` touching `path`. */
  private fun latestAuthorTime(head: RevCommit, path: String): Long {
    RevWalk(repository).use { walk ->
      walk.markStart(walk.parseCommit(head))
      walk.setTreeFilter(
        AndTreeFilter.create(PathFilter.create(path), TreeFilter.ANY_DIFF),
      )
      return walk.firstOrNull()?.authorIdent?.whenAsInstant?.epochSecond ?: 0
    }
  }

  private fun merge(
    base: ByteArray,
    upstream: ByteArray,
    local: ByteArray,
    strategy: ContentMergeStrategy,
  ): Pair<ByteArray, Boolean> {
    val algorithm = MergeAlgorithm(
      DiffAlgorithm.getAlgorithm(DiffAlgorithm.SupportedAlgorithm.HISTOGRAM),
    )
    algorithm.contentMergeStrategy = strategy
    val result = algorithm.merge(
      RawTextComparator.DEFAULT,
      RawText(base),
      RawText(upstream),
      RawText(local),
    )
    val out = ByteArrayOutputStream()
    MergeFormatter().formatMerge(
      out,
      result,
      "BASE",
      "UPSTREAM",
      "LOCAL",
      Charsets.UTF_8,
    )
    return out.toByteArray() to result.containsConflicts()
  }

  private sealed class Outcome {
    object Keep : Outcome()
    object Delete : Outcome()
    data class Set(val id: ObjectId, val mode: FileMode) : Outcome()
  }

  /** Applies one local commit on top of `head`. */
  private fun replayOne(
    walk: RevWalk,
    inserter: ObjectInserter,
    head: RevCommit,
    commit: RevCommit,
  ): Pair<RevCommit, Boolean> {
    val parent = commit.parents.firstOrNull()?.let { walk.parseCommit(it) }
    val localTime = commit.authorIdent.whenAsInstant.epochSecond
    var localLost = false

    val outcomes = mutableMapOf<String, Outcome>()
    val entries = changedEntries(walk, parent, commit)

    for (entry in entries) {
      val path = if (entry.changeType == DiffEntry.ChangeType.DELETE) {
        entry.oldPath
      } else {
        entry.newPath
      }
      val baseId = if (entry.changeType == DiffEntry.ChangeType.ADD) null
      else entry.oldId.toObjectId()
      val localId = if (entry.changeType == DiffEntry.ChangeType.DELETE) null
      else entry.newId.toObjectId()
      val localMode = if (localId != null) entry.newMode else FileMode.REGULAR_FILE
      val upstreamId = blobAt(walk, head, path)

      outcomes[path] = when {
        // Upstream did not touch it: the local change applies as is.
        upstreamId == baseId ->
          if (localId == null) Outcome.Delete else Outcome.Set(localId, localMode)
        // Both sides made the same change.
        upstreamId == localId -> Outcome.Keep
        // Deleted locally, edited upstream: the edit stays.
        localId == null -> Outcome.Keep
        // Deleted upstream, edited locally: the edit stays.
        upstreamId == null -> Outcome.Set(localId, localMode)
        else -> {
          val base = bytes(baseId)
          val upstream = bytes(upstreamId)
          val local = bytes(localId)
          val localWins = localTime >= latestAuthorTime(head, path)

          /*
            One side left the content as the base had it — e.g. both added
            the file, one of them empty. git's merge takes the other side
            cleanly; JGit's MergeAlgorithm calls an empty side a conflict.
          */
          if (local.contentEquals(base)) {
            Outcome.Keep
          } else if (upstream.contentEquals(base)) {
            Outcome.Set(localId, localMode)
          } else if (GitRepo.isBinary(base) || GitRepo.isBinary(upstream) ||
            GitRepo.isBinary(local)) {
            localLost = localLost || !localWins
            if (localWins) Outcome.Set(localId, localMode) else Outcome.Keep
          } else {
            val (clean, conflicted) =
              merge(base, upstream, local, ContentMergeStrategy.CONFLICT)
            val merged = if (!conflicted) {
              clean
            } else {
              localLost = localLost || !localWins
              merge(
                base,
                upstream,
                local,
                if (localWins) ContentMergeStrategy.THEIRS
                else ContentMergeStrategy.OURS,
              ).first
            }
            Outcome.Set(
              inserter.insert(Constants.OBJ_BLOB, merged),
              FileMode.REGULAR_FILE,
            )
          }
        }
      }
    }

    val tree = applyOutcomes(walk, inserter, head, outcomes)

    // A commit the resolution emptied has nothing left to replay.
    if (tree == head.tree.toObjectId()) {
      if (localLost) keepOverwritten(commit)
      return head to localLost
    }

    val builder = CommitBuilder().apply {
      setTreeId(tree)
      setParentId(head)
      author = commit.authorIdent
      committer = GitRepo.ident(this@Replay.committer)
      message = commit.fullMessage
      encoding = commit.encoding
    }
    val newId = inserter.insert(builder)
    inserter.flush()
    if (localLost) keepOverwritten(commit)
    return walk.parseCommit(newId) to localLost
  }

  private fun changedEntries(
    walk: RevWalk,
    parent: RevCommit?,
    commit: RevCommit,
  ): List<DiffEntry> {
    TreeWalk(repository).use { treeWalk ->
      treeWalk.isRecursive = true
      if (parent == null) {
        treeWalk.addTree(org.eclipse.jgit.treewalk.EmptyTreeIterator())
      } else {
        treeWalk.addTree(walk.parseCommit(parent).tree)
      }
      treeWalk.addTree(walk.parseCommit(commit).tree)
      return DiffEntry.scan(treeWalk)
    }
  }

  private fun applyOutcomes(
    walk: RevWalk,
    inserter: ObjectInserter,
    head: RevCommit,
    outcomes: Map<String, Outcome>,
  ): ObjectId {
    val index = DirCache.newInCore()
    val builder = index.builder()
    repository.newObjectReader().use { reader ->
      builder.addTree(ByteArray(0), 0, reader, walk.parseCommit(head).tree)
    }
    builder.finish()

    val editor = index.editor()
    for ((path, outcome) in outcomes) {
      when (outcome) {
        Outcome.Keep -> Unit
        Outcome.Delete -> editor.add(DirCacheEditor.DeletePath(path))
        is Outcome.Set -> editor.add(object : DirCacheEditor.PathEdit(path) {
          override fun apply(entry: DirCacheEntry) {
            entry.setObjectId(outcome.id)
            entry.fileMode = outcome.mode
          }
        })
      }
    }
    editor.finish()
    return index.writeTree(inserter)
  }

  /*
    The replay drops the local commit from the branch, and the reflog only
    keeps it until gc. A ref keeps it for good.
  */
  private fun keepOverwritten(commit: RevCommit) {
    val update = repository.updateRef(
      "refs/neno/overwritten/${now()}-${commit.name.take(12)}",
    )
    update.setNewObjectId(commit)
    update.setExpectedOldObjectId(ObjectId.zeroId())
    val result = update.update()
    check(result == RefUpdate.Result.NEW) { "Could not keep $commit: $result" }
  }
}
