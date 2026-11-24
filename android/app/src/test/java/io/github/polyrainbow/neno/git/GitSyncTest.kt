package io.github.polyrainbow.neno.git

import io.github.polyrainbow.neno.storage.WorktreeLock
import org.junit.After
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import java.io.File

/**
 * The cases of electron/git/GitSync.spec.ts, against JGit. Two machines
 * and a remote, all on the local disk: `remote` is a bare repository,
 * `a` is the phone (driven through GitSync, as the app drives it) and
 * `b` is the other machine, driven with the system git.
 */
class GitSyncTest {
  @get:Rule
  val temp = TemporaryFolder()

  private lateinit var remote: File
  private lateinit var a: File
  private lateinit var b: File
  private val syncs = mutableListOf<GitSync>()

  private val hour = 3600L

  @Before
  fun setUp() {
    assumeSystemGit()
    val root = temp.root
    remote = File(root, "remote.git")
    a = File(root, "a").apply { mkdirs() }
    b = File(root, "b")

    git(root, "init", "--quiet", "--bare", "--initial-branch=main", remote.path)
    write(a, "shared.subtext", "line 1\nline 2\nline 3\n")
    GitRepo(a).apply { init(AUTHOR) }.close()
    git(a, "remote", "add", "origin", remote.path)
    git(a, "push", "--quiet", "--set-upstream", "origin", "main")
    git(root, "clone", "--quiet", remote.path, b.path)
  }

  @After
  fun tearDown() {
    syncs.forEach { it.dispose() }
  }

  private fun makeSync(
    dir: File = a,
    onPathsChanged: (List<String>) -> Unit = {},
    isEditorDirty: () -> Boolean = { false },
    transport: org.eclipse.jgit.api.TransportConfigCallback? = null,
  ): GitSync = GitSync(
    repo = GitRepo(dir),
    lock = WorktreeLock(),
    transport = transport,
    onPathsChanged = onPathsChanged,
    isEditorDirty = isEditorDirty,
    networkTimeoutSeconds = 5,
    // No retries while a test is still asserting.
    retryDelaysMs = listOf(3_600_000L),
  ).also { syncs.add(it) }

  /** A note saved on the phone, as the app saves it. */
  private fun saveOnA(sync: GitSync, slug: String, content: String?) {
    sync.lock.withLock {
      if (content == null) File(a, "$slug.subtext").delete()
      else write(a, "$slug.subtext", content)
    }
    sync.commit(notes(slug), AUTHOR)
  }

  /** A change made and pushed on machine B, `ageSeconds` ago. */
  private fun pushFromB(path: String, content: Any?, ageSeconds: Long = 0) {
    when (content) {
      null -> git(b, "rm", "--quiet", path)
      is String -> { write(b, path, content); git(b, "add", path) }
      is ByteArray -> { write(b, path, content); git(b, "add", path) }
    }
    val date = "${System.currentTimeMillis() / 1000 - ageSeconds} +0000"
    git(b, "commit", "--quiet", "-m", "b: $path", "--date=$date")
    git(b, "push", "--quiet")
  }

  private fun remoteLog(vararg extra: String) =
    git(remote, "log", "--format=%s", *extra, "main")

  @Test
  fun pushesACommitRightAfterMakingIt() {
    val sync = makeSync()
    sync.start()
    sync.setAutoSync(true)

    saveOnA(sync, "hello", "Hello")
    sync.awaitIdle()

    assertEquals("create: hello", git(remote, "log", "-1", "--format=%s", "main"))
    val status = sync.getStatus()
    assertTrue(status.enabled)
    assertEquals(SyncState.IDLE, status.state)
    assertEquals(0, status.unpushedCommits)
    assertEquals(SyncRemote("origin", "main"), status.remote)
    assertNull(status.error)
  }

  @Test
  fun keepsCommitsLocalWhileAutoSyncIsOff() {
    val sync = makeSync()
    sync.start()

    saveOnA(sync, "hello", "Hello")
    sync.awaitIdle()

    assertEquals("initial commit", git(remote, "log", "-1", "--format=%s", "main"))
    assertFalse(sync.getStatus().enabled)
    assertEquals(1, sync.getStatus().unpushedCommits)
  }

