package io.github.polyrainbow.neno.git

/*
  The message of a per-flush commit: a one-line subject for a single
  file, and a summary with one line per path for anything larger.

  A port of src/lib/git/commitMessage.ts, so that commits made on the
  phone read like commits made on the desktop. CommitMessageTest holds
  it to the same cases.
*/
object CommitMessage {
  private const val GRAPH_FILE_EXTENSION = ".subtext"

  private fun pathToSlug(path: String): String =
    path.removeSuffix(GRAPH_FILE_EXTENSION)

  private fun formatSingle(verb: String, path: String): String =
    if (path.endsWith(GRAPH_FILE_EXTENSION)) {
      "$verb: ${pathToSlug(path)}"
    } else {
      "$verb file: $path"
    }

  fun format(
    creates: List<String>,
    modifies: List<String>,
    removes: List<String>,
  ): String {
    val total = creates.size + modifies.size + removes.size

    if (total == 0) return "update"

    if (total == 1) {
      if (creates.size == 1) return formatSingle("create", creates[0])
      if (modifies.size == 1) return formatSingle("update", modifies[0])
      return formatSingle("delete", removes[0])
    }

    val all = creates + modifies + removes
    val noteCount = all.count { it.endsWith(GRAPH_FILE_EXTENSION) }
    val fileCount = total - noteCount

    val header = listOfNotNull(
      if (noteCount > 0) "$noteCount note${if (noteCount == 1) "" else "s"}"
      else null,
      if (fileCount > 0) "$fileCount file${if (fileCount == 1) "" else "s"}"
      else null,
    ).joinToString(", ")

    val verb = when {
      modifies.isEmpty() && removes.isEmpty() -> "create"
      creates.isEmpty() && modifies.isEmpty() -> "delete"
      else -> "update"
    }

    val body = (
      creates.map { "+ $it" } +
        modifies.map { "~ $it" } +
        removes.map { "- $it" }
      ).joinToString("\n")

    return "$verb: $header\n\n$body"
  }
}
