/*
  Sorts a failed network call by what NENO should do about it. Only the
  "auth" kind is the user's problem; "offline" is the normal state of a
  LAN-only remote seen from anywhere else, and is never an error.
*/

import { GitError } from "./runGit";

export type NetworkFailure = "offline" | "auth" | "rejected" | "other";

const AUTH = [
  /permission denied/i,
  /authentication failed/i,
  /host key verification failed/i,
  /could not read (username|password)/i,
  /terminal prompts disabled/i,
  /invalid username or password/i,
];

const REJECTED = [
  /\[rejected\]/,
  /non-fast-forward/,
  /\(fetch first\)/,
  /updates were rejected/i,
];

const OFFLINE = [
  /could not resolve (host|hostname)/i,
  /connection timed out/i,
  /operation timed out/i,
  /connection refused/i,
  /no route to host/i,
  /network is unreachable/i,
  /network is down/i,
  /connection (closed|reset)/i,
  /broken pipe/i,
  /timeout, server .* not responding/i,
  /unable to access/i,
  /the remote end hung up unexpectedly/i,
];

export default function classifyError(error: unknown): NetworkFailure {
  if (!(error instanceof GitError)) return "other";
  if (error.killed) return "offline";
  const text = error.stderr;
  if (AUTH.some((pattern) => pattern.test(text))) return "auth";
  if (REJECTED.some((pattern) => pattern.test(text))) return "rejected";
  if (OFFLINE.some((pattern) => pattern.test(text))) return "offline";
  return "other";
}
