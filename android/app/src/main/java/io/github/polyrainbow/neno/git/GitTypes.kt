package io.github.polyrainbow.neno.git

import org.json.JSONArray
import org.json.JSONObject

/*
  The shapes of src/lib/git/types.ts, which the worker and the history
  view expect over the bridge. Kept field for field; toJson() writes
  exactly what the TypeScript interfaces declare.
*/

data class GitAuthor(val name: String, val email: String) {
  companion object {
    val DEFAULT = GitAuthor("NENO", "noreply@neno.local")

    fun fromJson(json: JSONObject?): GitAuthor = if (json == null) {
      DEFAULT
    } else {
      GitAuthor(
        json.optString("name").ifEmpty { DEFAULT.name },
        json.optString("email").ifEmpty { DEFAULT.email },
      )
    }
  }
}

/** A set of slugs, or every path in the folder. */
sealed class SlugSet {
  object All : SlugSet()
  data class Some(val slugs: List<String>) : SlugSet()

  companion object {
    fun fromJson(value: Any?): SlugSet = when (value) {
      "all" -> All
      is JSONArray -> Some(List(value.length()) { value.getString(it) })
      else -> Some(emptyList())
    }
  }
}

/** What one flush touched (FlushChanges in types.ts). */
data class FlushChanges(
  val canonicalNoteSlugs: SlugSet,
  val aliases: SlugSet,
  val arbitraryFiles: SlugSet,
  val flushPins: Boolean,
) {
  companion object {
    fun fromJson(json: JSONObject) = FlushChanges(
      SlugSet.fromJson(json.opt("canonicalNoteSlugs")),
      SlugSet.fromJson(json.opt("aliases")),
      SlugSet.fromJson(json.opt("arbitraryFiles")),
      json.optBoolean("flushPins", false),
    )
  }
}

enum class ChangeKind(val json: String) {
  ADD("add"),
  MODIFY("modify"),
  DELETE("delete"),
}

data class ChangedFile(val path: String, val change: ChangeKind) {
  fun toJson(): JSONObject = JSONObject()
    .put("path", path)
    .put("change", change.json)
}

data class CommitInfo(
  val oid: String,
  val message: String,
  val author: GitAuthor,
  /** Seconds since the epoch. */
  val timestamp: Long,
  /** Minutes, signed like Date.prototype.getTimezoneOffset(). */
  val timezoneOffset: Int,
  val changes: List<ChangedFile>,
) {
  fun toJson(): JSONObject = JSONObject()
    .put("oid", oid)
    .put("message", message)
    .put(
      "author",
      JSONObject().put("name", author.name).put("email", author.email),
    )
    .put("timestamp", timestamp)
    .put("timezoneOffset", timezoneOffset)
    .put("changes", JSONArray(changes.map { it.toJson() }))
}

/*
  One changed file of a commit with both versions as text, for the
  history view. The line diff itself is computed in TypeScript by
  src/lib/git/diff.ts — the same code the desktop uses — so only the
  cheap decisions are made here: binary, too large, or text.
*/
data class FileVersions(
  val path: String,
  val change: ChangeKind,
  val binary: Boolean = false,
  val tooLarge: Boolean = false,
  val oldText: String? = null,
  val newText: String? = null,
) {
  fun toJson(): JSONObject = JSONObject().apply {
    put("path", path)
    put("change", change.json)
    if (binary) put("binary", true)
    if (tooLarge) put("tooLarge", true)
    if (oldText != null) put("oldText", oldText)
    if (newText != null) put("newText", newText)
  }
}

enum class SyncErrorKind(val json: String) {
  AUTH("auth"),
  NO_REMOTE("no-remote"),
  UNRELATED_HISTORIES("unrelated-histories"),
  OTHER("other"),
}

enum class SyncState(val json: String) {
  IDLE("idle"),
  SYNCING("syncing"),
  OFFLINE("offline"),
  ERROR("error"),
}

data class SyncRemote(val name: String, val branch: String)

data class SyncErrorInfo(val kind: SyncErrorKind, val message: String)

data class SyncStatus(
  val repo: Boolean = false,
  val remote: SyncRemote? = null,
  val enabled: Boolean = false,
  val state: SyncState = SyncState.IDLE,
  val unpushedCommits: Int = 0,
  val lastSyncedAt: Long? = null,
  val error: SyncErrorInfo? = null,
) {
  fun toJson(): JSONObject = JSONObject()
    .put("repo", repo)
    .put(
      "remote",
      remote?.let { JSONObject().put("name", it.name).put("branch", it.branch) }
        ?: JSONObject.NULL,
    )
    .put("enabled", enabled)
    .put("state", state.json)
    .put("unpushedCommits", unpushedCommits)
    .put("lastSyncedAt", lastSyncedAt ?: JSONObject.NULL)
    .put(
      "error",
      error?.let {
        JSONObject().put("kind", it.kind.json).put("message", it.message)
      } ?: JSONObject.NULL,
    )
}
