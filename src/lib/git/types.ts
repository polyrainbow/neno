/*
  Shapes shared by the main process, which runs git, and the renderer,
  which shows its history. Imported by both `electron/` and `src/`.
*/

export interface GitAuthor {
  name: string;
  email: string;
}

/*
  What one flush touched, as the slugs DatabaseIO flushed. Arrays rather
  than Sets so the value crosses the storage bridge as plain data.
*/
export interface FlushChanges {
  canonicalNoteSlugs: string[] | "all";
  aliases: string[] | "all";
  arbitraryFiles: string[] | "all";
  flushPins: boolean;
}

export interface ChangedFile {
  path: string;
  change: "add" | "modify" | "delete";
}

export interface CommitInfo {
  oid: string;
  message: string;
  author: GitAuthor;
  /** Seconds since the epoch. */
  timestamp: number;
  /** Minutes, signed like Date.prototype.getTimezoneOffset(). */
  timezoneOffset: number;
  changes: ChangedFile[];
}

export interface CommitHistoryOptions {
  limit: number;
  offset: number;
}

export interface DiffSegment {
  text: string;
  emphasized: boolean;
}

export interface DiffLine {
  type: "context" | "add" | "remove";
  text: string;
  segments?: DiffSegment[];
}

export interface FileDiff {
  path: string;
  change: "add" | "modify" | "delete";
  lines?: DiffLine[];
  binary?: boolean;
  tooLarge?: boolean;
}

/*
  Problems the user has to fix. Everything else — an unreachable remote
  above all — is a state, not an error, and is retried quietly.
*/
export type SyncErrorKind
  = "auth"
  | "no-remote"
  | "unrelated-histories"
  | "other";

export interface SyncStatus {
  /** A git repository exists in the graph folder. */
  repo: boolean;
  /** The remote and branch auto-sync pushes to, if the repo has one. */
  remote: { name: string; branch: string } | null;
  /** Switched on for this repo — even if its remote has since gone. */
  enabled: boolean;
  state: "idle" | "syncing" | "offline" | "error";
  /** Local commits the remote does not have yet. */
  unpushedCommits: number;
  /** Milliseconds since the epoch of the last successful exchange. */
  lastSyncedAt: number | null;
  error: { kind: SyncErrorKind; message: string } | null;
}