  @Test
  fun remembersAutoSyncInTheReposOwnConfig() {
    makeSync().setAutoSync(true)

    val later = makeSync()
    later.start()

    assertTrue(later.getStatus().enabled)
    assertEquals("true", git(a, "config", "--local", "neno.autoSync"))
  }

  @Test
  fun bringsInWhatTheOtherMachinePushed() {
    val changed = mutableListOf<List<String>>()
    val sync = makeSync(onPathsChanged = { changed.add(it) })
    sync.start()
    sync.setAutoSync(true)
    pushFromB("from-b.subtext", "Hi from B")

    sync.syncNow().get()

    assertEquals("Hi from B", read(a, "from-b.subtext"))
    assertEquals(listOf(listOf("from-b.subtext")), changed)
    assertEquals("", git(a, "status", "--porcelain"))
  }

  @Test
  fun rebasesAndRetriesWhenAPushIsRejected() {
    val sync = makeSync()
    sync.start()
    sync.setAutoSync(true)
    pushFromB("from-b.subtext", "B")

    saveOnA(sync, "from-a", "A")
    sync.awaitIdle()

    assertEquals("create: from-a\nb: from-b.subtext\ninitial commit", remoteLog())
    assertEquals("B", read(a, "from-b.subtext"))
    assertEquals(SyncState.IDLE, sync.getStatus().state)
    assertEquals(0, sync.getStatus().unpushedCommits)
    assertEquals("", git(a, "status", "--porcelain"))
  }

  @Test
  fun waitsWhileTheEditorHasUnsavedChanges() {
    var dirty = true
    val sync = makeSync(isEditorDirty = { dirty })
    sync.start()
    sync.setAutoSync(true)
    pushFromB("from-b.subtext", "B")

    sync.syncNow().get()
    assertFalse(File(a, "from-b.subtext").exists())

    dirty = false
    sync.editorBecameClean()
    sync.awaitIdle()

    assertEquals("B", read(a, "from-b.subtext"))
  }

  /*
    When both machines changed the same file.
  */

  private fun conflictSync(): GitSync = makeSync().apply {
    start()
    setAutoSync(true)
  }

  private fun pushedShared() = git(remote, "show", "main:shared.subtext")

  @Test
  fun keepsTheNewerSideOfAnOverlappingEditLocal() {
    val sync = conflictSync()
    pushFromB("shared.subtext", "line 1\nB's line 2\nline 3\n", hour)

    saveOnA(sync, "shared", "line 1\nA's line 2\nline 3\n")
    sync.awaitIdle()

    assertEquals("line 1\nA's line 2\nline 3\n", read(a, "shared.subtext"))
    assertEquals("line 1\nA's line 2\nline 3", pushedShared())
    assertEquals("", git(a, "for-each-ref", "refs/neno/"))
  }

  @Test
  fun keepsTheNewerSideOfAnOverlappingEditRemote() {
    val sync = conflictSync()
    pushFromB("shared.subtext", "line 1\nB's line 2\nline 3\n", -hour)

    saveOnA(sync, "shared", "line 1\nA's line 2\nline 3\n")
    sync.awaitIdle()

    assertEquals("line 1\nB's line 2\nline 3\n", read(a, "shared.subtext"))
    assertEquals(SyncState.IDLE, sync.getStatus().state)
    assertEquals(0, sync.getStatus().unpushedCommits)
    assertEquals("", git(a, "status", "--porcelain"))
  }

  @Test
  fun keepsTheOverwrittenLocalVersionUnderRefsNeno() {
    val sync = conflictSync()
    pushFromB("shared.subtext", "line 1\nB's line 2\nline 3\n", -hour)

    saveOnA(sync, "shared", "line 1\nA's line 2\nline 3\n")
    sync.awaitIdle()

    val ref = git(a, "for-each-ref", "--format=%(refname)", "refs/neno/")
      .lines().first()
    assertTrue(ref, ref.startsWith("refs/neno/overwritten/"))
    assertEquals("line 1\nA's line 2\nline 3", git(a, "show", "$ref:shared.subtext"))
  }

