/*
  Replays the local commits onto what was fetched. Runs under the
  worktree lock, and never leaves the repository mid-rebase: anything
  it cannot finish is aborted.
*/

import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import GitRepo, { splitNul } from "./GitRepo";
import { GitError } from "./runGit";
import { isBinary } from "../../src/lib/git/diff";
import { GitAuthor } from "../../src/lib/git/types";

export async function isRebaseInProgress(repo: GitRepo): Promise<boolean> {
  for (const marker of ["rebase-merge", "rebase-apply"]) {
    try {
      await fs.stat(path.join(repo.dir, ".git", marker));
      return true;
    } catch {
      // Not this one.
    }
  }
  return false;
}

function committerEnv(author: GitAuthor): Record<string, string> {
  return {
    GIT_COMMITTER_NAME: author.name,
    GIT_COMMITTER_EMAIL: author.email,
  };
}

async function conflictedPaths(repo: GitRepo): Promise<string[]> {
  return splitNul(
    await repo.git(["diff", "--name-only", "--diff-filter=U", "-z"]),
  );
}

/*
  Runs one rebase command. True when the rebase is finished, false when
  it stopped at conflicts; anything else is thrown.
*/
async function step(
  repo: GitRepo,
  args: string[],
  env: Record<string, string>,
): Promise<boolean> {
  try {
    await repo.git(args, { env });
    return !await isRebaseInProgress(repo);
  } catch (error) {
    if (
      error instanceof GitError
      && !error.killed
      && await isRebaseInProgress(repo)
      && (await conflictedPaths(repo)).length > 0
    ) {
      return false;
    }
    throw error;
  }
}

/** The index stages of a conflicted path: 1 base, 2 upstream, 3 local. */
async function readStages(
  repo: GitRepo,
  file: string,
): Promise<Map<number, string>> {
  const output = await repo.git(["ls-files", "--unmerged", "-z", "--", file]);
  const stages = new Map<number, string>();
  for (const entry of output.split("\0")) {
    // "<mode> <oid> <stage>\t<path>"
    const match = /^\d+ ([0-9a-f]+) ([123])\t/.exec(entry);
    if (match) stages.set(Number(match[2]), match[1]);
  }
  return stages;
}

async function writeWorktreeFile(
  repo: GitRepo,
  file: string,
  bytes: Uint8Array,
): Promise<void> {
  const target = path.join(repo.dir, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, bytes);
}

/*
  A three-way merge of text that settles every overlapping hunk for one
  side and keeps everything that does not overlap from both.
*/
async function mergeFavoring(
  repo: GitRepo,
  upstream: Uint8Array,
  base: Uint8Array,
  local: Uint8Array,
  favor: "upstream" | "local",
): Promise<Buffer> {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "neno-merge-"));
  try {
    const files = ["upstream", "base", "local"].map((n) => path.join(tmp, n));
    await fs.writeFile(files[0], upstream);
    await fs.writeFile(files[1], base);
    await fs.writeFile(files[2], local);
    return await repo.gitBytes(
      [
        "merge-file", "--stdout",
        favor === "upstream" ? "--ours" : "--theirs",
        ...files,
      ],
      // The exit code counts conflicts; with a side favored there are none.
      { okCodes: Array.from({ length: 128 }, (_, i) => i) },
    );
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
}

async function authorTime(
  repo: GitRepo,
  rev: string,
  file?: string,
): Promise<number> {
  const output = await repo.git(
    ["log", "-1", "--format=%at", rev, ...file ? ["--", file] : []],
  );
  return Number(output.trim() || 0);
}

/*
  Settles every conflict of the commit being replayed, last writer wins:
  per file, the side whose latest commit touching it is newer. An edit
  beats a deletion whatever the times. Returns whether the local side
  lost anything.
*/
async function resolveConflicts(repo: GitRepo): Promise<boolean> {
  const localTime = await authorTime(repo, "REBASE_HEAD");
  let localLost = false;

  for (const file of await conflictedPaths(repo)) {
    const stages = await readStages(repo, file);
    const upstreamOid = stages.get(2);
    const localOid = stages.get(3);
    const blob = (oid: string) => repo.gitBytes(["cat-file", "blob", oid]);

    if (upstreamOid && localOid) {
      const upstream = await blob(upstreamOid);
      const local = await blob(localOid);
      const baseOid = stages.get(1);
      const base = baseOid ? await blob(baseOid) : Buffer.alloc(0);
      const localWins = localTime >= await authorTime(repo, "HEAD", file);

      if (isBinary(upstream) || isBinary(local) || isBinary(base)) {
        await writeWorktreeFile(repo, file, localWins ? local : upstream);
      } else {
        await writeWorktreeFile(
          repo,
          file,
          await mergeFavoring(
            repo, upstream, base, local, localWins ? "local" : "upstream",
          ),
        );
      }
      localLost ||= !localWins;
    } else if (upstreamOid || localOid) {
      // Deleted on one side, edited on the other: the edit stays.
      await writeWorktreeFile(
        repo,
        file,
        await blob((upstreamOid ?? localOid) as string),
      );
    }
    await repo.git(["add", "--", file]);
  }

  return localLost;
}

export async function rebaseOnto(
  repo: GitRepo,
  upstream: string,
  author: GitAuthor,
): Promise<void> {
  const env = committerEnv(author);
  try {
    let finished = await step(
      repo,
      [
        "rebase", "--quiet", "--no-autostash",
        "--strategy-option=no-renames",
        upstream,
      ],
      env,
    );

    while (!finished) {
      const replayed = await repo.revParse("REBASE_HEAD");
      if (await resolveConflicts(repo) && replayed) {
        /*
          The rebase drops the local commit from the branch, and the
          reflog only keeps it until gc. A ref keeps it for good.
        */
        await repo.git([
          "update-ref",
          `refs/neno/overwritten/${Date.now()}-${replayed.slice(0, 12)}`,
          replayed,
        ]);
      }
      // A commit the resolution emptied has nothing left to replay.
      const empty = await repo.succeeds(
        ["diff", "--cached", "--quiet", "HEAD"],
      );
      finished = await step(
        repo,
        ["rebase", empty ? "--skip" : "--continue"],
        env,
      );
    }
  } catch (error) {
    if (await isRebaseInProgress(repo)) {
      await repo.git(["rebase", "--abort"]);
    }
    throw error;
  }
}
