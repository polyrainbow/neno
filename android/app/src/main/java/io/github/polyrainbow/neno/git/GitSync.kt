package io.github.polyrainbow.neno.git

import io.github.polyrainbow.neno.storage.WorktreeLock
import org.eclipse.jgit.api.TransportConfigCallback
import org.eclipse.jgit.api.errors.TransportException
import org.eclipse.jgit.diff.DiffEntry
import org.eclipse.jgit.dircache.DirCacheEditor
import org.eclipse.jgit.dircache.DirCacheEntry
import org.eclipse.jgit.lib.FileMode
import org.eclipse.jgit.lib.Constants
import org.eclipse.jgit.lib.ObjectId
import org.eclipse.jgit.lib.RefUpdate
import org.eclipse.jgit.revwalk.RevWalk
import org.eclipse.jgit.revwalk.filter.RevFilter
import org.eclipse.jgit.transport.RefSpec
import org.eclipse.jgit.transport.RemoteRefUpdate
import org.eclipse.jgit.transport.TagOpt
import org.eclipse.jgit.treewalk.TreeWalk
import java.io.File
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.TimeUnit

/** A failure the user has to act on, with the kind the UI shows. */
class SyncException(val kind: SyncErrorKind, message: String) : Exception(message)

/**
 * Keeps the graph's repository in step with its remote — a port of
 * electron/git/GitSync.ts, whose two rules shape everything here too:
 *
 * - Network calls never hold the worktree lock. Saves take that lock for
 *   their writes and their commit, so a fetch or push that hangs on an
 *   unreachable remote would otherwise hang the save. Only local steps
 *   hold it, and they take milliseconds.
 * - Failing to reach the remote is a state, not an error. The commits
 *   wait and go out on a later attempt.
 *
 * "Window focus" is the app coming to the foreground.
 */
