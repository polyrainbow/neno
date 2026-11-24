package io.github.polyrainbow.neno

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.DocumentsContract
import androidx.activity.result.ActivityResult
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin
import io.github.polyrainbow.neno.git.ClassifyError
import io.github.polyrainbow.neno.git.FlushChanges
import io.github.polyrainbow.neno.git.GitAuthor
import io.github.polyrainbow.neno.git.GitRepo
import io.github.polyrainbow.neno.git.NetworkFailure
import io.github.polyrainbow.neno.git.SyncStatus
import io.github.polyrainbow.neno.git.TrustedHosts
import io.github.polyrainbow.neno.storage.BridgeException
import io.github.polyrainbow.neno.storage.GraphStorage
import org.eclipse.jgit.api.Git
import org.eclipse.jgit.lib.ProgressMonitor
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.OutputStream
import java.util.Base64
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicInteger

/**
 * The native half of the Android app, reached from
 * src/lib/android/nativePlugin.ts.
 *
 * `call` serves the storage bridge: the notes worker's `{method, args}`
 * requests arrive here unchanged (src/lib/android/AndroidBridgeHost.ts
 * forwards them), so `storage.…` and `git.…` mean what they mean in
 * electron/storage/bridge.ts. Binary data travels as `{ "$b64": … }`.
 *
 * The graph lives in Context.filesDir/graph: the app's private storage,
 * which no other app, the Files app or USB access can see.
 */
@CapacitorPlugin(name = "Neno")
class NenoPlugin : Plugin(), NenoGraph.Listener {

  private lateinit var graph: NenoGraph

  /*
    Plugin methods arrive on one Capacitor thread. Storage work runs on a
    small pool, and git — which may wait on the network — on threads of
    its own, so that neither ever queues up the other.
  */
  private val io: ExecutorService = Executors.newFixedThreadPool(4)
  private val gitThreads: ExecutorService = Executors.newCachedThreadPool()

  /* Streamed writes hold the worktree lock until they close. */
  private val lockedWriteStreams = ConcurrentHashMap.newKeySet<Int>()

  override fun load() {
    graph = NenoGraph.get(context)
    graph.listener = this
  }

  override fun handleOnDestroy() {
    graph.listener = null
    graph.storage()?.closeAllStreams()
    io.shutdown()
    gitThreads.shutdown()
  }

  /*
    The app in the foreground is the desktop's focused window: pull now
    and then every few minutes. Leaving it hands any unpushed commit to
    PushWorker.
  */
  override fun handleOnResume() {
    PushWorker.cancel(context)
    gitThreads.execute { graph.sync()?.foregrounded() }
  }

  override fun handleOnPause() {
    gitThreads.execute {
      val sync = graph.sync() ?: return@execute
      sync.backgrounded()
      val status = sync.getStatus()
      if (status.enabled && status.unpushedCommits > 0) {
        PushWorker.enqueue(context)
      }
    }
  }

  override fun onSyncStatus(status: SyncStatus) {
    notifyListeners("syncStatus", JSObject().put("status", status.toJson()))
  }

  override fun onPathsChanged(paths: List<String>) {
    notifyListeners(
      "bridgeEvent",
      JSObject().put("event", "pathsChanged").put("paths", JSONArray(paths)),
    )
  }

  /*
    Runs `block` on `pool` and settles `call` with its result. Throwable,
    not Exception: an Error on a pool thread — a library reaching for an
    API this Android lacks — would otherwise take the whole app down
    instead of failing one call.
  */
  private fun respond(
    call: PluginCall,
    pool: ExecutorService = gitThreads,
    block: () -> JSObject?,
  ) {
    pool.execute {
      try {
        val result = block()
        if (result == null) call.resolve() else call.resolve(result)
      } catch (e: BridgeException) {
        call.reject(e.message, e.code)
      } catch (e: Throwable) {
        call.reject(ClassifyError.message(e))
      }
    }
  }

  /*
    GRAPH FOLDER
  */

  private fun graphInfo(): JSObject = JSObject()
    .put("path", graph.dir.absolutePath)
    .put("exists", graph.exists)

  @PluginMethod
  fun getGraphInfo(call: PluginCall) {
    call.resolve(graphInfo())
  }

  @PluginMethod
  fun createGraph(call: PluginCall) {
    graph.dir.mkdirs()
    call.resolve(graphInfo())
  }