  @Test
  fun keepsEditsThatDoNotOverlapFromBothSides() {
    val sync = conflictSync()
    pushFromB("shared.subtext", "B's line 1\nline 2\nline 3\n", -hour)

    saveOnA(sync, "shared", "line 1\nline 2\nA's line 3\n")
    sync.awaitIdle()

    assertEquals("B's line 1\nline 2\nA's line 3\n", read(a, "shared.subtext"))
    assertEquals("B's line 1\nline 2\nA's line 3", pushedShared())
    assertEquals("", git(a, "for-each-ref", "refs/neno/"))
  }

  @Test
  fun bringsANoteBackThatOneSideDeletedAndTheOtherEdited() {
    val sync = conflictSync()
    pushFromB("shared.subtext", "edited on B\n", hour)

    saveOnA(sync, "shared", null)
    sync.awaitIdle()

    assertEquals("edited on B\n", read(a, "shared.subtext"))
    assertEquals("edited on B", pushedShared())
  }

  @Test
  fun keepsALocalEditToANoteTheRemoteDeletedLater() {
    val sync = conflictSync()
    pushFromB("shared.subtext", null, -hour)

    saveOnA(sync, "shared", "edited on A\n")
    sync.awaitIdle()

    assertEquals("edited on A\n", read(a, "shared.subtext"))
    assertEquals("edited on A", pushedShared())
  }

  @Test
  fun givesABinaryFileWholeToTheNewerSide() {
    val sync = conflictSync()
    write(b, "files/pic.bin", byteArrayOf(0, 1))
    git(b, "add", ".")
    git(b, "commit", "--quiet", "-m", "pic")
    git(b, "push", "--quiet")
    sync.syncNow().get()
    pushFromB("files/pic.bin", byteArrayOf(0, 2), hour)

    sync.lock.withLock { write(a, "files/pic.bin", byteArrayOf(0, 3)) }
    sync.commit(
      FlushChanges(
        SlugSet.Some(emptyList()),
        SlugSet.Some(emptyList()),
        SlugSet.Some(listOf("files/pic.bin")),
        flushPins = false,
      ),
      AUTHOR,
    )
    sync.awaitIdle()

    assertArrayEquals(byteArrayOf(0, 3), File(a, "files/pic.bin").readBytes())
    assertEquals(0, sync.getStatus().unpushedCommits)
  }

  /*
    Setting up.
  */

  @Test
  fun refusesARepoThatSharesNoHistoryWithTheRemote() {
    val c = File(temp.root, "c").apply { mkdirs() }
    GitRepo(c).apply { init(AUTHOR) }.close()
    git(c, "remote", "add", "origin", remote.path)
    val sync = makeSync(c)
    sync.start()

    try {
      sync.setAutoSync(true)
      fail("expected a refusal")
    } catch (e: SyncException) {
      assertEquals(SyncErrorKind.UNRELATED_HISTORIES, e.kind)
    }
    assertFalse(sync.getStatus().enabled)
    assertEquals("initial commit", remoteLog())
  }

  @Test
  fun cannotBeSwitchedOnWithoutARemote() {
    git(a, "remote", "remove", "origin")
    val sync = makeSync()
    sync.start()

    try {
      sync.setAutoSync(true)
      fail("expected a refusal")
    } catch (e: IllegalStateException) {
      assertTrue(e.message!!.contains("no remote"))
    }
    assertNull(sync.getStatus().remote)
  }

  @Test
  fun setsTheUpstreamOnTheFirstPushOfANewBranch() {
    git(a, "switch", "--quiet", "--create", "notes")
    val sync = makeSync()
    sync.start()
    sync.setAutoSync(true)

    saveOnA(sync, "hello", "Hello")
    sync.awaitIdle()

    assertEquals("create: hello", git(remote, "log", "-1", "--format=%s", "notes"))
    assertEquals("origin/notes", git(a, "rev-parse", "--abbrev-ref", "notes@{upstream}"))
  }

  /*
    When the remote cannot be reached.
  */

  @Test
  fun reportsOfflineNotAnErrorAndKeepsTheCommits() {
    val home = temp.newFolder("home")
    val ssh = SshSupport(
      home,
      SshIdentity(File(home, ".ssh"), PlainBox),
      TrustedHosts(File(home, ".ssh/neno_known_hosts")),
    )
    val sync = makeSync(transport = ssh.transport)
    sync.start()
    sync.setAutoSync(true)
    // Nothing listens on port 1.
    git(a, "remote", "set-url", "origin", "ssh://git@127.0.0.1:1/x.git")

    saveOnA(sync, "hello", "Hello")
    sync.awaitIdle()

    val status = sync.getStatus()
    assertTrue(status.enabled)
    assertEquals(SyncState.OFFLINE, status.state)
    assertEquals(1, status.unpushedCommits)
    assertNull(status.error)
    ssh.close()
  }

