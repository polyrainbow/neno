/*
  The message of a per-flush commit: a one-line subject for a single
  file, and a summary with one line per path for anything larger.
*/

const GRAPH_FILE_EXTENSION = ".subtext";

function pathToSlug(path: string): string {
  return path.endsWith(GRAPH_FILE_EXTENSION)
    ? path.slice(0, -GRAPH_FILE_EXTENSION.length)
    : path;
}

function formatSingle(verb: string, path: string): string {
  return path.endsWith(GRAPH_FILE_EXTENSION)
    ? `${verb}: ${pathToSlug(path)}`
    : `${verb} file: ${path}`;
}

export default function formatCommitMessage(
  creates: string[],
  modifies: string[],
  removes: string[],
): string {
  const total = creates.length + modifies.length + removes.length;

  if (total === 0) {
    return "update";
  }

  if (total === 1) {
    if (creates.length === 1) return formatSingle("create", creates[0]);
    if (modifies.length === 1) return formatSingle("update", modifies[0]);
    return formatSingle("delete", removes[0]);
  }

  const all = [...creates, ...modifies, ...removes];
  const noteCount = all.filter(
    (p) => p.endsWith(GRAPH_FILE_EXTENSION),
  ).length;
  const fileCount = total - noteCount;

  const header = [
    noteCount > 0
      ? `${noteCount} note${noteCount === 1 ? "" : "s"}`
      : null,
    fileCount > 0
      ? `${fileCount} file${fileCount === 1 ? "" : "s"}`
      : null,
  ]
    .filter((s): s is string => s !== null)
    .join(", ");

  const verb = modifies.length === 0 && removes.length === 0
    ? "create"
    : creates.length === 0 && modifies.length === 0
      ? "delete"
      : "update";

  const body = [
    ...creates.map((p) => `+ ${p}`),
    ...modifies.map((p) => `~ ${p}`),
    ...removes.map((p) => `- ${p}`),
  ].join("\n");

  return `${verb}: ${header}\n\n${body}`;
}