  @PluginMethod
  fun setUnsavedChanges(call: PluginCall) {
    val dirty = call.getBoolean("value", false) == true
    val wasDirty = graph.editorDirty
    graph.editorDirty = dirty
    call.resolve()
    if (wasDirty && !dirty) {
      gitThreads.execute { graph.sync()?.editorBecameClean() }
    }
  }

  /*
    STORAGE BRIDGE
  */

  @PluginMethod
  fun call(call: PluginCall) {
    val method = call.getString("method")
      ?: return call.reject("method missing")
    val args = call.getArray("args") ?: JSArray()
    val pool = if (method.startsWith("git.")) gitThreads else io
    pool.execute {
      try {
        val result = dispatch(method, args)
        call.resolve(JSObject().put("result", toJson(result)))
      } catch (e: BridgeException) {
        call.reject(e.message, e.code)
      } catch (e: Throwable) {
        call.reject(ClassifyError.message(e))
      }
    }
  }

  private fun dispatch(method: String, args: JSONArray): Any? {
    if (method.startsWith("storage.")) {
      return dispatchStorage(method.removePrefix("storage."), args)
    }
    if (method.startsWith("git.")) {
      return dispatchGit(method.removePrefix("git."), args)
    }
    throw BridgeException("Unknown bridge method: $method")
  }

  private fun requireStorage(): GraphStorage = graph.storage()
    ?: throw BridgeException("The graph has not been set up", "ENOENT")

  private fun dispatchStorage(name: String, args: JSONArray): Any? {
    val s = requireStorage()
    val lock = graph.lock
    return when (name) {
      "readObjectAsString" -> s.readObjectAsString(args.getString(0))
      "readObjectsAsStrings" -> s.readObjectsAsStrings(stringList(args, 0))
      "getAllObjectNames" -> s.getAllObjectNames()
      "getObjectSize" -> s.getObjectSize(args.getString(0))
      "getTotalSize" -> s.getTotalSize()
      "listSubDirectories" -> s.listSubDirectories(args.getString(0))
      "writeObject" -> lock.withLock {
        s.writeObject(args.getString(0), args.getString(1))
      }
      "removeObject" -> lock.withLock { s.removeObject(args.getString(0)) }
      "renameObject" -> lock.withLock {
        s.renameObject(args.getString(0), args.getString(1))
      }
      "openRead" -> {
        val range = args.optJSONObject(1)
          ?.let { it.getLong("start")..it.getLong("end") }
        val opened = s.openRead(args.getString(0), range)
        mapOf("streamId" to opened.streamId, "size" to opened.size)
      }
      "readChunk" -> s.readChunk(args.getInt(0))
      "closeRead" -> s.closeRead(args.getInt(0))
      "openWrite" -> {
        lock.acquire()
        try {
          val streamId = s.openWrite(args.getString(0))
          lockedWriteStreams.add(streamId)
          mapOf("streamId" to streamId)
        } catch (e: Throwable) {
          lock.release()
          throw e
        }
      }
      "writeChunk" -> s.writeChunk(args.getInt(0), binary(args, 1))
      "closeWrite" -> {
        val streamId = args.getInt(0)
        try {
          s.closeWrite(streamId)
        } finally {
          releaseWriteLock(streamId)
        }
      }
      "abortWrite" -> {
        val streamId = args.getInt(0)
        try {
          s.abortWrite(streamId)
        } finally {
          releaseWriteLock(streamId)
        }
      }
      else -> throw BridgeException("Unknown bridge method: storage.$name")
    }
  }

  private fun releaseWriteLock(streamId: Int) {
    if (lockedWriteStreams.remove(streamId)) graph.lock.release()
  }

  /*
    The repository: what electron/storage/bridge.ts's #gitMethods do.
    `git.diff` never arrives here — AndroidBridgeHost asks for
    `git.fileVersions` instead and computes the line diff with the
    desktop's own src/lib/git/diff.ts.
  */
  private fun dispatchGit(name: String, args: JSONArray): Any? {
    val sync = graph.sync()
      ?: throw BridgeException("The graph has not been set up", "ENOENT")
    val repo = sync.repo
    return when (name) {
      "hasRepo" -> repo.exists()
      "setAuthor" -> {
        sync.author = GitAuthor.fromJson(args.optJSONObject(0))
        null
      }
      "init" -> {
        graph.lock.withLock { repo.init(GitAuthor.fromJson(args.optJSONObject(0))) }
        sync.refreshStatus()
        null
      }
      "commit" -> sync.commit(
        FlushChanges.fromJson(args.getJSONObject(0)),
        GitAuthor.fromJson(args.optJSONObject(1)),
      )
      "log" -> {
        val options = args.getJSONObject(0)
        repo.log(options.getInt("limit"), options.getInt("offset"))
          .map { it.toJson() }
      }
      "fileVersions" -> repo.fileVersions(args.getString(0)).map { it.toJson() }
      else -> throw BridgeException("Unknown bridge method: git.$name")
    }
  }

