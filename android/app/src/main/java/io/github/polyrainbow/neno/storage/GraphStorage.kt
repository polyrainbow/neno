package io.github.polyrainbow.neno.storage

import java.io.File
import java.io.IOException
import java.io.InputStream
import java.io.OutputStream
import java.io.RandomAccessFile
import java.nio.file.AtomicMoveNotSupportedException
import java.nio.file.FileAlreadyExistsException
import java.nio.file.Files
import java.nio.file.NoSuchFileException
import java.nio.file.StandardCopyOption
import java.text.Normalizer
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicInteger

/**
 * A failure the storage bridge reports with a POSIX-style code, so the
 * notes worker can branch on `err.code` (ENOENT, EEXIST, …) as it does
 * against Node's fs on the desktop.
 */
class BridgeException(
  message: String,
  val code: String? = null,
  cause: Throwable? = null,
) : Exception(message, cause)

/**
 * The graph folder in the app's private storage, behind the methods of
 * the StorageProvider contract (src/lib/notes/types/StorageProvider.ts).
 * The Android counterpart of electron/storage/NodeFsStorageProvider.ts,
 * whose behaviour it mirrors: graph-relative paths that may not escape
 * the folder, parent folders created on write, NFC names, inclusive
 * byte ranges, and chunked streams for anything too big for one message.
 *
 * Pure JVM — no Android API — so it is tested with plain JUnit.
 */
class GraphStorage(val root: File) {

  companion object {
    /** Bytes per readChunk. Base64 adds a third on the wire. */
    const val CHUNK_SIZE = 256 * 1024

    /*
      The repository lives inside the graph folder. Its objects are never
      graph files, and walking them would only slow every graph load.
    */
    private const val GIT_DIR = ".git"

    /** Written next to their target and moved over it when complete. */
    private const val TEMP_SUFFIX = ".neno-tmp"
  }

  private class ReadSession(val input: InputStream, var remaining: Long)

  private class WriteSession(
    val target: File,
    val temp: File,
    val output: OutputStream,
  )

  private val nextStreamId = AtomicInteger(1)
  private val readSessions = ConcurrentHashMap<Int, ReadSession>()
  private val writeSessions = ConcurrentHashMap<Int, WriteSession>()

  /**
   * Resolves a graph-relative request path, rejecting anything that
   * would escape the graph folder.
   */
  fun resolve(requestPath: String): File {
    val segments = requestPath.split("/").filter { it.isNotEmpty() }
    if (segments.any { it == "." || it == ".." }) {
      throw BridgeException("Invalid request path: $requestPath")
    }
    return segments.fold(root) { dir, segment -> File(dir, segment) }
  }

  private fun nfc(name: String): String =
    Normalizer.normalize(name, Normalizer.Form.NFC)

  private fun <T> mappingErrors(path: String, block: () -> T): T {
    try {
      return block()
    } catch (e: NoSuchFileException) {
      throw BridgeException("No such file: $path", "ENOENT", e)
    } catch (e: java.io.FileNotFoundException) {
      throw BridgeException("No such file: $path", "ENOENT", e)
    } catch (e: FileAlreadyExistsException) {
      throw BridgeException("File exists: $path", "EEXIST", e)
    }
  }

  private fun requireFile(file: File, requestPath: String) {
    if (!file.isFile) {
      throw BridgeException("No such file: $requestPath", "ENOENT")
    }
  }

  fun readObjectAsString(requestPath: String): String =
    mappingErrors(requestPath) {
      String(Files.readAllBytes(resolve(requestPath).toPath()), Charsets.UTF_8)
    }

  /** A whole graph load in one bridge round-trip. */
  fun readObjectsAsStrings(requestPaths: List<String>): List<String> =
    requestPaths.map { readObjectAsString(it) }

  fun getAllObjectNames(): List<String> {
    val names = mutableListOf<String>()
    fun walk(dir: File, prefix: String) {
      val entries = dir.listFiles() ?: return
      for (entry in entries) {
        val name = nfc(entry.name)
        if (prefix.isEmpty() && name == GIT_DIR) continue
        if (name.endsWith(TEMP_SUFFIX)) continue
        if (entry.isDirectory) {
          walk(entry, "$prefix$name/")
        } else {
          names.add(prefix + name)
        }
      }
    }
    walk(root, "")
    return names
  }

  /*
    Written to a temporary file and moved into place, so an app killed
    mid-write — which on a phone is routine — never leaves half a note.
  */
  fun writeObject(requestPath: String, data: String) {
    val target = resolve(requestPath)
    target.parentFile?.mkdirs()
    val temp = File(target.parentFile, ".${target.name}$TEMP_SUFFIX")
    temp.writeBytes(data.toByteArray(Charsets.UTF_8))
    moveReplacing(temp, target)
  }

