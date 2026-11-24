package io.github.polyrainbow.neno.git

import org.eclipse.jgit.api.Git
import org.eclipse.jgit.api.TransportConfigCallback
import org.eclipse.jgit.lib.NullProgressMonitor
import org.eclipse.jgit.lib.ProgressMonitor
import org.eclipse.jgit.diff.DiffEntry
import org.eclipse.jgit.lib.Constants
import org.eclipse.jgit.lib.ObjectId
import org.eclipse.jgit.lib.PersonIdent
import org.eclipse.jgit.lib.Repository
import org.eclipse.jgit.revwalk.RevCommit
import org.eclipse.jgit.revwalk.RevWalk
import org.eclipse.jgit.storage.file.FileRepositoryBuilder
import org.eclipse.jgit.treewalk.AbstractTreeIterator
import org.eclipse.jgit.treewalk.CanonicalTreeParser
import org.eclipse.jgit.treewalk.EmptyTreeIterator
import org.eclipse.jgit.treewalk.TreeWalk
import java.io.Closeable
import java.io.File
import java.text.Collator
import java.util.Locale

/** Where auto-sync goes (RemoteTarget in electron/git/GitRepo.ts). */
data class RemoteTarget(
  /** The remote's name, e.g. "origin". */
  val name: String,
  /** The branch on the remote. */
  val branch: String,
  val localBranch: String,
  /** Whether the local branch already tracks it. */
  val hasUpstream: Boolean,
)

/**
 * Local git operations on the graph folder, on JGit. The Android
 * counterpart of electron/git/GitRepo.ts, which drives the system git:
 * same operations, same results. Nothing here touches the network, and
 * nothing here locks: GitSync decides what may run at the same time.
 */
class GitRepo(val dir: File) : Closeable {

  companion object {
    private const val GITIGNORE_DEFAULT = ".DS_Store\n"
    private const val GRAPH_FILE_EXTENSION = ".subtext"
    private const val PINS_FILENAME = ".pins.neno"

    /*
      GraphStorage writes through temporary files next to their targets.
      A crash can leave one behind; it must never end up in a commit.
      Excluded locally (.git/info/exclude), not in .gitignore, so the
      repository stays the same as the desktop's.
    */
    private const val TEMP_FILE_PATTERN = "*.neno-tmp"

    /** Same limit as MAX_DIFF_BYTES in src/lib/git/diff.ts. */
    const val MAX_DIFF_BYTES = 200_000

    /** Same test as isBinary() in src/lib/git/diff.ts. */
    fun isBinary(bytes: ByteArray): Boolean {
      val limit = minOf(bytes.size, 8000)
      for (i in 0 until limit) {
        if (bytes[i] == 0.toByte()) return true
      }
      return false
    }

    fun ident(author: GitAuthor): PersonIdent =
      PersonIdent(author.name, author.email)

    /**
     * Clones `url` into `dir` with only its newest commit, and switches
     * auto-sync on. A graph's history can be many times the size of its
     * notes and files — gigabytes of PDF and video revisions — and a
     * phone needs none of it to sync: pull and push only ever look at the
     * commits since. The full history stays on the remote and the
     * desktops; the history view starts at the clone.
     */
    fun cloneShallow(
      url: String,
      dir: File,
      transport: TransportConfigCallback?,
      monitor: ProgressMonitor = NullProgressMonitor.INSTANCE,
      timeoutSeconds: Int = 30,
    ): GitRepo {
      Git.cloneRepository()
        .setURI(url)
        .setDirectory(dir)
        .setDepth(1)
        .setTimeout(timeoutSeconds)
        .setTransportConfigCallback(transport)
        .setProgressMonitor(monitor)
        .call()
        .use { git ->
          git.repository.config.apply {
            setBoolean("neno", null, "autoSync", true)
            save()
          }
        }
      return GitRepo(dir)
    }
  }

  private var cachedGit: Git? = null

  fun exists(): Boolean = File(dir, Constants.DOT_GIT).exists()

  /** The repository, opened once. Fails when there is none. */
  @get:Synchronized
  val git: Git
    get() {
      cachedGit?.let { return it }
      check(exists()) { "This graph has no git repository" }
      val repository = FileRepositoryBuilder()
        .setWorkTree(dir)
        .setGitDir(File(dir, Constants.DOT_GIT))
        .setMustExist(true)
        .build()
      return Git(repository).also {
        cachedGit = it
        ensureLocalExcludes(repository)
      }
    }

  val repository: Repository get() = git.repository

  @Synchronized
  override fun close() {
    cachedGit?.repository?.close()
    cachedGit?.close()
    cachedGit = null
  }

  private fun ensureLocalExcludes(repository: Repository) {
    val exclude = File(repository.directory, "info/exclude")
    val current = if (exclude.exists()) exclude.readText() else ""
    if (current.lines().any { it.trim() == TEMP_FILE_PATTERN }) return
    exclude.parentFile?.mkdirs()
    val separator = if (current.isEmpty() || current.endsWith("\n")) "" else "\n"
    exclude.writeText("$current$separator$TEMP_FILE_PATTERN\n")
  }