  @Test
  fun neverMakesASaveWaitForTheNetwork() {
    // A remote that accepts the connection and then never answers.
    val silent = java.net.ServerSocket(0, 50, java.net.InetAddress.getLoopbackAddress())
    val held = mutableListOf<java.net.Socket>()
    val acceptor = Thread {
      try {
        while (true) held.add(silent.accept())
      } catch (_: java.io.IOException) {
        // Closed at the end of the test.
      }
    }.apply { isDaemon = true; start() }

    val home = temp.newFolder("home")
    val ssh = SshSupport(
      home,
      SshIdentity(File(home, ".ssh"), PlainBox),
      TrustedHosts(File(home, ".ssh/neno_known_hosts")),
    )
    val sync = makeSync(transport = ssh.transport)
    sync.start()
    sync.setAutoSync(true)
    git(a, "remote", "set-url", "origin", "ssh://git@127.0.0.1:${silent.localPort}/x.git")
    val pending = sync.syncNow()

    val started = System.currentTimeMillis()
    saveOnA(sync, "hello", "Hello")
    saveOnA(sync, "hello", "Hello again")
    val elapsed = System.currentTimeMillis() - started

    assertTrue("a save took $elapsed ms", elapsed < 1500)
    pending.get()
    sync.awaitIdle()
    assertEquals(SyncState.OFFLINE, sync.getStatus().state)
    assertEquals(2, sync.getStatus().unpushedCommits)

    silent.close()
    held.forEach { it.close() }
    acceptor.join(1000)
    ssh.close()
  }

  /*
    Found in review.
  */

  @Test
  fun isNotBlockedByAnUntrackedFileTheRemoteHasToo() {
    // NENO writes .pins.neno on first load and commits it with a pin.
    write(a, ".pins.neno", "")
    val sync = makeSync()
    sync.start()
    sync.setAutoSync(true)
    pushFromB(".pins.neno", "pinned-on-b", hour)

    sync.syncNow().get()

    assertEquals("pinned-on-b", read(a, ".pins.neno"))
    val status = sync.getStatus()
    assertEquals(SyncState.IDLE, status.state)
    assertNull(status.error)
    assertEquals(0, status.unpushedCommits)
  }

  @Test
  fun reportsARemoteRemovedAfterSyncWasSwitchedOn() {
    val sync = makeSync()
    sync.start()
    sync.setAutoSync(true)
    git(a, "remote", "remove", "origin")

    sync.syncNow().get()

    val status = sync.getStatus()
    assertTrue(status.enabled)
    assertEquals(SyncState.ERROR, status.state)
    assertEquals(SyncErrorKind.NO_REMOTE, status.error?.kind)
  }

  @Test
  fun replaysLocalCommitsAsTheConfiguredAuthor() {
    val sync = makeSync()
    sync.start()
    sync.author = GitAuthor("Me", "me@example.com")
    pushFromB("from-b.subtext", "B")
    write(a, "local.subtext", "A")
    git(a, "add", ".")
    git(a, "commit", "--quiet", "-m", "local")

    sync.setAutoSync(true)

    assertEquals("local|Me", git(a, "log", "-1", "--format=%s|%cn", "main"))
  }

  @Test
  fun abortsARebaseAnEarlierRunLeftBehind() {
    pushFromB("shared.subtext", "B\n")
    write(a, "shared.subtext", "A\n")
    git(a, "commit", "--quiet", "-am", "a")
    git(a, "fetch", "--quiet")
    try {
      git(a, "rebase", "origin/main")
    } catch (_: IllegalStateException) {
      // Stopped at the conflict, as a crash mid-sync would leave it.
    }
    assertTrue(File(a, ".git/rebase-merge").exists())

    val sync = makeSync()
    sync.start()

    assertFalse(File(a, ".git/rebase-merge").exists())
    assertEquals("main", git(a, "symbolic-ref", "--short", "HEAD"))
    assertEquals("A\n", read(a, "shared.subtext"))
  }
}