  /*
    SYNC
  */

  @PluginMethod
  fun getSyncStatus(call: PluginCall) = respond(call) {
    JSObject().put("status", graph.sync()?.getStatus()?.toJson() ?: JSONObject.NULL)
  }

  @PluginMethod
  fun setAutoSync(call: PluginCall) {
    val enabled = call.getBoolean("enabled", false) == true
    respond(call) {
      val sync = graph.sync() ?: throw IllegalStateException("No graph is open")
      JSObject().put("status", sync.setAutoSync(enabled).toJson())
    }
  }

  @PluginMethod
  fun syncNow(call: PluginCall) = respond(call) {
    graph.sync()?.syncNow()?.get()
    null
  }

  /*
    SETTING UP SYNC: this device's key, the server's host key, the clone.
    On the desktop, a remote is set up on the command line; on a phone,
    cloning is the way a graph gets one.
  */

  @PluginMethod
  fun getPublicKey(call: PluginCall) = respond(call) {
    val identity = graph.ssh.identity
    JSObject()
      .put("publicKey", identity.publicKeyLine())
      .put("replaced", identity.wasReplaced())
  }

  /**
   * Tries to reach `url` and reports what stands in the way: nothing, an
   * unknown host key to confirm, a changed one, the key not authorized
   * yet, or no network.
   */
  @PluginMethod
  fun probeRemote(call: PluginCall) {
    val url = call.getString("url")?.trim() ?: return call.reject("url missing")
    respond(call) {
      val host = TrustedHosts.hostKeyFor(url)
      val hosts = graph.ssh.trustedHosts
      try {
        Git.lsRemoteRepository()
          .setRemote(url)
          .setTimeout(20)
          .setTransportConfigCallback(graph.ssh.transport)
          .call()
        JSObject().put("state", "ok")
      } catch (e: Throwable) {
        val presented = hosts.presentedKey(host)
        when {
          hosts.hasChanged(host) -> JSObject()
            .put("state", "hostKeyChanged")
            .put("host", host)
          presented != null && !hosts.isTrusted(host) -> JSObject()
            .put("state", "unknownHost")
            .put("host", host)
            .put("fingerprint", TrustedHosts.fingerprint(presented))
          else -> JSObject()
            .put(
              "state",
              when (ClassifyError.classify(e)) {
                NetworkFailure.AUTH -> "auth"
                NetworkFailure.OFFLINE -> "offline"
                else -> "error"
              },
            )
            .put("message", ClassifyError.message(e))
        }
      }
    }
  }

  /** Trusts the key the host presented, if it is the one the user saw. */
  @PluginMethod
  fun trustHost(call: PluginCall) {
    val url = call.getString("url")?.trim() ?: return call.reject("url missing")
    val fingerprint = call.getString("fingerprint") ?: return call.reject("fingerprint missing")
    respond(call) {
      val host = TrustedHosts.hostKeyFor(url)
      val hosts = graph.ssh.trustedHosts
      val key = hosts.presentedKey(host)
        ?: throw IllegalStateException("$host has not presented a key")
      check(TrustedHosts.fingerprint(key) == fingerprint) {
        "The host key of $host changed while you were looking at it"
      }
      hosts.trust(host, key)
      null
    }
  }

  /**
   * Clones `url` as this device's graph — its newest commit only, see
   * GitRepo.cloneShallow — and switches auto-sync on.
   * Refuses when a graph with notes exists already.
   */
  @PluginMethod
  fun cloneGraph(call: PluginCall) {
    val url = call.getString("url")?.trim() ?: return call.reject("url missing")
    respond(call) {
      val target = graph.dir
      if (target.isDirectory && !target.list().isNullOrEmpty()) {
        throw IllegalStateException("This device already has a graph")
      }
      val staging = File(graph.home, "graph.cloning")
      staging.deleteRecursively()
      GitRepo.cloneShallow(
        url,
        staging,
        graph.ssh.transport,
        CloneProgress(),
      ).close()
      // In place only once complete, so a cancelled clone leaves no graph.
      graph.reset()
      target.delete()
      check(staging.renameTo(target)) { "Could not move the clone into place" }
      graphInfo()
    }
  }

