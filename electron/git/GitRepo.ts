/*
  Local git operations on one graph folder, through the system git.
  Nothing here touches the network, and nothing here locks: GitSync
  decides what may run at the same time.
*/

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { createGitRunner, GitRunner, GitRunOptions } from "./runGit";
import {
  ChangedFile,
  CommitHistoryOptions,
  CommitInfo,
  FileDiff,
  FlushChanges,
  GitAuthor,
} from "../../src/lib/git/types";
import {
  computeDiffLines,
  decode,
  isBinary,
  MAX_DIFF_BYTES,
} from "../../src/lib/git/diff";
import formatCommitMessage from "../../src/lib/git/commitMessage";

const GITIGNORE_DEFAULT = ".DS_Store\n";
const GRAPH_FILE_EXTENSION = ".subtext";
const PINS_FILENAME = ".pins.neno";

export interface RemoteTarget {
  /** The remote's name, e.g. "origin". */
  name: string;
  /** The branch on the remote. */
  branch: string;
  localBranch: string;
  /** Whether the local branch already tracks it. */
  hasUpstream: boolean;
}

export function authorEnv(author: GitAuthor): Record<string, string> {
  return {
    GIT_AUTHOR_NAME: author.name,
    GIT_AUTHOR_EMAIL: author.email,
    GIT_COMMITTER_NAME: author.name,
    GIT_COMMITTER_EMAIL: author.email,
  };
}

/*
  git writes a zone as "+0100"; Date.prototype.getTimezoneOffset() — the
  convention the history view already used — calls that -60.
*/
function toTimezoneOffset(zone: string): number {
  const match = /^([+-])(\d{2})(\d{2})$/.exec(zone ?? "");
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  // 0 - x, not -x: UTC must come out as 0, not -0.
  return match[1] === "+" ? 0 - minutes : minutes;
}

/** Splits NUL-separated output into its non-empty fields. */
export function splitNul(output: string): string[] {
  return output.split("\0").filter((field) => field.length > 0);
}

/* `--name-status -z` output: status and path, alternating. */
function parseNameStatus(output: string): ChangedFile[] {
  const fields = splitNul(output);
  const changes: ChangedFile[] = [];
  for (let i = 0; i + 1 < fields.length; i += 2) {
    const status = fields[i];
    changes.push({
      path: fields[i + 1],
      change: status === "A" ? "add" : status === "D" ? "delete" : "modify",
    });
  }
  return changes;
}

export default class GitRepo {
  readonly dir: string;
  #run: GitRunner;

  constructor(options: {
    dir: string;
    gitPath: string;
    extraConfig?: string[];
  }) {
    this.dir = options.dir;
    this.#run = createGitRunner(options);
  }

  /** Runs git in the graph folder and returns stdout as text. */
  async git(args: string[], options?: GitRunOptions): Promise<string> {
    const result = await this.#run(args, options);
    return result.stdout.toString("utf8");
  }

  /** Like git(), but keeps stdout as bytes. */
  async gitBytes(
    args: string[],
    options?: GitRunOptions,
  ): Promise<Buffer> {
    const result = await this.#run(args, options);
    return result.stdout;
  }

  /** Whether `args` exits 0. Any other exit code is a "no". */
  async succeeds(args: string[]): Promise<boolean> {
    try {
      await this.#run(args);
      return true;
    } catch {
      return false;
    }
  }

  async exists(): Promise<boolean> {
    try {
      await fs.stat(path.join(this.dir, ".git"));
      return true;
    } catch {
      return false;
    }
  }

  /** Creates the repository with an initial commit; a no-op if one exists. */
  async init(author: GitAuthor): Promise<void> {
    if (await this.exists()) return;

    await this.git(["init", "--quiet", "--initial-branch=main"]);
    const gitignore = path.join(this.dir, ".gitignore");
    try {
      await fs.writeFile(gitignore, GITIGNORE_DEFAULT, { flag: "wx" });
    } catch {
      // The folder brought a .gitignore of its own; keep it.
    }
    await this.git(["add", "--all"]);
    await this.git(
      ["commit", "--quiet", "--no-verify", "-m", "initial commit"],
      { env: authorEnv(author) },
    );
  }

