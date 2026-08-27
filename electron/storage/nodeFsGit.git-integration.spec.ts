import { describe, it, expect, beforeEach, afterEach } from "vitest";
import git from "isomorphic-git";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import NodeFsGit from "./nodeFsGit";
import {
  commitChanged,
  ensureRepo,
  getCommitDiff,
  getCommitHistory,
  hasExistingRepo,
} from "../../src/lib/notes-worker/git";

/*
  The same git helpers src/lib/notes-worker/git.spec.ts exercises against
  FileSystemAccessFs, but driven through the Node adapter against a real
  directory — so a repository written by NENO is a repository the git CLI
  would recognize.
*/

const AUTHOR = { name: "Test", email: "test@example.com" };

describe("git helpers via NodeFsGit", () => {
  let root: string;
  let gitFs: NodeFsGit;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "neno-git-int-"));
    gitFs = new NodeFsGit(root);
  });

  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it("initializes a fresh repo with an initial commit", async () => {
    expect(await hasExistingRepo(gitFs, "/")).toBe(false);
    await ensureRepo(gitFs, "/", AUTHOR);
    expect(await hasExistingRepo(gitFs, "/")).toBe(true);

    const head = await fs.readFile(path.join(root, ".git", "HEAD"), "utf8");
    expect(head).toContain("refs/heads/main");

    const commits = await git.log({ fs: gitFs, dir: "/" });
    expect(commits.length).toBe(1);
    expect(commits[0].commit.message).toContain("initial");
    expect(commits[0].commit.author.name).toBe("Test");
  });

  it("commits pre-existing files in the initial commit", async () => {
    await fs.writeFile(path.join(root, "existing.subtext"), "already here");
    await ensureRepo(gitFs, "/", AUTHOR);

    const tree = await git.listFiles({ fs: gitFs, dir: "/", ref: "HEAD" });
    expect(tree).toContain("existing.subtext");
    expect(tree).toContain(".gitignore");
  });

  it("commits a flush and reports it in the history and diff", async () => {
    await ensureRepo(gitFs, "/", AUTHOR);

    await fs.writeFile(path.join(root, "my-note.subtext"), "# My note\nbody");
    await commitChanged(
      gitFs,
      "/",
      {
        canonicalNoteSlugs: new Set(["my-note"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const history = await getCommitHistory(gitFs, "/", {
      limit: 10,
      offset: 0,
    });
    expect(history.length).toBe(2);
    expect(history[0].message.trim()).toBe("create: my-note");
    expect(history[0].changes).toEqual([
      { path: "my-note.subtext", change: "add" },
    ]);

    const diff = await getCommitDiff(gitFs, "/", history[0].oid);
    expect(diff.map((entry) => entry.path)).toEqual(["my-note.subtext"]);
    expect(diff[0].lines?.some((line) => line.text.includes("My note")))
      .toBe(true);
  });

  it("records a deletion when the file is gone", async () => {
    await fs.writeFile(path.join(root, "doomed.subtext"), "bye");
    await ensureRepo(gitFs, "/", AUTHOR);

    await fs.rm(path.join(root, "doomed.subtext"));
    await commitChanged(
      gitFs,
      "/",
      {
        canonicalNoteSlugs: new Set(["doomed"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const history = await getCommitHistory(gitFs, "/", {
      limit: 10,
      offset: 0,
    });
    expect(history[0].message.trim()).toBe("delete: doomed");
    const tree = await git.listFiles({ fs: gitFs, dir: "/", ref: "HEAD" });
    expect(tree).not.toContain("doomed.subtext");
  });

  it("leaves a clean working tree after a commit", async () => {
    await ensureRepo(gitFs, "/", AUTHOR);
    await fs.writeFile(path.join(root, "a.subtext"), "a");
    await commitChanged(
      gitFs,
      "/",
      {
        canonicalNoteSlugs: new Set(["a"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const matrix = await git.statusMatrix({ fs: gitFs, dir: "/" });
    const dirty = matrix.filter(
      ([, head, workdir, stage]) => head !== workdir || head !== stage,
    );
    expect(dirty).toEqual([]);
  });
});
