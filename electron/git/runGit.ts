/*
  Runs the system git for one graph folder.

  NENO is a GUI app: there is no terminal for git or ssh to prompt on,
  and a prompt nobody answers is a process that never exits. So every
  call is non-interactive — a passphrase or password that is not already
  in the agent, the keychain or a credential helper makes the call fail
  at once instead of hanging — and has a time limit after which it is
  killed.
*/

import { spawn } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export interface GitRunOptions {
  /** Written to the process's stdin. */
  input?: string | Uint8Array;
  timeoutMs?: number;
  signal?: AbortSignal;
  /** Exit codes that count as success. Defaults to [0]. */
  okCodes?: number[];
  env?: Record<string, string>;
}

export interface GitResult {
  code: number;
  stdout: Buffer;
  stderr: string;
}

export type GitRunner = (
  args: string[],
  options?: GitRunOptions,
) => Promise<GitResult>;

export class GitError extends Error {
  readonly args: string[];
  readonly exitCode: number | null;
  readonly stderr: string;
  /** Killed for running over its time limit or by an abort. */
  readonly killed: boolean;

  constructor(
    args: string[],
    exitCode: number | null,
    stderr: string,
    killed: boolean,
  ) {
    const summary = stderr.trim().split("\n").slice(-3).join("\n");
    super(
      killed
        ? `git ${args[0]} was stopped before it finished`
        : `git ${args[0]} failed (${exitCode}): ${summary}`,
    );
    this.args = args;
    this.exitCode = exitCode;
    this.stderr = stderr;
    this.killed = killed;
  }
}

const DEFAULT_TIMEOUT_MS = 60_000;

/*
  ConnectTimeout bounds an unreachable host (a LAN-only remote seen from
  a hotel); the keep-alives bound a connection that drops mid-transfer.
*/
const SSH_COMMAND = [
  "ssh",
  "-o BatchMode=yes",
  "-o ConnectTimeout=5",
  "-o ServerAliveInterval=5",
  "-o ServerAliveCountMax=3",
].join(" ");

/*
  `-c` settings that hold for every call. NENO's commits never ran hooks
  or signed anything under isomorphic-git, and an automatic commit per
  save must not start doing either.
*/
const BASE_CONFIG = [
  "core.quotePath=false",
  "core.precomposeUnicode=true",
  "commit.gpgSign=false",
  "color.ui=false",
  "advice.detachedHead=false",
  /*
    The HTTPS counterpart of ssh's ConnectTimeout: give up on a transfer
    that moves less than 1 KB/s for 20 s, an unreachable host included.
  */
  "http.lowSpeedLimit=1000",
  "http.lowSpeedTime=20",
];

function buildEnv(
  dir: string,
  extra: Record<string, string> | undefined,
): NodeJS.ProcessEnv {
  return {
    ...process.env,
    GIT_TERMINAL_PROMPT: "0",
    GIT_EDITOR: "true",
    GIT_SEQUENCE_EDITOR: "true",
    GIT_SSH_COMMAND: process.env.GIT_SSH_COMMAND ?? SSH_COMMAND,
    // Slugs are names, not globs.
    GIT_LITERAL_PATHSPECS: "1",
    /*
      A graph folder inside some other repository must not become part
      of it: without a .git of its own, git would walk up and find the
      outer one.
    */
    GIT_CEILING_DIRECTORIES: path.dirname(dir),
    // Read-only commands must not compete for index.lock.
    GIT_OPTIONAL_LOCKS: "0",
    // Error messages are matched on, so they must not be translated.
    LC_ALL: "C",
    LANG: "C",
    ...extra,
  };
}

export function createGitRunner(options: {
  gitPath: string;
  dir: string;
  extraConfig?: string[];
}): GitRunner {
  const configArgs = [...BASE_CONFIG, ...(options.extraConfig ?? [])]
    .flatMap((setting) => ["-c", setting]);

  return (args, runOptions = {}) => new Promise((resolve, reject) => {
    if (runOptions.signal?.aborted) {
      reject(new GitError(args, null, "", true));
      return;
    }

    /*
      Its own process group, so that a kill reaches the transport too:
      ssh outlives a killed git and keeps the pipes open, and the call
      would not end until ssh gave up on its own.
    */
    const child = spawn(options.gitPath, [...configArgs, ...args], {
      cwd: options.dir,
      env: buildEnv(options.dir, runOptions.env),
      stdio: ["pipe", "pipe", "pipe"],
      detached: true,
    });

    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    let killed = false;

    const signalGroup = (signal: NodeJS.Signals) => {
      try {
        if (child.pid !== undefined) process.kill(-child.pid, signal);
      } catch {
        // Already gone.
      }
    };
    const kill = () => {
      killed = true;
      signalGroup("SIGTERM");
      setTimeout(() => signalGroup("SIGKILL"), 2000).unref();
    };

    const timer = setTimeout(
      kill,
      runOptions.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    );
    runOptions.signal?.addEventListener("abort", kill, { once: true });

    child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
    // A child that exits before reading its stdin is not an error here.
    child.stdin.on("error", () => {});

    child.on("error", (error) => {
      clearTimeout(timer);
      runOptions.signal?.removeEventListener("abort", kill);
      reject(error);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      runOptions.signal?.removeEventListener("abort", kill);
      const stderrText = Buffer.concat(stderr).toString("utf8");
      const okCodes = runOptions.okCodes ?? [0];
      if (killed || code === null || !okCodes.includes(code)) {
        reject(new GitError(args, code, stderrText, killed));
        return;
      }
      resolve({ code, stdout: Buffer.concat(stdout), stderr: stderrText });
    });

    if (runOptions.input !== undefined) {
      child.stdin.end(runOptions.input);
    } else {
      child.stdin.end();
    }
  });
}

async function isExecutable(file: string): Promise<boolean> {
  try {
    await fs.access(file, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function succeeds(command: string, args: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: "ignore" });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}

/*
  On macOS /usr/bin/git is a stub until the Command Line Tools are
  installed, and running the stub opens Apple's install dialog — so it
  only counts once xcode-select reports a developer directory.
*/
async function locateGit(): Promise<string | null> {
  const candidates = [
    "/opt/homebrew/bin/git",
    "/usr/local/bin/git",
    "/usr/bin/git",
  ];
  for (const candidate of candidates) {
    if (!await isExecutable(candidate)) continue;
    if (
      candidate === "/usr/bin/git"
      && process.platform === "darwin"
      && !await succeeds("/usr/bin/xcode-select", ["-p"])
    ) {
      continue;
    }
    if (await succeeds(candidate, ["--version"])) {
      return candidate;
    }
  }
  return null;
}

let located: Promise<string | null> | null = null;

/** Absolute path of a usable git binary, or null if there is none. */
export function findGit(): Promise<string | null> {
  located ??= locateGit();
  return located;
}