  private fun moveReplacing(from: File, to: File) {
    try {
      Files.move(
        from.toPath(),
        to.toPath(),
        StandardCopyOption.REPLACE_EXISTING,
        StandardCopyOption.ATOMIC_MOVE,
      )
    } catch (_: AtomicMoveNotSupportedException) {
      Files.move(from.toPath(), to.toPath(), StandardCopyOption.REPLACE_EXISTING)
    }
  }

  /** Replaces an existing target, as Node's fs.rename does. */
  fun renameObject(oldRequestPath: String, newRequestPath: String) {
    val from = resolve(oldRequestPath)
    val to = resolve(newRequestPath)
    mappingErrors(oldRequestPath) {
      to.parentFile?.mkdirs()
      moveReplacing(from, to)
    }
  }

  fun removeObject(requestPath: String) {
    mappingErrors(requestPath) {
      Files.delete(resolve(requestPath).toPath())
    }
  }

  fun getObjectSize(requestPath: String): Long {
    val file = resolve(requestPath)
    requireFile(file, requestPath)
    return file.length()
  }

  fun getTotalSize(): Long {
    fun size(dir: File): Long = (dir.listFiles() ?: emptyArray()).sumOf {
      when {
        dir == root && it.name == GIT_DIR -> 0L
        it.isDirectory -> size(it)
        else -> it.length()
      }
    }
    return size(root)
  }

  fun listSubDirectories(requestPath: String): List<String> {
    val dir = resolve(requestPath)
    if (!dir.isDirectory) {
      throw BridgeException("No such directory: $requestPath", "ENOENT")
    }
    return (dir.listFiles() ?: emptyArray())
      .filter { it.isDirectory && !(dir == root && it.name == GIT_DIR) }
      .map { nfc(it.name) }
  }

  /*
    STREAMS

    A ReadableStream cannot cross into native code, so, as on the desktop,
    reads are pulled one chunk at a time and writes pushed one at a time.
  */

  data class OpenRead(val streamId: Int, val size: Long)

  /** `range` is inclusive at both ends, like Node's createReadStream. */
  fun openRead(requestPath: String, range: LongRange? = null): OpenRead {
    val file = resolve(requestPath)
    requireFile(file, requestPath)
    val size = file.length()
    val input: InputStream
    val remaining: Long
    if (range != null) {
      val raf = RandomAccessFile(file, "r")
      raf.seek(range.first)
      input = java.nio.channels.Channels.newInputStream(raf.channel)
      remaining = (minOf(range.last, size - 1) - range.first + 1)
        .coerceAtLeast(0)
    } else {
      input = file.inputStream()
      remaining = size
    }
    val streamId = nextStreamId.getAndIncrement()
    readSessions[streamId] = ReadSession(input, remaining)
    return OpenRead(streamId, size)
  }

  /** Null once the stream is exhausted, which also ends the session. */
  fun readChunk(streamId: Int): ByteArray? {
    val session = readSessions[streamId]
      ?: throw BridgeException("Unknown read stream: $streamId")
    val wanted = minOf(CHUNK_SIZE.toLong(), session.remaining).toInt()
    val buffer = ByteArray(wanted)
    val read = if (wanted == 0) -1 else session.input.read(buffer)
    if (read <= 0) {
      closeRead(streamId)
      return null
    }
    session.remaining -= read
    return if (read == wanted) buffer else buffer.copyOf(read)
  }

  fun closeRead(streamId: Int) {
    readSessions.remove(streamId)?.input?.close()
  }

  fun openWrite(requestPath: String): Int {
    val target = resolve(requestPath)
    target.parentFile?.mkdirs()
    val temp = File(target.parentFile, ".${target.name}$TEMP_SUFFIX")
    val streamId = nextStreamId.getAndIncrement()
    writeSessions[streamId] = WriteSession(target, temp, temp.outputStream())
    return streamId
  }

  fun writeChunk(streamId: Int, bytes: ByteArray) {
    val session = writeSessions[streamId]
      ?: throw BridgeException("Unknown write stream: $streamId")
    session.output.write(bytes)
  }

  /** Moves the finished file into place; returns its size in bytes. */
  fun closeWrite(streamId: Int): Long {
    val session = writeSessions.remove(streamId)
      ?: throw BridgeException("Unknown write stream: $streamId")
    session.output.close()
    moveReplacing(session.temp, session.target)
    return session.target.length()
  }

  fun abortWrite(streamId: Int) {
    val session = writeSessions.remove(streamId) ?: return
    try {
      session.output.close()
    } catch (_: IOException) {
      // Closing is all that is left to do.
    }
    session.temp.delete()
  }

  /** Ends every open stream, e.g. when the graph is closed. */
  fun closeAllStreams() {
    readSessions.keys.toList().forEach { closeRead(it) }
    writeSessions.keys.toList().forEach { abortWrite(it) }
  }
}
