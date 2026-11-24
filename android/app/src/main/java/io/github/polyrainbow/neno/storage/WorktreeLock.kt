package io.github.polyrainbow.neno.storage

import java.util.concurrent.Semaphore

/**
 * The graph folder's worktree lock, as in electron/git/GitSync.ts: every
 * write through the bridge, every commit and every rebase holds it, so a
 * pull never rewrites a file a save is halfway through. Reads and
 * network traffic never take it.
 *
 * A semaphore rather than a ReentrantLock, because a streamed write
 * holds it from openWrite to closeWrite — several bridge calls, served
 * by whichever pool thread is free — and a ReentrantLock may only be
 * released by the thread that took it.
 */
class WorktreeLock {
  private val semaphore = Semaphore(1, true)

  fun acquire() = semaphore.acquire()

  fun release() = semaphore.release()

  inline fun <T> withLock(block: () -> T): T {
    acquire()
    try {
      return block()
    } finally {
      release()
    }
  }
}
