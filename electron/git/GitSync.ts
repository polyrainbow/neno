/*
  Keeps one graph folder's repository in step with its remote.

  Two rules shape everything here:

  - Network calls never hold the worktree lock. Saves take that lock for
    their writes and their commit, so a fetch or push that hangs on an
    unreachable remote would otherwise hang the save. Only local steps
    hold it, and they take milliseconds.
  - Failing to reach the remote is a state, not an error. A LAN-only
    remote is unreachable whenever the laptop is somewhere else; the
    commits wait and go out on a later attempt.
*/

import GitRepo, { RemoteTarget, splitNul } from "./GitRepo";
import Mutex from "./Mutex";
import classifyError from "./classifyError";
import { GitError } from "./runGit";
import { isRebaseInProgress, rebaseOnto } from "./rebase";
import {
  FlushChanges,
  GitAuthor,
  SyncErrorKind,
  SyncStatus,
} from "../../src/lib/git/types";

const AUTO_SYNC_KEY = "neno.autoSync";

export interface GitSyncOptions {
  repo: GitRepo;
  /** Called with every status change. */
  onStatus?: (status: SyncStatus) => void;
  /** Called with the paths a pull changed in the working tree. */
  onPathsChanged?: (paths: string[]) => void | Promise<void>;
  /*
    A pull waits while the editor has unsaved changes; call
    editorBecameClean() once it has none.
  */
  isEditorDirty?: () => boolean;
  /** Time limit for one fetch or push. */
  networkTimeoutMs?: number;
  /** How often to pull while the window has focus. */
  pullIntervalMs?: number;
  /** Focusing the window pulls at most this often. */
  focusThrottleMs?: number;
  /** Waits between retries after a failure; the last one repeats. */
  retryDelaysMs?: number[];
}

/** A failure the user has to act on, with the kind the UI shows. */
class SyncError extends Error {
  readonly kind: SyncErrorKind;

  constructor(kind: SyncErrorKind, message: string) {
    super(message);
    this.kind = kind;
  }
}

export default class GitSync {
  #repo: GitRepo;
  #onStatus: (status: SyncStatus) => void;
  #onPathsChanged: (paths: string[]) => void | Promise<void>;
  #isEditorDirty: () => boolean;
  #networkTimeoutMs: number;
  #pullIntervalMs: number;
  #focusThrottleMs: number;
  #retryDelaysMs: number[];
  #pullDeferred = false;
  #lastFocusPullAt = 0;
  #focused = false;
  #intervalTimer: ReturnType<typeof setInterval> | null = null;
  #retryTimer: ReturnType<typeof setTimeout> | null = null;
  #failures = 0;

  /* Writes to the working tree, commits and rebases. */
  #worktreeLock = new Mutex();
  /* Fetches and pushes, one at a time. */
  #network = Promise.resolve();
  #abort = new AbortController();
  #disposed = false;

