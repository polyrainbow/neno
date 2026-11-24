package io.github.polyrainbow.neno.git

import java.io.InterruptedIOException
import java.net.ConnectException
import java.net.NoRouteToHostException
import java.net.PortUnreachableException
import java.net.SocketException
import java.net.SocketTimeoutException
import java.net.UnknownHostException

enum class NetworkFailure { OFFLINE, AUTH, REJECTED, OTHER }

/** The remote moved on since the last fetch: pull, then push again. */
class PushRejectedException(message: String) : Exception(message)

/** The server's host key is not the one this device trusted before. */
class HostKeyChangedException(message: String) : Exception(message)

/**
 * Sorts a failed network call by what NENO should do about it — the
 * rules of electron/git/classifyError.ts. Only "auth" is the user's
 * problem; "offline" is the normal state of a LAN-only remote seen from
 * anywhere else, and is never an error.
 *
 * The desktop reads git's stderr. JGit throws instead, so this looks at
 * the exception types along the cause chain first, and then at their
 * messages with the desktop's patterns plus JGit's and MINA's wording.
 */
object ClassifyError {
  private val AUTH = listOf(
    Regex("permission denied", RegexOption.IGNORE_CASE),
    Regex("authentication failed", RegexOption.IGNORE_CASE),
    Regex("host key verification failed", RegexOption.IGNORE_CASE),
    Regex("could not read (username|password)", RegexOption.IGNORE_CASE),
    Regex("invalid username or password", RegexOption.IGNORE_CASE),
    // JGit / Apache MINA SSHD
    Regex("auth fail", RegexOption.IGNORE_CASE),
    Regex("no more authentication methods", RegexOption.IGNORE_CASE),
    Regex("not authorized", RegexOption.IGNORE_CASE),
    Regex("server key did not validate", RegexOption.IGNORE_CASE),
  )

  private val REJECTED = listOf(
    Regex("\\[rejected]"),
    Regex("non-fast-forward"),
    Regex("\\(fetch first\\)"),
    Regex("updates were rejected", RegexOption.IGNORE_CASE),
  )

  private val OFFLINE = listOf(
    Regex("could not resolve (host|hostname)", RegexOption.IGNORE_CASE),
    Regex("connection timed out", RegexOption.IGNORE_CASE),
    Regex("operation timed out", RegexOption.IGNORE_CASE),
    Regex("connection refused", RegexOption.IGNORE_CASE),
    Regex("no route to host", RegexOption.IGNORE_CASE),
    Regex("network is unreachable", RegexOption.IGNORE_CASE),
    Regex("network is down", RegexOption.IGNORE_CASE),
    Regex("connection (closed|reset)", RegexOption.IGNORE_CASE),
    Regex("broken pipe", RegexOption.IGNORE_CASE),
    Regex("the remote end hung up unexpectedly", RegexOption.IGNORE_CASE),
    // JGit / Apache MINA SSHD
    Regex("timeout", RegexOption.IGNORE_CASE),
    Regex("timed out", RegexOption.IGNORE_CASE),
    Regex("unknown host", RegexOption.IGNORE_CASE),
    Regex("session is (being )?closed", RegexOption.IGNORE_CASE),
  )

  private fun causes(error: Throwable): List<Throwable> =
    generateSequence(error) { it.cause.takeIf { cause -> cause !== it } }
      .take(16)
      .toList()

  fun classify(error: Throwable): NetworkFailure {
    val chain = causes(error)
    if (chain.any { it is PushRejectedException }) return NetworkFailure.REJECTED
    if (chain.any { it is HostKeyChangedException }) return NetworkFailure.AUTH

    val text = chain.joinToString("\n") { it.message ?: "" }
    if (AUTH.any { it.containsMatchIn(text) }) return NetworkFailure.AUTH
    if (REJECTED.any { it.containsMatchIn(text) }) return NetworkFailure.REJECTED

    val offlineTypes = chain.any {
      it is UnknownHostException ||
        it is ConnectException ||
        it is NoRouteToHostException ||
        it is PortUnreachableException ||
        it is SocketTimeoutException ||
        it is InterruptedIOException ||
        it is SocketException
    }
    if (offlineTypes) return NetworkFailure.OFFLINE
    if (OFFLINE.any { it.containsMatchIn(text) }) return NetworkFailure.OFFLINE
    return NetworkFailure.OTHER
  }

  /*
    The message worth showing: the outermost one that says something.
    JGit's own wrap the cause with the remote's URL in front.
  */
  fun message(error: Throwable): String =
    causes(error).mapNotNull { it.message?.trim() }
      .firstOrNull { it.isNotEmpty() }
      ?: error.toString()
}