  /** Creates the repository with an initial commit; a no-op if one exists. */
  fun init(author: GitAuthor) {
    if (exists()) return

    Git.init()
      .setDirectory(dir)
      .setInitialBranch("main")
      .call()
      .close()
    val gitignore = File(dir, ".gitignore")
    // The folder may bring a .gitignore of its own; keep it.
    if (!gitignore.exists()) gitignore.writeText(GITIGNORE_DEFAULT)

    stageAll()
    git.commit()
      .setMessage(withNewline("initial commit"))
      .setAuthor(ident(author))
      .setCommitter(ident(author))
      .setNoVerify(true)
      .setSign(false)
      .call()
  }

  /*
    `git commit` ends every message with a newline and JGit does not; the
    desktop's history and the phone's should read the same.
  */
  private fun withNewline(message: String) = "$message\n"

  /** `git add --all`: new, changed and deleted files alike. */
  private fun stageAll() {
    git.add().addFilepattern(".").call()
    git.add().addFilepattern(".").setUpdate(true).call()
  }

  private fun stagePaths(paths: Collection<String>) {
    val (present, missing) = paths.partition { File(dir, it).exists() }
    if (present.isNotEmpty()) {
      val add = git.add()
      present.forEach { add.addFilepattern(it) }
      add.call()
    }
    /*
      A path that is neither on disk nor tracked — a note created and
      deleted between two commits — is nothing to commit, and removing
      it from the index is then a no-op.
    */
    if (missing.isNotEmpty()) {
      val rm = git.rm().setCached(true)
      missing.forEach { rm.addFilepattern(it) }
      rm.call()
    }
  }

  /**
   * Commits what one flush wrote. Returns the new commit's oid, or null
   * when the flush changed nothing git did not already have.
   */
  fun commit(changes: FlushChanges, author: GitAuthor): String? {
    val sets = listOf(
      changes.canonicalNoteSlugs,
      changes.aliases,
      changes.arbitraryFiles,
    )
    if (sets.any { it is SlugSet.All }) {
      stageAll()
    } else {
      val paths = linkedSetOf<String>()
      for (slug in (changes.canonicalNoteSlugs as SlugSet.Some).slugs +
        (changes.aliases as SlugSet.Some).slugs) {
        paths.add("$slug$GRAPH_FILE_EXTENSION")
      }
      // An uploaded file is its payload plus a graph file describing it.
      for (slug in (changes.arbitraryFiles as SlugSet.Some).slugs) {
        paths.add(slug)
        paths.add("$slug$GRAPH_FILE_EXTENSION")
      }
      if (changes.flushPins) paths.add(PINS_FILENAME)
      stagePaths(paths)
    }
    return commitStaged(author)
  }

  /** Commits these paths, relative to the graph folder, as they are now. */
  fun commitPaths(paths: Collection<String>, author: GitAuthor): String? {
    stagePaths(paths)
    return commitStaged(author)
  }

  private fun commitStaged(author: GitAuthor): String? {
    val staged = git.diff()
      .setCached(true)
      .setShowNameAndStatusOnly(true)
      .call()
    val creates = staged.filter { it.changeType == DiffEntry.ChangeType.ADD }
      .map { it.newPath }
    val removes = staged.filter { it.changeType == DiffEntry.ChangeType.DELETE }
      .map { it.oldPath }
    val modifies = staged
      .filter {
        it.changeType != DiffEntry.ChangeType.ADD &&
          it.changeType != DiffEntry.ChangeType.DELETE
      }
      .map { it.newPath }
    if (creates.size + modifies.size + removes.size == 0) return null

    return git.commit()
      .setMessage(withNewline(CommitMessage.format(creates, modifies, removes)))
      .setAuthor(ident(author))
      .setCommitter(ident(author))
      .setNoVerify(true)
      .setSign(false)
      .call()
      .name
  }

  /*
    HISTORY
  */

  private fun treeIterator(walk: RevWalk, commit: RevCommit?): AbstractTreeIterator {
    if (commit == null) return EmptyTreeIterator()
    val parser = CanonicalTreeParser()
    walk.objectReader.use { reader ->
      parser.reset(reader, walk.parseCommit(commit).tree)
    }
    return parser
  }

  /** What `commit` changed relative to `parent`, without rename detection. */
  fun changedEntries(
    walk: RevWalk,
    parent: RevCommit?,
    commit: RevCommit,
  ): List<DiffEntry> {
    TreeWalk(repository).use { treeWalk ->
      treeWalk.isRecursive = true
      treeWalk.addTree(treeIterator(walk, parent))
      treeWalk.addTree(treeIterator(walk, commit))
      return DiffEntry.scan(treeWalk)
    }
  }

  private val pathOrder = Collator.getInstance(Locale.ROOT)

  /*
    The oldest commit of a shallow clone. Its parent was never fetched,
    so it would look like it added every file of the graph — thousands
    of files, gigabytes to diff. It is shown as a commit without changes.
  */
  private fun isShallowBoundary(commit: RevCommit): Boolean =
    commit.parentCount == 0 &&
      commit.id in repository.objectDatabase.shallowCommits

