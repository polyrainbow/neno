package io.github.polyrainbow.neno

import android.content.Context
import io.github.polyrainbow.neno.git.GitRepo
import io.github.polyrainbow.neno.git.GitSync
import io.github.polyrainbow.neno.git.SshIdentity
import io.github.polyrainbow.neno.git.SshSupport
import io.github.polyrainbow.neno.git.SyncState
import io.github.polyrainbow.neno.git.SyncStatus
import io.github.polyrainbow.neno.git.TrustedHosts
import io.github.polyrainbow.neno.storage.GraphStorage
import io.github.polyrainbow.neno.storage.WorktreeLock
import java.io.File

/**
 * The one graph of this app and everything that works on it: storage,
 * the worktree lock, the repository's sync and the SSH identity. One per
 * process, shared by the plugin (while the app is open) and PushWorker
 * (when it is not), so that both take the same lock.
 */
class NenoGraph private constructor(context: Context) {

  /** What the open app wants to hear about. Null while it is closed. */
  interface Listener {
    fun onSyncStatus(status: SyncStatus)
    fun onPathsChanged(paths: List<String>)
  }

  companion object {
    @Volatile
    private var instance: NenoGraph? = null

    fun get(context: Context): NenoGraph = instance ?: synchronized(this) {
      instance ?: NenoGraph(context.applicationContext).also { instance = it }
    }
  }

  val home: File = context.filesDir
  val dir: File = File(home, "graph")
  val lock = WorktreeLock()

  @Volatile
  var listener: Listener? = null

  /** Whether the editor shows unsaved changes; a pull waits for them. */
  @Volatile
  var editorDirty = false

  init {
    /*
      JGit looks for a global git config under user.home, which Android
      leaves empty. Point it at the app's own storage, where there is
      none, rather than at the root of the file system.
    */
    System.setProperty("user.home", home.absolutePath)
  }

  val ssh: SshSupport by lazy {
    val sshDir = File(home, ".ssh")
    SshSupport(
      home,
      SshIdentity(sshDir, KeystoreSecretBox()),
      TrustedHosts(File(sshDir, "neno_known_hosts")),
    )
  }

  private var storage: GraphStorage? = null
  private var sync: GitSync? = null

  val exists: Boolean get() = dir.isDirectory

  @Synchronized
  fun storage(): GraphStorage? {
    if (!exists) return null
    return storage ?: GraphStorage(dir).also { storage = it }
  }

  /** The graph's sync, started on first use. Null without a graph. */
  @Synchronized
  fun sync(): GitSync? {
    if (!exists) return null
    sync?.let { return it }
    val created = GitSync(
      repo = GitRepo(dir),
      lock = lock,
      transport = ssh.transport,
      onStatus = {
        if (it.state == SyncState.IDLE && it.lastSyncedAt != null) {
          ssh.identity.confirmAccepted()
        }
        listener?.onSyncStatus(it)
      },
      onPathsChanged = { listener?.onPathsChanged(it) },
      isEditorDirty = { editorDirty },
    )
    sync = created
    created.start()
    return created
  }

  /** Forgets the open repository, e.g. after a clone replaced the folder. */
  @Synchronized
  fun reset() {
    storage?.closeAllStreams()
    storage = null
    sync?.dispose()
    sync = null
  }
}