class GitSync(
  val repo: GitRepo,
  val lock: WorktreeLock,
  private val transport: TransportConfigCallback? = null,
  private val onStatus: (SyncStatus) -> Unit = {},
  private val onPathsChanged: (List<String>) -> Unit = {},
  /** A pull waits while the editor has unsaved changes. */
  private val isEditorDirty: () -> Boolean = { false },
  /** Seconds of silence after which a fetch or push gives up. */
  private val networkTimeoutSeconds: Int = 30,
  private val pullIntervalMs: Long = 5 * 60_000L,
  private val focusThrottleMs: Long = 60_000L,
  private val retryDelaysMs: List<Long> =
    listOf(15_000L, 30_000L, 60_000L, 120_000L, 300_000L),
  private val now: () -> Long = System::currentTimeMillis,
) {
  companion object {
    private const val AUTO_SYNC_SECTION = "neno"
    private const val AUTO_SYNC_KEY = "autoSync"
  }

  /* Fetches and pushes, one at a time. */
  private val network: ExecutorService = Executors.newSingleThreadExecutor {
    Thread(it, "neno-git-network").apply { isDaemon = true }
  }
  private val timers: ScheduledExecutorService =
    Executors.newSingleThreadScheduledExecutor {
      Thread(it, "neno-git-timers").apply { isDaemon = true }
    }
  private var intervalTimer: ScheduledFuture<*>? = null
  private var retryTimer: ScheduledFuture<*>? = null
  private var lastNetwork: Future<*>? = null

  @Volatile private var pullDeferred = false
  @Volatile private var lastFocusPullAt = 0L
  @Volatile private var focused = false
  @Volatile private var failures = 0
  @Volatile private var disposed = false
  @Volatile var author: GitAuthor = GitAuthor.DEFAULT

  @Volatile
  private var status = SyncStatus()

  fun getStatus(): SyncStatus = status

  /** Called once when the graph opens. */
  fun start() {
    /*
      NENO never leaves a rebase behind itself (Replay works in memory),
      but a repository copied over from a desktop can bring one along.
      The commits it was replaying are still on the branch, so going back
      is safe and the next pull redoes it.
    */
    lock.withLock {
      if (repo.exists() && repo.repository.repositoryState.isRebasing) {
        repo.git.rebase()
          .setOperation(org.eclipse.jgit.api.RebaseCommand.Operation.ABORT)
          .call()
      }
    }
    refreshStatus()
    if (status.enabled) {
      // The open counts as the focus pull: no second one right after.
      lastFocusPullAt = now()
      requestNetwork(pull = true)
    }
  }

  /*
    Pulls, then pushes. The future completes when both are over, failed
    or not. Also what the app calls when the network comes back, so it
    starts the retries over.
  */
  fun syncNow(): Future<*> {
    failures = 0
    return requestNetwork(pull = true)
  }

  @Synchronized
  fun foregrounded() {
    focused = true
    if (disposed || !status.enabled) return
    if (now() - lastFocusPullAt >= focusThrottleMs) {
      lastFocusPullAt = now()
      requestNetwork(pull = true)
    }
    startInterval()
  }

  @Synchronized
  fun backgrounded() {
    focused = false
    intervalTimer?.cancel(false)
    intervalTimer = null
  }

  @Synchronized
  private fun startInterval() {
    if (intervalTimer != null || disposed) return
    intervalTimer = timers.scheduleWithFixedDelay(
      { if (status.enabled) requestNetwork(pull = true) },
      pullIntervalMs,
      pullIntervalMs,
      TimeUnit.MILLISECONDS,
    )
  }

  /** The pull that waited for unsaved changes can go ahead now. */
  fun editorBecameClean() {
    if (!pullDeferred) return
    pullDeferred = false
    requestNetwork(pull = true)
  }

  fun commit(changes: FlushChanges, author: GitAuthor): String? {
    this.author = author
    val oid = lock.withLock { repo.commit(changes, author) }
    if (oid != null && status.enabled) {
      requestNetwork(pull = false)
    } else if (oid != null) {
      refreshStatus()
    }
    return oid
  }

  fun setAutoSync(enabled: Boolean): SyncStatus {
    refreshStatus()
    if (enabled) {
      if (!status.repo) throw IllegalStateException("This graph has no git repository")
      val target = repo.detectRemote()
        ?: throw IllegalStateException("The repository has no remote to sync with")
      refuseUnrelatedHistories(target)
      repo.repository.config.apply {
        setBoolean(AUTO_SYNC_SECTION, null, AUTO_SYNC_KEY, true)
        save()
      }
    } else if (status.repo) {
      repo.repository.config.apply {
        unset(AUTO_SYNC_SECTION, null, AUTO_SYNC_KEY)
        save()
      }
    }
    refreshStatus()
    if (enabled) {
      lastFocusPullAt = now()
      if (focused) startInterval()
      requestNetwork(pull = true).get()
    }
    return status
  }

  /** Blocks until no fetch or push is running or queued. */
  fun awaitIdle() {
    while (true) {
      val current = synchronized(this) { lastNetwork } ?: return
      current.get()
      if (synchronized(this) { lastNetwork } === current) return
    }
  }

  fun dispose() {
    disposed = true
    backgrounded()
    retryTimer?.cancel(false)
    timers.shutdownNow()
    network.shutdown()
    // A local step that has started — a commit, a replay — finishes.
    lock.withLock { }
    repo.close()
  }

  private fun emit(next: SyncStatus) {
    status = next
    // A graph switch replaces this instance; its news is stale.
    if (!disposed) onStatus(next)
  }

  private fun trackingRef(target: RemoteTarget): String? {
    val ref = "refs/remotes/${target.name}/${target.branch}"
    return if (repo.revParse(ref) != null) ref else null
  }

  private fun countUnpushed(target: RemoteTarget): Int {
    val local = repo.revParse("refs/heads/${target.localBranch}") ?: return 0
    val tracking = trackingRef(target)?.let { repo.revParse(it) }
    RevWalk(repo.repository).use { walk ->
      walk.markStart(walk.parseCommit(local))
      tracking?.let { walk.markUninteresting(walk.parseCommit(it)) }
      return walk.count()
    }
  }

  private fun isEnabled(): Boolean =
    repo.repository.config.getBoolean(AUTO_SYNC_SECTION, null, AUTO_SYNC_KEY, false)

  fun refreshStatus() {
    val exists = repo.exists()
    val target = if (exists) repo.detectRemote() else null
    emit(
      status.copy(
        repo = exists,
        remote = target?.let { SyncRemote(it.name, it.branch) },
        enabled = exists && isEnabled(),
        unpushedCommits = target?.let { countUnpushed(it) } ?: 0,
      ),
    )
  }

  /*
    Queues a fetch-and-push behind whatever is already running. The
    future never fails — a failure is reported through the status.
  */
  @Synchronized
  private fun requestNetwork(pull: Boolean): Future<*> {
    if (disposed || network.isShutdown) {
      return java.util.concurrent.CompletableFuture.completedFuture(null)
    }
    val run = network.submit {
      try {
        exchange(pull)
      } catch (error: Throwable) {
        reportFailure(error)
        scheduleRetry()
      }
    }
    lastNetwork = run
    return run
  }

  private fun exchange(pull: Boolean) {
    if (disposed) return
    refreshStatus()
    if (!status.enabled) return
    val target = repo.detectRemote() ?: throw SyncException(
      SyncErrorKind.NO_REMOTE,
      "The repository has no remote to sync with any more.",
    )

    emit(status.copy(state = SyncState.SYNCING))
    try {
      if (pull) pull(target)
      try {
        push(target)
      } catch (error: Exception) {
        if (ClassifyError.classify(error) != NetworkFailure.REJECTED) throw error
        // The remote moved on since the last fetch.
        pull(target)
        push(target)
      }
      emit(status.copy(state = SyncState.IDLE, error = null, lastSyncedAt = now()))
      failures = 0
    } catch (error: Throwable) {
      reportFailure(error)
      scheduleRetry()
    }
    refreshStatus()
  }

  @Synchronized
  private fun scheduleRetry() {
    if (disposed || retryTimer?.isDone == false) return
    val delay = retryDelaysMs[minOf(failures, retryDelaysMs.size - 1)]
    failures++
    retryTimer = timers.schedule(
      {
        synchronized(this) { retryTimer = null }
        requestNetwork(pull = true)
      },
      delay,
      TimeUnit.MILLISECONDS,
    )
  }

  /*
    Turning sync on for a repo that was initialized on its own would make
    every pull a replay of one history onto an unrelated one. If the
    remote cannot be reached now, the check happens on the first pull.
  */
  private fun refuseUnrelatedHistories(target: RemoteTarget) {
    try {
      fetch(target)
    } catch (error: Exception) {
      if (ClassifyError.classify(error) == NetworkFailure.OFFLINE) return
      throw error
    }
    checkRelated(target)
  }

  private fun checkRelated(target: RemoteTarget) {
    val tracking = trackingRef(target)?.let { repo.revParse(it) } ?: return
    val local = repo.revParse("refs/heads/${target.localBranch}") ?: return
    RevWalk(repo.repository).use { walk ->
      walk.revFilter = RevFilter.MERGE_BASE
      walk.markStart(walk.parseCommit(local))
      walk.markStart(walk.parseCommit(tracking))
      if (walk.next() == null) {
        throw SyncException(
          SyncErrorKind.UNRELATED_HISTORIES,
          "This repository and ${target.name}/${target.branch} share no history.",
        )
      }
    }
  }

  fun fetch(target: RemoteTarget) {
    try {
      repo.git.fetch()
        .setRemote(target.name)
        .setRefSpecs(
          RefSpec(
            "+refs/heads/${target.branch}:refs/remotes/${target.name}/${target.branch}",
          ),
        )
        .setTagOpt(TagOpt.NO_TAGS)
        .setTimeout(networkTimeoutSeconds)
        .setTransportConfigCallback(transport)
        .call()
    } catch (error: TransportException) {
      // An empty remote, or one that never had this branch.
      val message = error.message ?: ""
      if (Regex("does not have .* available for fetch|couldn't find remote ref",
          RegexOption.IGNORE_CASE).containsMatchIn(message)) {
        return
      }
      throw error
    }
  }

  private fun pull(target: RemoteTarget) {
    fetch(target)
    val changed = lock.withLock { integrate(target) }
    if (changed.isNotEmpty()) onPathsChanged(changed)
  }

  private fun isAncestor(ancestor: ObjectId, of: ObjectId): Boolean =
    RevWalk(repo.repository).use { walk ->
      walk.isMergedInto(walk.parseCommit(ancestor), walk.parseCommit(of))
    }

  /**
   * Brings the fetched commits into the local branch. Returns the paths
   * that changed in the working tree.
   */
  private fun integrate(target: RemoteTarget): List<String> {
    if (isEditorDirty()) {
      pullDeferred = true
      return emptyList()
    }

    val tracking = trackingRef(target)?.let { repo.revParse(it) } ?: return emptyList()
    val localRef = "refs/heads/${target.localBranch}"
    // Someone switched branches or detached HEAD.
    if (repo.repository.fullBranch != localRef) return emptyList()
    val before = repo.revParse(localRef)

    if (before != null && isAncestor(tracking, before)) return emptyList()
    if (before != null) checkRelated(target)

    /*
      Only the paths the two sides differ in can collide with the working
      tree; the checkout leaves every other file as it is. A status of the
      whole tree would re-read every file whose index entry is "racily
      clean" — after a clone, all of them: gigabytes on a graph with big
      attachments, a minute on a phone — and JGit, unlike git, never
      writes the refreshed entries back, so every pull would pay it again.
      It would also stop every pull over one file the platform cannot
      represent (two names that differ only in case, on a case-insensitive
      file system), however far it is from what the pull changes.
    */
    val paths = if (before == null) {
      treePaths(tracking).toList()
    } else {
      changedPaths(before, tracking)
    }
    val status = repo.git.status()
      .apply { paths.forEach { addPath(it) } }
      .call()
    /*
      A save that has written files but not committed them yet. Its
      commit comes in a moment, and its push — rejected — pulls again.
    */
    val uncommitted = status.modified + status.changed + status.added +
      status.removed + status.missing + status.conflicting
    if (uncommitted.isNotEmpty()) return emptyList()

    /*
      An untracked file the remote also has — .pins.neno, written on first
      load and committed only with the first pin — would be overwritten by
      the checkout. Committing it lets the usual conflict rules decide
      between the two versions.
    */
    var local = before
    if (status.untracked.isNotEmpty()) {
      val upstreamFiles = treePaths(tracking)
      val colliding = status.untracked.filter { it in upstreamFiles }
      if (colliding.isNotEmpty()) {
        repo.commitPaths(colliding, author)
        local = repo.revParse(localRef)
      }
    }

    val newHead = if (local == null) {
      tracking
    } else {
      Replay(repo.repository, author, now).onto(local, tracking).head
    }
    if (newHead == local) return emptyList()

    // The index matches `local` now, which may have gained a commit above.
    checkout(local, newHead)
    val update = repo.repository.updateRef(localRef)
    update.setNewObjectId(newHead)
    update.setExpectedOldObjectId(local ?: ObjectId.zeroId())
    update.setRefLogMessage("neno: pull", false)
    val result = update.forceUpdate()
    check(
      result in setOf(
        RefUpdate.Result.FORCED,
        RefUpdate.Result.FAST_FORWARD,
        RefUpdate.Result.NEW,
        RefUpdate.Result.NO_CHANGE,
      ),
    ) { "Could not move $localRef: $result" }

    return changedPaths(before, newHead)
  }

  private fun treePaths(commit: ObjectId): Set<String> {
    RevWalk(repo.repository).use { walk ->
      TreeWalk(repo.repository).use { treeWalk ->
        treeWalk.isRecursive = true
        treeWalk.addTree(walk.parseCommit(commit).tree)
        val paths = mutableSetOf<String>()
        while (treeWalk.next()) paths.add(treeWalk.pathString)
        return paths
      }
    }
  }

  /**
   * Updates the index and working tree from `from` to `to`, touching only
   * the paths the two differ in.
   *
   * Not JGit's DirCacheCheckout: it walks the whole working tree and
   * re-reads every file whose index entry is racily clean — after a
   * clone, all of them, gigabytes of attachments on a big graph — which
   * made pulling two notes take a minute on a phone. integrate() has
   * checked these paths for local changes already; nothing else changes.
   */
  private fun checkout(from: ObjectId?, to: ObjectId) {
    val repository = repo.repository
    RevWalk(repository).use { walk ->
      val entries = repo.changedEntries(
        walk,
        from?.let { walk.parseCommit(it) },
        walk.parseCommit(to),
      )
      if (entries.isEmpty()) return
      val dirCache = repository.lockDirCache()
      try {
        val editor = dirCache.editor()
        for (entry in entries) {
          if (entry.changeType == DiffEntry.ChangeType.DELETE) {
            deleteFromWorktree(entry.oldPath)
            editor.add(DirCacheEditor.DeletePath(entry.oldPath))
            continue
          }
          val file = File(repo.dir, entry.newPath)
          file.parentFile?.mkdirs()
          val id = entry.newId.toObjectId()
          // Streamed: an attachment can be bigger than the heap.
          file.outputStream().use { repository.open(id).copyTo(it) }
          if (entry.newMode == FileMode.EXECUTABLE_FILE) file.setExecutable(true)
          val mode = entry.newMode
          val length = file.length()
          val modified = file.toPath().let {
            java.nio.file.Files.getLastModifiedTime(it).toInstant()
          }
          editor.add(object : DirCacheEditor.PathEdit(entry.newPath) {
            override fun apply(dirCacheEntry: DirCacheEntry) {
              dirCacheEntry.setObjectId(id)
              dirCacheEntry.fileMode = mode
              dirCacheEntry.setLength(length)
              dirCacheEntry.setLastModified(modified)
            }
          })
        }
        editor.finish()
        dirCache.write()
        check(dirCache.commit()) { "Could not write the index" }
      } finally {
        dirCache.unlock()
      }
    }
  }

  /** Deletes a file, and the folders it leaves empty, as git does. */
  private fun deleteFromWorktree(path: String) {
    var file: File? = File(repo.dir, path)
    file?.delete()
    file = file?.parentFile
    while (file != null && file != repo.dir && file.list()?.isEmpty() == true) {
      file.delete()
      file = file.parentFile
    }
  }

  private fun changedPaths(from: ObjectId?, to: ObjectId): List<String> {
    RevWalk(repo.repository).use { walk ->
      val toCommit = walk.parseCommit(to)
      val fromCommit = from?.let { walk.parseCommit(it) }
      return repo.changedEntries(walk, fromCommit, toCommit).map {
        if (it.changeType == DiffEntry.ChangeType.DELETE) {
          it.oldPath
        } else {
          it.newPath
        }
      }
    }
  }

  private fun push(target: RemoteTarget) {
    if (countUnpushed(target) == 0) return
    val localRef = "refs/heads/${target.localBranch}"
    val oid = repo.revParse(localRef)
    val results = repo.git.push()
      .setRemote(target.name)
      .setRefSpecs(RefSpec("$localRef:refs/heads/${target.branch}"))
      .setTimeout(networkTimeoutSeconds)
      .setTransportConfigCallback(transport)
      .call()

    for (result in results) {
      for (update in result.remoteUpdates) {
        when (update.status) {
          RemoteRefUpdate.Status.OK, RemoteRefUpdate.Status.UP_TO_DATE -> Unit
          RemoteRefUpdate.Status.REJECTED_NONFASTFORWARD,
          RemoteRefUpdate.Status.REJECTED_REMOTE_CHANGED ->
            throw PushRejectedException("[rejected] non-fast-forward")
          else -> {
            val message = update.message ?: update.status.name
            if (Regex("fetch first|non-fast-forward", RegexOption.IGNORE_CASE)
                .containsMatchIn(message)) {
              throw PushRejectedException(message)
            }
            throw IllegalStateException("Push failed: $message")
          }
        }
      }
    }

    if (!target.hasUpstream) {
      repo.repository.config.apply {
        setString("branch", target.localBranch, "remote", target.name)
        setString("branch", target.localBranch, "merge", "refs/heads/${target.branch}")
        save()
      }
    }

    // The tracking ref is what "unpushed" is counted against.
    if (oid != null) {
      val update = repo.repository.updateRef(
        "refs/remotes/${target.name}/${target.branch}",
      )
      update.setNewObjectId(oid)
      update.forceUpdate()
    }
  }

  private fun reportFailure(error: Throwable) {
    if (disposed) return
    if (error is SyncException) {
      emit(
        status.copy(
          state = SyncState.ERROR,
          error = SyncErrorInfo(error.kind, error.message ?: ""),
        ),
      )
      return
    }
    when (ClassifyError.classify(error)) {
      NetworkFailure.OFFLINE -> emit(status.copy(state = SyncState.OFFLINE, error = null))
      /*
        Still behind after a pull — the pull waited for unsaved changes,
        or another device pushed again in between. The retry sorts it.
      */
      NetworkFailure.REJECTED -> emit(status.copy(state = SyncState.IDLE, error = null))
      NetworkFailure.AUTH -> emit(
        status.copy(
          state = SyncState.ERROR,
          error = SyncErrorInfo(SyncErrorKind.AUTH, ClassifyError.message(error)),
        ),
      )
      NetworkFailure.OTHER -> emit(
        status.copy(
          state = SyncState.ERROR,
          error = SyncErrorInfo(SyncErrorKind.OTHER, ClassifyError.message(error)),
        ),
      )
    }
  }
}
