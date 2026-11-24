package io.github.polyrainbow.neno.git

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import java.io.File

/** The cases of electron/git/GitRepo.spec.ts, against JGit. */
class GitRepoTest {
  @get:Rule
  val temp = TemporaryFolder()

  private lateinit var dir: File
  private lateinit var repo: GitRepo

  @Before
  fun setUp() {
    assumeSystemGit()
    dir = temp.newFolder("graph")
    repo = GitRepo(dir)
  }

  private fun subjects() = git(dir, "log", "--format=%s").lines()

  @Test
  fun createsARepoOnMainWithAnInitialCommit() {
    repo.init(AUTHOR)
    assertEquals("main", git(dir, "symbolic-ref", "--short", "HEAD"))
    assertEquals(listOf("initial commit"), subjects())
    assertEquals(".DS_Store\n", read(dir, ".gitignore"))
    assertEquals("Test <test@example.com>", git(dir, "log", "-1", "--format=%an <%ae>"))
  }

  @Test
  fun commitsFilesThatWereAlreadyInTheFolder() {
    write(dir, "a.subtext", "A")
    repo.init(AUTHOR)
    assertEquals(listOf(".gitignore", "a.subtext"), git(dir, "ls-files").lines())
  }

  @Test
  fun doesNothingToAnExistingRepo() {
    repo.init(AUTHOR)
    repo.init(AUTHOR)
    assertEquals(1, subjects().size)
  }

  @Test
  fun namesASingleNewNoteInTheSubject() {
    repo.init(AUTHOR)
    write(dir, "hello.subtext", "Hello")
    val oid = repo.commit(notes("hello"), AUTHOR)
    assertEquals(git(dir, "rev-parse", "HEAD"), oid)
    assertEquals("create: hello", subjects().first())
  }

  @Test
  fun saysUpdateForANoteThatWasCommittedBefore() {
    repo.init(AUTHOR)
    write(dir, "hello.subtext", "Hello")
    repo.commit(notes("hello"), AUTHOR)
    write(dir, "hello.subtext", "Hello again")
    repo.commit(notes("hello"), AUTHOR)
    assertEquals("update: hello", subjects().first())
  }

  @Test
  fun commitsADeletionWhenTheFileIsGone() {
    repo.init(AUTHOR)
    write(dir, "hello.subtext", "Hello")
    repo.commit(notes("hello"), AUTHOR)
    File(dir, "hello.subtext").delete()
    repo.commit(notes("hello"), AUTHOR)
    assertEquals("delete: hello", subjects().first())
    assertEquals("", git(dir, "status", "--porcelain"))
  }

  @Test
  fun ignoresASlugThatWasNeverOnDiskOrInGit() {
    repo.init(AUTHOR)
    assertNull(repo.commit(notes("ghost"), AUTHOR))
  }

  @Test
  fun makesNoCommitWhenNothingChanged() {
    repo.init(AUTHOR)
    write(dir, "hello.subtext", "Hello")
    repo.commit(notes("hello"), AUTHOR)
    assertNull(repo.commit(notes("hello"), AUTHOR))
    assertEquals(2, subjects().size)
  }

  @Test
  fun commitsAnUploadedFileWithItsGraphFile() {
    repo.init(AUTHOR)
    write(dir, "files/pic.png", "PNG")
    write(dir, "files/pic.png.subtext", ":file:pic.png")
    repo.commit(
      FlushChanges(
        SlugSet.Some(emptyList()),
        SlugSet.Some(emptyList()),
        SlugSet.Some(listOf("files/pic.png")),
        flushPins = false,
      ),
      AUTHOR,
    )
    assertEquals(
      listOf("files/pic.png", "files/pic.png.subtext"),
      git(dir, "show", "--name-only", "--format=", "HEAD").lines(),
    )
  }

  @Test
  fun commitsThePinsFileWhenPinsChanged() {
    repo.init(AUTHOR)
    write(dir, ".pins.neno", "hello")
    repo.commit(
      FlushChanges(
        SlugSet.Some(emptyList()),
        SlugSet.Some(emptyList()),
        SlugSet.Some(emptyList()),
        flushPins = true,
      ),
      AUTHOR,
    )
    assertEquals("create file: .pins.neno", subjects().first())
  }

  @Test
  fun commitsEveryChangeWhenASetIsAll() {
    repo.init(AUTHOR)
    write(dir, "a.subtext", "A")
    write(dir, "b.subtext", "B")
    repo.commit(
      FlushChanges(SlugSet.All, SlugSet.Some(emptyList()), SlugSet.Some(emptyList()), false),
      AUTHOR,
    )
    assertEquals("", git(dir, "status", "--porcelain"))
    assertEquals("create: 2 notes", subjects().first())
  }