  #author: GitAuthor = { name: "NENO", email: "noreply@neno.local" };
  #status: SyncStatus = {
    repo: false,
    remote: null,
    enabled: false,
    state: "idle",
    unpushedCommits: 0,
    lastSyncedAt: null,
    error: null,
  };

  constructor(options: GitSyncOptions) {
    this.#repo = options.repo;
    this.#onStatus = options.onStatus ?? (() => {});
    this.#onPathsChanged = options.onPathsChanged ?? (() => {});
    this.#isEditorDirty = options.isEditorDirty ?? (() => false);
    this.#networkTimeoutMs = options.networkTimeoutMs ?? 10 * 60_000;
    this.#pullIntervalMs = options.pullIntervalMs ?? 5 * 60_000;
    this.#focusThrottleMs = options.focusThrottleMs ?? 60_000;
    this.#retryDelaysMs = options.retryDelaysMs
      ?? [15_000, 30_000, 60_000, 120_000, 300_000];
  }

  get repo(): GitRepo {
    return this.#repo;
  }

  getStatus(): SyncStatus {
    return { ...this.#status };
  }

  /** Called once when the folder opens. */
  async start(): Promise<void> {
    /*
      A rebase is only ever left behind by a crash or a power cut in the
      middle of one; the commits it was replaying are still on the
      branch, so going back is safe and the next pull redoes it.
    */
    await this.withWorktreeLock(async () => {
      if (await this.#repo.exists() && await isRebaseInProgress(this.#repo)) {
        await this.#repo.git(["rebase", "--abort"]);
      }
    });
    await this.#refreshStatus();
    if (this.#status.enabled) {
      // The open counts as the focus pull: no second one right after.
      this.#lastFocusPullAt = Date.now();
      void this.#requestNetwork({ pull: true });
    }
  }

  /*
    Who replays local commits in a rebase. Commits bring their own
    author; this covers the pull on folder open, before the first save.
  */
  setAuthor(author: GitAuthor): void {
    this.#author = author;
  }

  /*
    Pulls, then pushes. Resolves when both are over, failed or not. Also
    what the renderer calls when the network comes back, so it starts
    the retries over.
  */
  syncNow(): Promise<void> {
    this.#failures = 0;
    return this.#requestNetwork({ pull: true });
  }

  windowFocused(): void {
    this.#focused = true;
    if (this.#disposed || !this.#status.enabled) return;
    if (Date.now() - this.#lastFocusPullAt >= this.#focusThrottleMs) {
      this.#lastFocusPullAt = Date.now();
      void this.#requestNetwork({ pull: true });
    }
    this.#startInterval();
  }

  windowBlurred(): void {
    this.#focused = false;
    if (this.#intervalTimer) clearInterval(this.#intervalTimer);
    this.#intervalTimer = null;
  }

  #startInterval(): void {
    this.#intervalTimer ??= setInterval(() => {
      if (this.#status.enabled) void this.#requestNetwork({ pull: true });
    }, this.#pullIntervalMs);
  }

  /** The pull that waited for unsaved changes can go ahead now. */
  editorBecameClean(): void {
    if (!this.#pullDeferred) return;
    this.#pullDeferred = false;
    void this.#requestNetwork({ pull: true });
  }

  withWorktreeLock<T>(fn: () => Promise<T>): Promise<T> {
    return this.#worktreeLock.run(fn);
  }

  async commit(
    changes: FlushChanges,
    author: GitAuthor,
  ): Promise<string | null> {
    this.#author = author;
    const oid = await this.withWorktreeLock(
      () => this.#repo.commit(changes, author),
    );
    if (oid !== null && this.#status.enabled) {
      void this.#requestNetwork({ pull: false });
    } else if (oid !== null) {
      await this.#refreshStatus();
    }
    return oid;
  }

  async setAutoSync(enabled: boolean): Promise<SyncStatus> {
    await this.#refreshStatus();
    if (enabled) {
      if (!this.#status.repo) {
        throw new Error("This graph has no git repository");
      }
      const target = await this.#repo.detectRemote();
      if (!target) {
        throw new Error("The repository has no remote to sync with");
      }
      await this.#refuseUnrelatedHistories(target);
      await this.#repo.git(["config", "--local", AUTO_SYNC_KEY, "true"]);
    } else {
      await this.#repo.gitOrNull(
        ["config", "--local", "--unset", AUTO_SYNC_KEY],
      );
    }
    await this.#refreshStatus();
    if (enabled) {
      this.#lastFocusPullAt = Date.now();
      if (this.#focused) this.#startInterval();
      await this.#requestNetwork({ pull: true });
    }
    return this.getStatus();
  }

  /** Resolves once no fetch or push is running or queued. */
  async whenIdle(): Promise<void> {
    let current: Promise<void>;
    do {
      current = this.#network;
      await current;
    } while (current !== this.#network);
  }

  async dispose(): Promise<void> {
    this.#disposed = true;
    this.windowBlurred();
    if (this.#retryTimer) clearTimeout(this.#retryTimer);
    this.#abort.abort();
    await this.#network.catch(() => {});
    await this.#worktreeLock.drain();
  }

  #emit(patch: Partial<SyncStatus>): void {
    this.#status = { ...this.#status, ...patch };
    // A folder switch replaces this instance; its news is stale.
    if (!this.#disposed) this.#onStatus(this.getStatus());
  }

  async #trackingRef(target: RemoteTarget): Promise<string | null> {
    const ref = `refs/remotes/${target.name}/${target.branch}`;
    return (await this.#repo.revParse(ref)) ? ref : null;
  }

  async #countUnpushed(target: RemoteTarget): Promise<number> {
    const tracking = await this.#trackingRef(target);
    const range = tracking
      ? `${tracking}..refs/heads/${target.localBranch}`
      : `refs/heads/${target.localBranch}`;
    const count = await this.#repo.gitOrNull(["rev-list", "--count", range]);
    return Number(count?.trim() ?? 0);
  }

  async #refreshStatus(): Promise<void> {
    const repo = await this.#repo.exists();
    const target = repo ? await this.#repo.detectRemote() : null;
    const enabled = repo
      && (await this.#repo.gitOrNull(
        ["config", "--local", "--bool", AUTO_SYNC_KEY],
      ))?.trim() === "true";
    this.#emit({
      repo,
      remote: target ? { name: target.name, branch: target.branch } : null,
      enabled,
      unpushedCommits: target ? await this.#countUnpushed(target) : 0,
    });
  }

  /*
    Queues a fetch-and-push behind whatever is already running. The
    returned promise settles when this run is over; it never rejects —
    a failure is reported through the status.
  */
  #requestNetwork(options: { pull: boolean }): Promise<void> {
    const run = this.#network.then(async () => {
      try {
        await this.#exchange(options.pull);
      } catch (error) {
        // Must not reject: a rejected link would skip every later run.
        this.#reportFailure(error);
        this.#scheduleRetry();
      }
    });
    this.#network = run;
    return run;
  }

  async #exchange(pull: boolean): Promise<void> {
    if (this.#disposed) return;
    await this.#refreshStatus();
    if (!this.#status.enabled) return;
    const target = await this.#repo.detectRemote();
    if (!target) {
      throw new SyncError(
        "no-remote",
        "The repository has no remote to sync with any more. Add one on "
        + "the command line, or switch auto-sync off.",
      );
    }

    this.#emit({ state: "syncing" });
    try {
      if (pull) {
        await this.#pull(target);
      }
      try {
        await this.#push(target);
      } catch (error) {
        if (classifyError(error) !== "rejected") throw error;
        // The remote moved on since the last fetch.
        await this.#pull(target);
        await this.#push(target);
      }
      this.#emit({
        state: "idle",
        error: null,
        lastSyncedAt: Date.now(),
      });
      this.#failures = 0;
    } catch (error) {
      this.#reportFailure(error);
      this.#scheduleRetry();
    }
    await this.#refreshStatus();
  }

  #scheduleRetry(): void {
    if (this.#disposed || this.#retryTimer) return;
    const delays = this.#retryDelaysMs;
    const delay = delays[Math.min(this.#failures, delays.length - 1)];
    this.#failures++;
    this.#retryTimer = setTimeout(() => {
      this.#retryTimer = null;
      void this.#requestNetwork({ pull: true });
    }, delay);
  }

  /*
    Turning sync on for a repo that was initialized on its own would make
    every pull a rebase of one history onto an unrelated one. If the
    remote cannot be reached now, the check happens on the first pull.
  */
  async #refuseUnrelatedHistories(target: RemoteTarget): Promise<void> {
    try {
      await this.#fetch(target);
    } catch (error) {
      if (classifyError(error) === "offline") return;
      throw error;
    }
    await this.#checkRelated(target);
  }

  async #checkRelated(target: RemoteTarget): Promise<void> {
    const tracking = await this.#trackingRef(target);
    if (!tracking) return;
    const local = `refs/heads/${target.localBranch}`;
    if (!await this.#repo.succeeds(["merge-base", local, tracking])) {
      throw new SyncError(
        "unrelated-histories",
        `This repository and ${target.name}/${target.branch} share no `
        + "history. Clone the remote into a folder and open that folder "
        + "in NENO instead.",
      );
    }
  }

  async #fetch(target: RemoteTarget): Promise<void> {
    try {
      await this.#repo.git(
        [
          "fetch", "--quiet", "--no-tags", target.name,
          `+refs/heads/${target.branch}:`
          + `refs/remotes/${target.name}/${target.branch}`,
        ],
        { timeoutMs: this.#networkTimeoutMs, signal: this.#abort.signal },
      );
    } catch (error) {
      // An empty remote, or one that never had this branch.
      if (
        error instanceof GitError
        && /couldn't find remote ref/i.test(error.stderr)
      ) {
        return;
      }
      throw error;
    }
  }

  async #pull(target: RemoteTarget): Promise<void> {
    await this.#fetch(target);
    const changed = await this.withWorktreeLock(
      () => this.#integrate(target),
    );
    if (changed.length > 0) {
      await this.#onPathsChanged(changed);
    }
  }

  /*
    Brings the fetched commits into the local branch. Returns the paths
    that changed in the working tree.
  */
  async #integrate(target: RemoteTarget): Promise<string[]> {
    if (this.#isEditorDirty()) {
      this.#pullDeferred = true;
      return [];
    }

    const tracking = await this.#trackingRef(target);
    if (!tracking) return [];

    const local = `refs/heads/${target.localBranch}`;
    const current = (await this.#repo.gitOrNull(
      ["symbolic-ref", "--quiet", "HEAD"],
    ))?.trim();
    // Someone switched branches or detached HEAD on the command line.
    if (current !== local) return [];

    if (await this.#repo.succeeds(
      ["merge-base", "--is-ancestor", tracking, local],
    )) {
      return [];
    }
    await this.#checkRelated(target);

    /*
      A save that has written files but not committed them yet. Its
      commit comes in a moment, and its push — rejected — pulls again.
    */
    const uncommitted = await this.#repo.git(
      ["status", "--porcelain", "--untracked-files=no"],
    );
    if (uncommitted.trim().length > 0) return [];

    /*
      An untracked file the remote also has — .pins.neno, written on first
      load and committed only with the first pin — would make the rebase
      refuse to start, now and on every later pull. Committing it lets the
      usual conflict rules decide between the two versions.
    */
    const untracked = splitNul(await this.#repo.git(
      ["ls-files", "--others", "--exclude-standard", "-z"],
    ));
    if (untracked.length > 0) {
      const upstreamFiles = new Set(splitNul(await this.#repo.git(
        ["ls-tree", "-r", "--name-only", "-z", tracking],
      )));
      const colliding = untracked.filter((p) => upstreamFiles.has(p));
      if (colliding.length > 0) {
        await this.#repo.commitPaths(colliding, this.#author);
      }
    }

    const before = await this.#repo.revParse(local);
    await rebaseOnto(this.#repo, tracking, this.#author);
    const after = await this.#repo.revParse(local);
    if (!before || !after || before === after) return [];

    return splitNul(await this.#repo.git(
      ["diff", "--name-only", "--no-renames", "-z", before, after],
    ));
  }

  async #push(target: RemoteTarget): Promise<void> {
    if (await this.#countUnpushed(target) === 0) return;
    const local = `refs/heads/${target.localBranch}`;
    const oid = await this.#repo.revParse(local);
    await this.#repo.git(
      [
        "push", "--quiet", "--porcelain",
        ...target.hasUpstream ? [] : ["--set-upstream"],
        target.name,
        `${local}:refs/heads/${target.branch}`,
      ],
      { timeoutMs: this.#networkTimeoutMs, signal: this.#abort.signal },
    );
    // The tracking ref is what "unpushed" is counted against.
    if (oid) {
      await this.#repo.git([
        "update-ref",
        `refs/remotes/${target.name}/${target.branch}`,
        oid,
      ]);
    }
  }

  #reportFailure(error: unknown): void {
    if (this.#disposed) return;
    if (error instanceof SyncError) {
      this.#emit({
        state: "error",
        error: { kind: error.kind, message: error.message },
      });
      return;
    }
    const failure = classifyError(error);
    const message = error instanceof GitError
      ? error.stderr.trim() || error.message
      : error instanceof Error ? error.message : String(error);
    if (failure === "offline") {
      this.#emit({ state: "offline", error: null });
    } else if (failure === "rejected") {
      /*
        Still behind after a pull — the pull waited for unsaved changes,
        or another machine pushed again in between. The retry sorts it.
      */
      this.#emit({ state: "idle", error: null });
    } else {
      this.#emit({
        state: "error",
        error: { kind: failure === "auth" ? "auth" : "other", message },
      });
    }
  }
}