  /** Reports the clone's progress as "cloneProgress" events. */
  private inner class CloneProgress : ProgressMonitor {
    private var task = ""
    private var total = 0
    private var done = 0
    private var lastSent = 0L

    private fun send(force: Boolean = false) {
      val now = System.currentTimeMillis()
      if (!force && now - lastSent < 200) return
      lastSent = now
      notifyListeners(
        "cloneProgress",
        JSObject().put("task", task).put("done", done).put("total", total),
      )
    }

    override fun start(totalTasks: Int) = Unit
    override fun beginTask(title: String, totalWork: Int) {
      task = title
      total = totalWork
      done = 0
      send(force = true)
    }
    override fun update(completed: Int) {
      done += completed
      send()
    }
    override fun endTask() = send(force = true)
    override fun isCancelled() = false
    override fun showDuration(enabled: Boolean) = Unit
  }

  /*
    SAVE DIALOG — the system's "create document" picker, written to in
    chunks like the desktop's save dialog.
  */

  private val nextSaveSessionId = AtomicInteger(1)
  private val saveSessions = ConcurrentHashMap<Int, Pair<Uri, OutputStream>>()

  @PluginMethod
  fun pickSaveTarget(call: PluginCall) {
    val intent = Intent(Intent.ACTION_CREATE_DOCUMENT)
      .addCategory(Intent.CATEGORY_OPENABLE)
      .setType(call.getString("mimeType") ?: "application/octet-stream")
      .putExtra(Intent.EXTRA_TITLE, call.getString("suggestedName") ?: "")
    startActivityForResult(call, intent, "onSaveTargetPicked")
  }

  @ActivityCallback
  private fun onSaveTargetPicked(call: PluginCall?, result: ActivityResult) {
    if (call == null) return
    val uri = result.data?.data
    if (result.resultCode != Activity.RESULT_OK || uri == null) {
      call.resolve(JSObject().put("sessionId", JSONObject.NULL))
      return
    }
    val output = context.contentResolver.openOutputStream(uri, "wt")
      ?: return call.reject("Cannot write to the chosen file")
    val sessionId = nextSaveSessionId.getAndIncrement()
    saveSessions[sessionId] = uri to output
    call.resolve(JSObject().put("sessionId", sessionId))
  }

  @PluginMethod
  fun saveChunk(call: PluginCall) {
    val sessionId = call.getInt("sessionId") ?: return call.reject("no id")
    val data = call.getString("data") ?: return call.reject("no data")
    respond(call, io) {
      val (_, output) = saveSessions[sessionId]
        ?: throw BridgeException("Unknown save session: $sessionId")
      output.write(Base64.getDecoder().decode(data))
      null
    }
  }

  @PluginMethod
  fun closeSave(call: PluginCall) {
    val sessionId = call.getInt("sessionId") ?: return call.reject("no id")
    respond(call, io) {
      saveSessions.remove(sessionId)?.second?.close()
      null
    }
  }

  @PluginMethod
  fun abortSave(call: PluginCall) {
    val sessionId = call.getInt("sessionId") ?: return call.reject("no id")
    respond(call, io) {
      saveSessions.remove(sessionId)?.let { (uri, output) ->
        runCatching { output.close() }
        // Leave no empty file behind in the user's folder.
        runCatching {
          DocumentsContract.deleteDocument(context.contentResolver, uri)
        }
      }
      null
    }
  }

  /*
    JSON
  */

  private fun stringList(args: JSONArray, index: Int): List<String> {
    val array = args.getJSONArray(index)
    return List(array.length()) { array.getString(it) }
  }

  private fun binary(args: JSONArray, index: Int): ByteArray =
    Base64.getDecoder().decode(args.getJSONObject(index).getString("\$b64"))

  private fun toJson(value: Any?): Any = when (value) {
    null, Unit -> JSONObject.NULL
    is ByteArray -> JSONObject()
      .put("\$b64", Base64.getEncoder().encodeToString(value))
    is List<*> -> JSONArray().also { array ->
      value.forEach { array.put(toJson(it)) }
    }
    is Map<*, *> -> JSONObject().also { obj ->
      value.forEach { (k, v) -> obj.put(k.toString(), toJson(v)) }
    }
    else -> value
  }
}
