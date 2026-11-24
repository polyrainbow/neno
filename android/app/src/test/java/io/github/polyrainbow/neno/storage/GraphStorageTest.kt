package io.github.polyrainbow.neno.storage

import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertThrows
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import java.io.File

class GraphStorageTest {
  @get:Rule
  val temp = TemporaryFolder()

  private lateinit var root: File
  private lateinit var storage: GraphStorage

  @Before
  fun setUp() {
    root = temp.newFolder("graph")
    storage = GraphStorage(root)
  }

  private fun readAll(streamId: Int): ByteArray {
    val out = java.io.ByteArrayOutputStream()
    while (true) {
      val chunk = storage.readChunk(streamId) ?: break
      out.write(chunk)
    }
    return out.toByteArray()
  }

  @Test
  fun writesAndReadsText() {
    storage.writeObject("a.subtext", "Grüße 🌱")
    assertEquals("Grüße 🌱", storage.readObjectAsString("a.subtext"))
  }

  @Test
  fun createsParentFolders() {
    storage.writeObject("files/sub/x.txt", "x")
    assertEquals("x", File(root, "files/sub/x.txt").readText())
  }

  @Test
  fun leavesNoTemporaryFileBehind() {
    storage.writeObject("a.subtext", "one")
    storage.writeObject("a.subtext", "two")
    assertEquals(listOf("a.subtext"), root.list()!!.toList())
    assertEquals("two", storage.readObjectAsString("a.subtext"))
  }

  @Test
  fun readsManyInOrder() {
    storage.writeObject("a.subtext", "A")
    storage.writeObject("b.subtext", "B")
    assertEquals(
      listOf("B", "A"),
      storage.readObjectsAsStrings(listOf("b.subtext", "a.subtext")),
    )
  }

  @Test
  fun reportsMissingFilesAsEnoent() {
    val e = assertThrows(BridgeException::class.java) {
      storage.readObjectAsString("missing.subtext")
    }
    assertEquals("ENOENT", e.code)
    assertEquals("ENOENT", assertThrows(BridgeException::class.java) {
      storage.removeObject("missing.subtext")
    }.code)
    assertEquals("ENOENT", assertThrows(BridgeException::class.java) {
      storage.getObjectSize("missing.subtext")
    }.code)
    assertEquals("ENOENT", assertThrows(BridgeException::class.java) {
      storage.renameObject("missing.subtext", "b.subtext")
    }.code)
  }

  @Test
  fun refusesPathsOutsideTheGraph() {
    assertThrows(BridgeException::class.java) {
      storage.writeObject("../escape.txt", "x")
    }
    assertThrows(BridgeException::class.java) {
      storage.readObjectAsString("files/./a")
    }
    assertFalse(File(root.parentFile, "escape.txt").exists())
  }

  @Test
  fun listsNamesRecursivelyWithoutTheRepository() {
    storage.writeObject("a.subtext", "A")
    storage.writeObject("files/b.png", "B")
    File(root, ".git/objects").mkdirs()
    File(root, ".git/HEAD").writeText("ref: refs/heads/main\n")
    assertEquals(
      listOf("a.subtext", "files/b.png"),
      storage.getAllObjectNames().sorted(),
    )
    assertEquals(listOf("files"), storage.listSubDirectories(""))
    assertEquals(2L, storage.getTotalSize())
  }

  @Test
  fun normalizesNamesToNfc() {
    // "é" as e + combining acute accent (NFD).
    File(root, "café.subtext").writeText("x")
    assertEquals(listOf("café.subtext"), storage.getAllObjectNames())
  }

  @Test
  fun renameReplacesAnExistingTarget() {
    storage.writeObject("a.subtext", "A")
    storage.writeObject("b.subtext", "B")
    storage.renameObject("a.subtext", "b.subtext")
    assertEquals(listOf("b.subtext"), storage.getAllObjectNames())
    assertEquals("A", storage.readObjectAsString("b.subtext"))
  }

  @Test
  fun streamsAFileInChunks() {
    val bytes = ByteArray(GraphStorage.CHUNK_SIZE * 2 + 17) { (it % 251).toByte() }
    File(root, "big.bin").writeBytes(bytes)
    val opened = storage.openRead("big.bin")
    assertEquals(bytes.size.toLong(), opened.size)
    assertArrayEquals(bytes, readAll(opened.streamId))
    // The session is gone once exhausted.
    assertThrows(BridgeException::class.java) {
      storage.readChunk(opened.streamId)
    }
  }

  @Test
  fun readsAnInclusiveRange() {
    File(root, "f.bin").writeBytes(byteArrayOf(0, 1, 2, 3, 4, 5, 6, 7))
    val opened = storage.openRead("f.bin", 2L..5L)
    assertEquals(8L, opened.size)
    assertArrayEquals(byteArrayOf(2, 3, 4, 5), readAll(opened.streamId))
  }

  @Test
  fun clampsARangeToTheFile() {
    File(root, "f.bin").writeBytes(byteArrayOf(0, 1, 2))
    val opened = storage.openRead("f.bin", 1L..100L)
    assertArrayEquals(byteArrayOf(1, 2), readAll(opened.streamId))
  }

  @Test
  fun readsAnEmptyFile() {
    File(root, "empty.bin").writeBytes(ByteArray(0))
    val opened = storage.openRead("empty.bin")
    assertNull(storage.readChunk(opened.streamId))
  }

  @Test
  fun writesAStreamAndMovesItIntoPlace() {
    val id = storage.openWrite("files/x.bin")
    storage.writeChunk(id, byteArrayOf(1, 2))
    assertFalse(File(root, "files/x.bin").exists())
    storage.writeChunk(id, byteArrayOf(3))
    assertEquals(3L, storage.closeWrite(id))
    assertArrayEquals(byteArrayOf(1, 2, 3), File(root, "files/x.bin").readBytes())
    assertEquals(listOf("files/x.bin"), storage.getAllObjectNames())
  }

  @Test
  fun abortedStreamLeavesNothing() {
    val id = storage.openWrite("x.bin")
    storage.writeChunk(id, byteArrayOf(1))
    storage.abortWrite(id)
    assertTrue(storage.getAllObjectNames().isEmpty())
    assertTrue(root.list()!!.isEmpty())
  }
}
