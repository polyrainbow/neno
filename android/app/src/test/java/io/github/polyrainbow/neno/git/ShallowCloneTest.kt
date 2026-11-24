package io.github.polyrainbow.neno.git

import io.github.polyrainbow.neno.storage.WorktreeLock
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import java.io.File

/**
 * The phone's graph is a shallow clone: only the newest commit of a
 * history that can be gigabytes. Everything GitSync does walks history
 * — the replay's "who touched this file last", unpushed commits, merge
 * bases — so it is run here against a clone that stops at its boundary.
 */
class ShallowCloneTest {
  @get:Rule
  val temp = TemporaryFolder()

  private lateinit var remote: File
  private lateinit var b: File
  private lateinit var phone: File
  private val syncs = mutableListOf<GitSync>()
  private val hour = 3600L

  @Before
  fun setUp() {
    assumeSystemGit()
    remote = File(temp.root, "remote.git")
    b = File(temp.root, "b")
    phone = File(temp.root, "phone")
    git(temp.root, "init", "--quiet", "--bare", "--initial-branch=main", remote.path)
    git(temp.root, "clone", "--quiet", remote.path, b.path)
    // A history the phone should not have to download.
    for (i in 1..5) {
      write(b, "shared.subtext", "line 1\nversion $i\nline 3\n")
      write(b, "files/big-$i.bin", ByteArray(50_000) { i.toByte() })
      git(b, "add", ".")
      git(b, "commit", "--quiet", "-m", "revision $i")
    }
    git(b, "push", "--quiet", "origin", "main")
    GitRepo.cloneShallow("file://${remote.path}", phone, null).close()
  }

  @After
  fun tearDown() {
    syncs.forEach { it.dispose() }
  }

  private fun makeSync() = GitSync(
    repo = GitRepo(phone),
    lock = WorktreeLock(),
    retryDelaysMs = listOf(3_600_000L),
  ).also { syncs.add(it); it.start() }

  private fun pushFromB(path: String, content: String, ageSeconds: Long = 0) {
    git(b, "pull", "--quiet", "--rebase")
    write(b, path, content)
    git(b, "add", path)
    val date = "${System.currentTimeMillis() / 1000 - ageSeconds} +0000"
    git(b, "commit", "--quiet", "-m", "b: $path", "--date=$date")
    git(b, "push", "--quiet")
  }

  private fun saveOnPhone(sync: GitSync, slug: String, content: String) {
    sync.lock.withLock { write(phone, "$slug.subtext", content) }
    sync.commit(notes(slug), AUTHOR)
  }

  @Test
  fun fetchesOnlyTheNewestCommit() {
    assertEquals("1", git(phone, "rev-list", "--count", "HEAD"))
    assertTrue(File(phone, ".git/shallow").exists())
    assertEquals("line 1\nversion 5\nline 3\n", read(phone, "shared.subtext"))
    assertEquals("true", git(phone, "config", "--local", "neno.autoSync"))
  }

  @Test
  fun showsTheBoundaryAsACommitWithoutChanges() {
    val repo = GitRepo(phone)
    val log = repo.log(10, 0)
    assertEquals(listOf("revision 5"), log.map { it.message.trim() })
    assertTrue(log.single().changes.isEmpty())
    assertTrue(repo.fileVersions(log.single().oid).isEmpty())
    repo.close()
  }

  @Test
  fun pushesWhatThePhoneSaved() {
    val sync = makeSync()
    assertEquals(SyncState.IDLE, sync.getStatus().state)
    assertEquals(0, sync.getStatus().unpushedCommits)

    saveOnPhone(sync, "hello", "Hello from the phone")
    sync.awaitIdle()

    assertEquals("create: hello", git(remote, "log", "-1", "--format=%s", "main"))
    assertEquals(0, sync.getStatus().unpushedCommits)
    assertEquals(null, sync.getStatus().error)
  }

  @Test
  fun pullsWhatTheDesktopPushed() {
    val sync = makeSync()
    pushFromB("from-desktop.subtext", "Hi")

    sync.syncNow().get()

    assertEquals("Hi", read(phone, "from-desktop.subtext"))
    assertEquals(SyncState.IDLE, sync.getStatus().state)
  }

  @Test
  fun settlesAConflictLastWriterWins() {
    val sync = makeSync()
    pushFromB("shared.subtext", "line 1\nfrom desktop\nline 3\n", hour)

    saveOnPhone(sync, "shared", "line 1\nfrom phone\nline 3\n")
    sync.awaitIdle()

    assertEquals("line 1\nfrom phone\nline 3\n", read(phone, "shared.subtext"))
    assertEquals(
      "line 1\nfrom phone\nline 3",
      git(remote, "show", "main:shared.subtext"),
    )
    assertEquals(0, sync.getStatus().unpushedCommits)
  }

  @Test
  fun keepsTheNewerRemoteSide() {
    val sync = makeSync()
    pushFromB("shared.subtext", "line 1\nfrom desktop\nline 3\n", -hour)

    saveOnPhone(sync, "shared", "line 1\nfrom phone\nline 3\n")
    sync.awaitIdle()

    assertEquals("line 1\nfrom desktop\nline 3\n", read(phone, "shared.subtext"))
    assertEquals(SyncState.IDLE, sync.getStatus().state)
  }
}
