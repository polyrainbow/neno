package io.github.polyrainbow.neno.git

import org.junit.Assume
import java.io.File
import java.util.concurrent.TimeUnit

/*
  The other machine is driven with the system git, as the desktop app
  drives it — so these tests also show that what JGit writes on the
  phone and what git writes on the desktop get along.
*/

val AUTHOR = GitAuthor("Test", "test@example.com")

private val SYSTEM_GIT = listOf("/usr/bin/git", "/usr/local/bin/git", "/opt/homebrew/bin/git")
  .firstOrNull { File(it).canExecute() }

fun assumeSystemGit() {
  Assume.assumeTrue("system git is needed for this test", SYSTEM_GIT != null)
}

/** Runs the system git in `dir` and returns its trimmed stdout. */
fun git(dir: File, vararg args: String, env: Map<String, String> = emptyMap()): String {
  val process = ProcessBuilder(listOf(SYSTEM_GIT!!) + args)
    .directory(dir)
    .redirectErrorStream(false)
    .apply {
      environment().putAll(
        mapOf(
          "GIT_AUTHOR_NAME" to "B",
          "GIT_AUTHOR_EMAIL" to "b@example.com",
          "GIT_COMMITTER_NAME" to "B",
          "GIT_COMMITTER_EMAIL" to "b@example.com",
          "GIT_CONFIG_GLOBAL" to "/dev/null",
          "GIT_CONFIG_NOSYSTEM" to "1",
        ) + env,
      )
    }
    .start()
  val stdout = process.inputStream.bufferedReader().readText()
  val stderr = process.errorStream.bufferedReader().readText()
  check(process.waitFor(30, TimeUnit.SECONDS)) { "git ${args.joinToString(" ")} hung" }
  check(process.exitValue() == 0) {
    "git ${args.joinToString(" ")} failed (${process.exitValue()}): $stderr"
  }
  return stdout.trim()
}

fun write(dir: File, path: String, content: String) {
  File(dir, path).apply { parentFile?.mkdirs() }.writeText(content)
}

fun write(dir: File, path: String, content: ByteArray) {
  File(dir, path).apply { parentFile?.mkdirs() }.writeBytes(content)
}

fun read(dir: File, path: String): String = File(dir, path).readText()

fun notes(vararg slugs: String) = FlushChanges(
  SlugSet.Some(slugs.toList()),
  SlugSet.Some(emptyList()),
  SlugSet.Some(emptyList()),
  flushPins = false,
)

/** A SecretBox that keeps nothing secret, for tests. */
object PlainBox : SecretBox {
  override fun seal(plain: ByteArray) = plain
  override fun open(sealed: ByteArray) = sealed
}
