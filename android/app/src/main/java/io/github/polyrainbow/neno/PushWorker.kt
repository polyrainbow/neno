package io.github.polyrainbow.neno

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import io.github.polyrainbow.neno.git.SyncState

/**
 * Sends commits that were still waiting when the app left the
 * foreground. A phone leaves an app in the background for minutes at a
 * time, or kills it; the desktop's "push after every commit" would then
 * wait until the next launch. WorkManager runs this once the device has
 * a network, even if the app's process is gone by then.
 */
class PushWorker(context: Context, params: WorkerParameters) : Worker(context, params) {

  companion object {
    private const val NAME = "neno-push"

    fun enqueue(context: Context) {
      val request = OneTimeWorkRequestBuilder<PushWorker>()
        .setConstraints(
          Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build(),
        )
        .build()
      WorkManager.getInstance(context)
        .enqueueUniqueWork(NAME, ExistingWorkPolicy.REPLACE, request)
    }

    fun cancel(context: Context) {
      WorkManager.getInstance(context).cancelUniqueWork(NAME)
    }
  }

  override fun doWork(): Result {
    val sync = NenoGraph.get(applicationContext).sync() ?: return Result.success()
    if (!sync.getStatus().enabled) return Result.success()
    sync.syncNow().get()
    val status = sync.getStatus()
    return when {
      status.unpushedCommits == 0 -> Result.success()
      // Out of reach after all; WorkManager tries again with backoff.
      status.state == SyncState.OFFLINE -> Result.retry()
      // An error the user has to fix in the app.
      else -> Result.success()
    }
  }
}