  private fun toChangedFile(entry: DiffEntry): ChangedFile =
    when (entry.changeType) {
      DiffEntry.ChangeType.ADD -> ChangedFile(entry.newPath, ChangeKind.ADD)
      DiffEntry.ChangeType.DELETE -> ChangedFile(entry.oldPath, ChangeKind.DELETE)
      else -> ChangedFile(entry.newPath, ChangeKind.MODIFY)
    }

  /** Sorted by path, as the desktop sorts them (localeCompare). */
  private fun sortedEntries(
    walk: RevWalk,
    parent: RevCommit?,
    commit: RevCommit,
  ): List<Pair<DiffEntry, ChangedFile>> = changedEntries(walk, parent, commit)
    .map { it to toChangedFile(it) }
    .sortedWith { a, b -> pathOrder.compare(a.second.path, b.second.path) }

  private fun changedFiles(
    walk: RevWalk,
    parent: RevCommit?,
    commit: RevCommit,
  ): List<ChangedFile> = sortedEntries(walk, parent, commit).map { it.second }

  fun log(limit: Int, offset: Int): List<CommitInfo> {
    val head = repository.resolve(Constants.HEAD) ?: return emptyList()
    RevWalk(repository).use { walk ->
      walk.markStart(walk.parseCommit(head))
      val commits = mutableListOf<CommitInfo>()
      var index = 0
      for (commit in walk) {
        if (index++ < offset) continue
        if (commits.size >= limit) break
        val parent = commit.parents.firstOrNull()?.let { walk.parseCommit(it) }
        val ident = commit.authorIdent
        commits.add(
          CommitInfo(
            oid = commit.name,
            message = commit.fullMessage,
            author = GitAuthor(ident.name, ident.emailAddress),
            timestamp = ident.whenAsInstant.epochSecond,
            // JGit counts minutes east of UTC; the history view, like
            // getTimezoneOffset(), counts them west.
            timezoneOffset = -ident.zoneOffset.totalSeconds / 60,
            changes = if (isShallowBoundary(commit)) emptyList()
            else changedFiles(walk, parent, commit),
          ),
        )
      }
      return commits
    }
  }

  private fun readBlob(id: ObjectId): ByteArray =
    repository.open(id, Constants.OBJ_BLOB).bytes

  /** Both versions of every file `oid` changed, for the history view. */
  fun fileVersions(oid: String): List<FileVersions> {
    RevWalk(repository).use { walk ->
      val commit = walk.parseCommit(ObjectId.fromString(oid))
      if (isShallowBoundary(commit)) return emptyList()
      val parent = commit.parents.firstOrNull()?.let { walk.parseCommit(it) }
      return sortedEntries(walk, parent, commit).map { (entry, changed) ->
        val oldBytes = if (changed.change != ChangeKind.ADD && parent != null) {
          readBlob(entry.oldId.toObjectId())
        } else null
        val newBytes = if (changed.change != ChangeKind.DELETE) {
          readBlob(entry.newId.toObjectId())
        } else null

        when {
          (oldBytes != null && isBinary(oldBytes)) ||
            (newBytes != null && isBinary(newBytes)) ->
            FileVersions(changed.path, changed.change, binary = true)
          (oldBytes?.size ?: 0) > MAX_DIFF_BYTES ||
            (newBytes?.size ?: 0) > MAX_DIFF_BYTES ->
            FileVersions(changed.path, changed.change, tooLarge = true)
          else -> FileVersions(
            changed.path,
            changed.change,
            oldText = oldBytes?.toString(Charsets.UTF_8) ?: "",
            newText = newBytes?.toString(Charsets.UTF_8) ?: "",
          )
        }
      }
    }
  }

  /*
    REMOTES
  */

  /**
   * Where auto-sync goes: the current branch's upstream if it has one,
   * otherwise the same branch on `origin`. Null for a detached HEAD, or
   * when there is neither.
   */
  fun detectRemote(): RemoteTarget? {
    val fullBranch = repository.fullBranch ?: return null
    if (!fullBranch.startsWith(Constants.R_HEADS)) return null
    val localBranch = fullBranch.removePrefix(Constants.R_HEADS)

    val config = repository.config
    val configured = config.getString("branch", localBranch, "remote")
    val merge = config.getString("branch", localBranch, "merge")
    if (
      configured != null && configured != "." &&
      merge != null && merge.startsWith(Constants.R_HEADS)
    ) {
      return RemoteTarget(
        configured,
        merge.removePrefix(Constants.R_HEADS),
        localBranch,
        hasUpstream = true,
      )
    }

    if ("origin" !in config.getSubsections("remote")) return null
    return RemoteTarget("origin", localBranch, localBranch, hasUpstream = false)
  }

  fun revParse(rev: String): ObjectId? = try {
    repository.resolve("$rev^{commit}")
  } catch (_: Exception) {
    null
  }
}