  async #pathExists(relPath: string): Promise<boolean> {
    try {
      await fs.lstat(path.join(this.dir, relPath));
      return true;
    } catch {
      return false;
    }
  }

  async #stagePaths(paths: string[]): Promise<void> {
    const present: string[] = [];
    const missing: string[] = [];
    for (const relPath of paths) {
      (await this.#pathExists(relPath) ? present : missing).push(relPath);
    }
    /*
      Paths go through stdin: a rename can touch hundreds of notes, and
      argv has a size limit.
    */
    if (present.length > 0) {
      await this.git(
        ["add", "--all", "--pathspec-from-file=-", "--pathspec-file-nul"],
        { input: present.join("\0") },
      );
    }
    /*
      A path that is neither on disk nor tracked — a note created and
      deleted between two commits — is nothing to commit, and
      --ignore-unmatch keeps it from failing the call.
    */
    if (missing.length > 0) {
      await this.git(
        [
          "rm", "--cached", "--quiet", "--ignore-unmatch",
          "--pathspec-from-file=-", "--pathspec-file-nul",
        ],
        { input: missing.join("\0") },
      );
    }
  }

  /** The staged changes, sorted into creates, modifies and removes. */
  async #stagedChanges(): Promise<{
    creates: string[];
    modifies: string[];
    removes: string[];
  }> {
    const changes = parseNameStatus(await this.git([
      "diff", "--cached", "--name-status", "--no-renames", "-z",
    ]));
    const pathsOf = (change: ChangedFile["change"]) => changes
      .filter((c) => c.change === change)
      .map((c) => c.path);
    return {
      creates: pathsOf("add"),
      modifies: pathsOf("modify"),
      removes: pathsOf("delete"),
    };
  }

  /*
    Commits what one flush wrote. Returns the new commit's oid, or null
    when the flush changed nothing git did not already have.
  */
  async commit(
    changes: FlushChanges,
    author: GitAuthor,
  ): Promise<string | null> {
    const sets = [
      changes.canonicalNoteSlugs,
      changes.aliases,
      changes.arbitraryFiles,
    ];

    if (sets.some((set) => set === "all")) {
      await this.git(["add", "--all"]);
    } else {
      const paths = new Set<string>();
      for (const slug of [
        ...changes.canonicalNoteSlugs as string[],
        ...changes.aliases as string[],
      ]) {
        paths.add(`${slug}${GRAPH_FILE_EXTENSION}`);
      }
      // An uploaded file is its payload plus a graph file describing it.
      for (const slug of changes.arbitraryFiles as string[]) {
        paths.add(slug);
        paths.add(`${slug}${GRAPH_FILE_EXTENSION}`);
      }
      if (changes.flushPins) {
        paths.add(PINS_FILENAME);
      }
      await this.#stagePaths([...paths]);
    }

    return this.#commitStaged(author);
  }

  /** Commits these paths, relative to the graph folder, as they are now. */
  async commitPaths(
    paths: string[],
    author: GitAuthor,
  ): Promise<string | null> {
    await this.#stagePaths(paths);
    return this.#commitStaged(author);
  }

  async #commitStaged(author: GitAuthor): Promise<string | null> {
    const { creates, modifies, removes } = await this.#stagedChanges();
    if (creates.length + modifies.length + removes.length === 0) {
      return null;
    }

    await this.git(
      ["commit", "--quiet", "--no-verify", "--file=-"],
      {
        input: formatCommitMessage(creates, modifies, removes),
        env: authorEnv(author),
      },
    );
    return (await this.git(["rev-parse", "HEAD"])).trim();
  }

  /** What `oid` changed relative to its first parent, sorted by path. */
  async #changedFiles(
    oid: string,
    parent: string | undefined,
  ): Promise<ChangedFile[]> {
    const changes = parseNameStatus(await this.git(
      parent
        ? ["diff-tree", "-r", "-z", "--name-status", "--no-renames",
          parent, oid]
        : ["diff-tree", "-r", "-z", "--name-status", "--no-renames",
          "--root", "--no-commit-id", oid],
    ));
    changes.sort((a, b) => a.path.localeCompare(b.path));
    return changes;
  }

  async log(options: CommitHistoryOptions): Promise<CommitInfo[]> {
    if (!await this.succeeds(["rev-parse", "--verify", "--quiet", "HEAD"])) {
      return [];
    }
    // Unit and record separators cannot occur in any of the fields.
    const output = await this.git([
      "log",
      `--skip=${options.offset}`,
      `--max-count=${options.limit}`,
      "--date=raw",
      "--format=%H%x1f%P%x1f%an%x1f%ae%x1f%ad%x1f%B%x1e",
    ]);
    const records = output.split("\x1e")
      .map((record) => record.replace(/^\n/, ""))
      .filter((record) => record.length > 0);

    const commits: CommitInfo[] = [];
    for (const record of records) {
      const [oid, parents, name, email, date, message]
        = record.split("\x1f");
      const parent = parents.split(" ").find((p) => p.length > 0);
      const [seconds, zone] = date.split(" ");
      commits.push({
        oid,
        message,
        author: { name, email },
        timestamp: Number(seconds),
        timezoneOffset: toTimezoneOffset(zone),
        changes: await this.#changedFiles(oid, parent),
      });
    }
    return commits;
  }

  /*
    Where auto-sync goes: the current branch's upstream if it has one,
    otherwise the same branch on `origin`. Null for a detached HEAD, or
    when there is neither.
  */
  async detectRemote(): Promise<RemoteTarget | null> {
    const localBranch = (await this.gitOrNull(
      ["symbolic-ref", "--short", "--quiet", "HEAD"],
    ))?.trim();
    if (!localBranch) return null;

    const configured = (await this.gitOrNull(
      ["config", "--get", `branch.${localBranch}.remote`],
    ))?.trim();
    const merge = (await this.gitOrNull(
      ["config", "--get", `branch.${localBranch}.merge`],
    ))?.trim();
    if (configured && configured !== "." && merge?.startsWith("refs/heads/")) {
      return {
        name: configured,
        branch: merge.slice("refs/heads/".length),
        localBranch,
        hasUpstream: true,
      };
    }

    const remotes = (await this.git(["remote"])).split("\n");
    if (!remotes.includes("origin")) return null;
    return {
      name: "origin",
      branch: localBranch,
      localBranch,
      hasUpstream: false,
    };
  }

  /** Like git(), but null instead of an error for a non-zero exit. */
  async gitOrNull(args: string[]): Promise<string | null> {
    try {
      return await this.git(args);
    } catch {
      return null;
    }
  }

  async revParse(rev: string): Promise<string | null> {
    const oid = await this.gitOrNull(
      ["rev-parse", "--verify", "--quiet", `${rev}^{commit}`],
    );
    return oid?.trim() || null;
  }

  async #firstParent(oid: string): Promise<string | undefined> {
    const parents = await this.git(
      ["rev-list", "--parents", "--max-count=1", oid],
    );
    return parents.trim().split(" ")[1];
  }

  async #readBlob(rev: string, file: string): Promise<Buffer> {
    return this.gitBytes(["cat-file", "blob", `${rev}:${file}`]);
  }

  async diff(oid: string): Promise<FileDiff[]> {
    const parent = await this.#firstParent(oid);
    const result: FileDiff[] = [];

    for (const changed of await this.#changedFiles(oid, parent)) {
      const fileDiff: FileDiff = { path: changed.path, change: changed.change };
      let oldBytes: Buffer | null = null;
      let newBytes: Buffer | null = null;

      try {
        if (changed.change !== "add" && parent) {
          oldBytes = await this.#readBlob(parent, changed.path);
        }
        if (changed.change !== "delete") {
          newBytes = await this.#readBlob(oid, changed.path);
        }
      } catch {
        result.push(fileDiff);
        continue;
      }

      if (
        (oldBytes && isBinary(oldBytes))
        || (newBytes && isBinary(newBytes))
      ) {
        result.push({ ...fileDiff, binary: true });
        continue;
      }

      if (
        (oldBytes?.length ?? 0) > MAX_DIFF_BYTES
        || (newBytes?.length ?? 0) > MAX_DIFF_BYTES
      ) {
        result.push({ ...fileDiff, tooLarge: true });
        continue;
      }

      fileDiff.lines = computeDiffLines(
        oldBytes ? decode(oldBytes) : "",
        newBytes ? decode(newBytes) : "",
      );
      result.push(fileDiff);
    }

    return result;
  }
}