  @Test
  fun neverCommitsAnInterruptedWrite() {
    repo.init(AUTHOR)
    write(dir, ".a.subtext.neno-tmp", "half")
    write(dir, "a.subtext", "A")
    repo.commit(
      FlushChanges(SlugSet.All, SlugSet.Some(emptyList()), SlugSet.Some(emptyList()), false),
      AUTHOR,
    )
    assertFalse(git(dir, "ls-files").contains("neno-tmp"))
  }

  @Test
  fun listsCommitsNewestFirstWithWhatEachOneChanged() {
    repo.init(AUTHOR)
    write(dir, "b.subtext", "B")
    write(dir, "a.subtext", "A")
    repo.commit(notes("a", "b"), AUTHOR)

    val log = repo.log(10, 0)
    assertEquals(2, log.size)
    assertEquals("create: 2 notes\n\n+ a.subtext\n+ b.subtext\n", log[0].message)
    assertEquals(
      listOf(ChangedFile("a.subtext", ChangeKind.ADD), ChangedFile("b.subtext", ChangeKind.ADD)),
      log[0].changes,
    )
    assertEquals(AUTHOR, log[0].author)
    assertEquals(git(dir, "rev-parse", "HEAD"), log[0].oid)
    assertEquals("initial commit\n", log[1].message)
  }

  @Test
  fun reportsTheTimezoneLikeGetTimezoneOffset() {
    repo.init(AUTHOR)
    write(dir, "a.subtext", "A")
    git(dir, "add", ".")
    git(dir, "commit", "--quiet", "-m", "plus one", env = mapOf("GIT_AUTHOR_DATE" to "1700000000 +0100"))
    write(dir, "b.subtext", "B")
    git(dir, "add", ".")
    git(dir, "commit", "--quiet", "-m", "utc", env = mapOf("GIT_AUTHOR_DATE" to "1700000000 +0000"))

    val log = repo.log(2, 0)
    assertEquals(0, log[0].timezoneOffset)
    assertEquals(-60, log[1].timezoneOffset)
    assertEquals(1700000000L, log[1].timestamp)
  }

  @Test
  fun pagesThroughTheHistory() {
    repo.init(AUTHOR)
    for (i in 1..4) {
      write(dir, "n$i.subtext", "$i")
      repo.commit(notes("n$i"), AUTHOR)
    }
    assertEquals(listOf("create: n3", "create: n2"), repo.log(2, 1).map { it.message.trim() })
  }

  @Test
  fun returnsBothVersionsOfAModifiedFile() {
    repo.init(AUTHOR)
    write(dir, "a.subtext", "old\n")
    repo.commit(notes("a"), AUTHOR)
    write(dir, "a.subtext", "new\n")
    val oid = repo.commit(notes("a"), AUTHOR)!!

    assertEquals(
      listOf(FileVersions("a.subtext", ChangeKind.MODIFY, oldText = "old\n", newText = "new\n")),
      repo.fileVersions(oid),
    )
  }

  @Test
  fun flagsABinaryFileInsteadOfReturningIt() {
    repo.init(AUTHOR)
    write(dir, "files/x.bin", byteArrayOf(1, 0, 2))
    repo.commit(
      FlushChanges(SlugSet.Some(emptyList()), SlugSet.Some(emptyList()), SlugSet.Some(listOf("files/x.bin")), false),
      AUTHOR,
    )
    val versions = repo.fileVersions(git(dir, "rev-parse", "HEAD"))
    assertTrue(versions.single().binary)
    assertNull(versions.single().newText)
  }

  @Test
  fun diffsTheInitialCommitAgainstNothing() {
    write(dir, "a.subtext", "A\n")
    repo.init(AUTHOR)
    val versions = repo.fileVersions(git(dir, "rev-parse", "HEAD"))
    assertEquals(listOf(".gitignore", "a.subtext"), versions.map { it.path })
    assertEquals("", versions[1].oldText)
    assertEquals("A\n", versions[1].newText)
  }

  @Test
  fun detectsTheUpstreamOrOrigin() {
    repo.init(AUTHOR)
    assertNull(repo.detectRemote())
    git(dir, "remote", "add", "origin", "/nowhere")
    assertEquals(RemoteTarget("origin", "main", "main", false), repo.detectRemote())
    git(dir, "config", "branch.main.remote", "origin")
    git(dir, "config", "branch.main.merge", "refs/heads/trunk")
    assertEquals(RemoteTarget("origin", "trunk", "main", true), repo.detectRemote())
  }
}
