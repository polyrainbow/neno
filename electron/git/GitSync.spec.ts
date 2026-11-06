import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import GitRepo from "./GitRepo";
import GitSync from "./GitSync";
import {
  AUTHOR,
  exists,
  GIT,
  git,
  makeTempDir,
  readFile,
  writeFile,
} from "./test/testRepos";
import { FlushChanges, SyncStatus } from "../../src/lib/git/types";

/*
  Two machines and a remote, all on the local disk: `remote` is a bare
  repository, `a` is the machine under test (driven through GitSync, as
  NENO drives it) and `b` is the other machine, driven with the git CLI.
*/

const notes = (...slugs: string[]): FlushChanges => ({
  canonicalNoteSlugs: slugs,
  aliases: [],
  arbitraryFiles: [],
  flushPins: false,
});

/*
  Each case spawns git a few dozen times across three repositories, which
  takes seconds when the whole suite runs in parallel.
*/
describe("GitSync", { timeout: 30_000 }, () => {
  let root: string;
  let remote: string;
  let a: string;
  let b: string;
  let syncs: GitSync[];

  const makeSync = (
    dir: string,
    options: Partial<ConstructorParameters<typeof GitSync>[0]> = {},
  ): GitSync => {
    const sync = new GitSync({
      repo: new GitRepo({ dir, gitPath: GIT }),
      ...options,
    });
    syncs.push(sync);
    return sync;
  };

  /** A note saved on machine A, as NENO saves it. */
  const saveOnA = async (
    sync: GitSync,
    slug: string,
    content: string | null,
  ) => {
    await sync.withWorktreeLock(async () => {
      if (content === null) {
        await fs.rm(path.join(a, `${slug}.subtext`));
      } else {
        await writeFile(a, `${slug}.subtext`, content);
      }
    });
    await sync.commit(notes(slug), AUTHOR);
  };

  beforeEach(async () => {
    syncs = [];
    root = await makeTempDir("sync");
    remote = path.join(root, "remote.git");
    a = path.join(root, "a");
    b = path.join(root, "b");

    git(root, "init", "--quiet", "--bare", "--initial-branch=main", remote);
    await fs.mkdir(a);
    await writeFile(a, "shared.subtext", "line 1\nline 2\nline 3\n");
    await new GitRepo({ dir: a, gitPath: GIT }).init(AUTHOR);
    git(a, "remote", "add", "origin", remote);
    git(a, "push", "--quiet", "--set-upstream", "origin", "main");
    git(root, "clone", "--quiet", remote, b);
  });

  afterEach(async () => {
    await Promise.all(syncs.map((sync) => sync.dispose()));
    await fs.rm(root, { recursive: true, force: true });
  });

  it("pushes a commit right after making it", async () => {
    const sync = makeSync(a);
    await sync.start();
    await sync.setAutoSync(true);

    await saveOnA(sync, "hello", "Hello");
    await sync.whenIdle();

    expect(git(remote, "log", "-1", "--format=%s", "main"))
      .toBe("create: hello");
    expect(sync.getStatus()).toMatchObject<Partial<SyncStatus>>({
      enabled: true,
      state: "idle",
      unpushedCommits: 0,
      remote: { name: "origin", branch: "main" },
      error: null,
    });
  });

  it("keeps commits local while auto-sync is off", async () => {
    const sync = makeSync(a);
    await sync.start();

    await saveOnA(sync, "hello", "Hello");
    await sync.whenIdle();

    expect(git(remote, "log", "-1", "--format=%s", "main"))
      .toBe("initial commit");
    expect(sync.getStatus().enabled).toBe(false);
  });

  it("remembers that auto-sync is on in the repo's own config", async () => {
    await makeSync(a).setAutoSync(true);

    const later = makeSync(a);
    await later.start();

    expect(later.getStatus().enabled).toBe(true);
    expect(git(a, "config", "--local", "neno.autoSync")).toBe("true");
  });

  /** A change made and pushed on machine B, `ageSeconds` ago. */
  const pushFromB = async (
    relPath: string,
    content: string | Uint8Array | null,
    ageSeconds = 0,
  ) => {
    if (content === null) {
      git(b, "rm", "--quiet", relPath);
    } else {
      await writeFile(b, relPath, content);
      git(b, "add", relPath);
    }
    const date = `${Math.floor(Date.now() / 1000) - ageSeconds} +0000`;
    git(b, "commit", "--quiet", "-m", `b: ${relPath}`, `--date=${date}`);
    git(b, "push", "--quiet");
  };

  describe("pulling", () => {
    it("brings in what the other machine pushed", async () => {
      const changed: string[][] = [];
      const sync = makeSync(a, {
        onPathsChanged: (paths) => {
          changed.push(paths);
        },
      });
      await sync.start();
      await sync.setAutoSync(true);
      await pushFromB("from-b.subtext", "Hi from B");

      await sync.syncNow();

      expect(await readFile(a, "from-b.subtext")).toBe("Hi from B");
      expect(changed).toEqual([["from-b.subtext"]]);
      expect(git(a, "status", "--porcelain")).toBe("");
    });

    it("rebases and retries when a push is rejected", async () => {
      const sync = makeSync(a);
      await sync.start();
      await sync.setAutoSync(true);
      await pushFromB("from-b.subtext", "B");

      await saveOnA(sync, "from-a", "A");
      await sync.whenIdle();

      expect(git(remote, "log", "--format=%s", "main").split("\n"))
        .toEqual(["create: from-a", "b: from-b.subtext", "initial commit"]);
      expect(await readFile(a, "from-b.subtext")).toBe("B");
      expect(sync.getStatus()).toMatchObject({
        state: "idle",
        unpushedCommits: 0,
      });
    });

    it("retries a rejected push when git prints no hints", async () => {
      /*
        With --porcelain, the "[rejected]" verdict goes to stdout; stderr
        only carries the hints, which git config can switch off.
      */
      const sync = makeSync(a, {
        repo: new GitRepo({
          dir: a,
          gitPath: GIT,
          extraConfig: [
            "advice.pushUpdateRejected=false",
            "advice.pushFetchFirst=false",
            "advice.pushNonFFCurrent=false",
          ],
        }),
      });
      await sync.start();
      await sync.setAutoSync(true);
      await pushFromB("from-b.subtext", "B");

      await saveOnA(sync, "from-a", "A");
      await sync.whenIdle();

      expect(git(remote, "log", "-1", "--format=%s", "main"))
        .toBe("create: from-a");
      expect(sync.getStatus().unpushedCommits).toBe(0);
    });

    it("waits while the editor has unsaved changes", async () => {
      let dirty = true;
      const sync = makeSync(a, { isEditorDirty: () => dirty });
      await sync.start();
      await sync.setAutoSync(true);
      await pushFromB("from-b.subtext", "B");

      await sync.syncNow();
      expect(await exists(a, "from-b.subtext")).toBe(false);

      dirty = false;
      sync.editorBecameClean();
      await sync.whenIdle();

      expect(await readFile(a, "from-b.subtext")).toBe("B");
    });
  });

  describe("when both machines changed the same file", () => {
    const HOUR = 3600;
    let sync: GitSync;

    beforeEach(async () => {
      sync = makeSync(a);
      await sync.start();
      await sync.setAutoSync(true);
    });

    const pushedContent = () => git(remote, "show", "main:shared.subtext");

    it("keeps the newer side of an overlapping edit: local", async () => {
      await pushFromB("shared.subtext", "line 1\nB's line 2\nline 3\n", HOUR);

      await saveOnA(sync, "shared", "line 1\nA's line 2\nline 3\n");
      await sync.whenIdle();

      expect(await readFile(a, "shared.subtext"))
        .toBe("line 1\nA's line 2\nline 3\n");
      expect(pushedContent()).toBe("line 1\nA's line 2\nline 3");
      expect(git(a, "for-each-ref", "refs/neno/")).toBe("");
    });

    it("keeps the newer side of an overlapping edit: remote", async () => {
      await pushFromB(
        "shared.subtext",
        "line 1\nB's line 2\nline 3\n",
        -HOUR,
      );

      await saveOnA(sync, "shared", "line 1\nA's line 2\nline 3\n");
      await sync.whenIdle();

      expect(await readFile(a, "shared.subtext"))
        .toBe("line 1\nB's line 2\nline 3\n");
      expect(sync.getStatus()).toMatchObject({
        state: "idle",
        unpushedCommits: 0,
      });
    });

    it("keeps the overwritten local version under refs/neno/", async () => {
      await pushFromB(
        "shared.subtext",
        "line 1\nB's line 2\nline 3\n",
        -HOUR,
      );

      await saveOnA(sync, "shared", "line 1\nA's line 2\nline 3\n");
      await sync.whenIdle();

      const [ref] = git(a, "for-each-ref", "--format=%(refname)", "refs/neno/")
        .split("\n");
      expect(ref).toMatch(/^refs\/neno\/overwritten\//);
      expect(git(a, "show", `${ref}:shared.subtext`))
        .toBe("line 1\nA's line 2\nline 3");
    });

    it("keeps edits that do not overlap from both sides", async () => {
      await pushFromB("shared.subtext", "B's line 1\nline 2\nline 3\n", -HOUR);

      await saveOnA(sync, "shared", "line 1\nline 2\nA's line 3\n");
      await sync.whenIdle();

      expect(await readFile(a, "shared.subtext"))
        .toBe("B's line 1\nline 2\nA's line 3\n");
      expect(pushedContent()).toBe("B's line 1\nline 2\nA's line 3");
    });

    it("brings a note back that one side deleted and the other edited",
      async () => {
        await pushFromB("shared.subtext", "edited on B\n", HOUR);

        await saveOnA(sync, "shared", null);
        await sync.whenIdle();

        expect(await readFile(a, "shared.subtext")).toBe("edited on B\n");
        expect(pushedContent()).toBe("edited on B");
      });

    it("keeps a local edit to a note the remote deleted later", async () => {
      await pushFromB("shared.subtext", null, -HOUR);

      await saveOnA(sync, "shared", "edited on A\n");
      await sync.whenIdle();

      expect(await readFile(a, "shared.subtext")).toBe("edited on A\n");
      expect(pushedContent()).toBe("edited on A");
    });

    it("gives a binary file whole to the newer side", async () => {
      await writeFile(b, "files/pic.bin", new Uint8Array([0, 1]));
      git(b, "add", ".");
      git(b, "commit", "--quiet", "-m", "pic");
      git(b, "push", "--quiet");
      await sync.syncNow();
      await pushFromB("files/pic.bin", new Uint8Array([0, 2]), HOUR);

      await sync.withWorktreeLock(
        () => writeFile(a, "files/pic.bin", new Uint8Array([0, 3])),
      );
      await sync.commit({
        canonicalNoteSlugs: [],
        aliases: [],
        arbitraryFiles: ["files/pic.bin"],
        flushPins: false,
      }, AUTHOR);
      await sync.whenIdle();

      expect([...await fs.readFile(path.join(a, "files/pic.bin"))])
        .toEqual([0, 3]);
      expect(sync.getStatus().unpushedCommits).toBe(0);
    });
  });

  describe("setting up", () => {
    it("refuses a repo that shares no history with the remote", async () => {
      const c = path.join(root, "c");
      await fs.mkdir(c);
      await new GitRepo({ dir: c, gitPath: GIT }).init(AUTHOR);
      git(c, "remote", "add", "origin", remote);
      const sync = makeSync(c);
      await sync.start();

      await expect(sync.setAutoSync(true)).rejects.toThrow(/share no history/);

      expect(sync.getStatus().enabled).toBe(false);
      expect(git(remote, "log", "--format=%s", "main")).toBe("initial commit");
    });

    it("cannot be switched on without a remote", async () => {
      git(a, "remote", "remove", "origin");
      const sync = makeSync(a);
      await sync.start();

      await expect(sync.setAutoSync(true)).rejects.toThrow(/no remote/);
      expect(sync.getStatus().remote).toBeNull();
    });

    it("sets the upstream on the first push of a new branch", async () => {
      git(a, "switch", "--quiet", "--create", "notes");
      const sync = makeSync(a);
      await sync.start();
      await sync.setAutoSync(true);

      await saveOnA(sync, "hello", "Hello");
      await sync.whenIdle();

      expect(git(remote, "log", "-1", "--format=%s", "notes"))
        .toBe("create: hello");
      expect(git(a, "rev-parse", "--abbrev-ref", "notes@{upstream}"))
        .toBe("origin/notes");
    });
  });

  describe("when the remote cannot be reached", () => {
    it("reports offline, not an error, and keeps the commits", async () => {
      const sync = makeSync(a);
      await sync.start();
      await sync.setAutoSync(true);
      git(a, "remote", "set-url", "origin", "ssh://neno-test.invalid/x.git");

      await saveOnA(sync, "hello", "Hello");
      await sync.whenIdle();

      expect(sync.getStatus()).toMatchObject({
        enabled: true,
        state: "offline",
        unpushedCommits: 1,
        error: null,
      });
    });

    it("never makes a save wait for the network", async () => {
      const sync = makeSync(a, {
        repo: new GitRepo({
          dir: a,
          gitPath: GIT,
          extraConfig: ["protocol.ext.allow=always"],
        }),
        networkTimeoutMs: 3000,
      });
      await sync.start();
      await sync.setAutoSync(true);
      // A remote that accepts the connection and then never answers.
      git(a, "remote", "set-url", "origin", "ext::sleep 30");
      void sync.syncNow();

      const started = Date.now();
      await saveOnA(sync, "hello", "Hello");
      await saveOnA(sync, "hello", "Hello again");

      expect(Date.now() - started).toBeLessThan(1500);
      await sync.whenIdle();
      expect(sync.getStatus()).toMatchObject({
        state: "offline",
        unpushedCommits: 2,
      });
    });

    it("finishes a rebase an earlier run left behind", async () => {
      await pushFromB("shared.subtext", "B\n");
      await writeFile(a, "shared.subtext", "A\n");
      git(a, "commit", "--quiet", "-am", "a");
      git(a, "fetch", "--quiet");
      try {
        git(a, "rebase", "origin/main");
      } catch {
        // Stopped at the conflict, as a crash mid-sync would leave it.
      }
      expect(await exists(a, ".git/rebase-merge")).toBe(true);

      const sync = makeSync(a);
      await sync.start();

      expect(await exists(a, ".git/rebase-merge")).toBe(false);
      expect(git(a, "symbolic-ref", "--short", "HEAD")).toBe("main");
      expect(await readFile(a, "shared.subtext")).toBe("A\n");
    });
  });

  describe("found in review", () => {
    it("is not blocked by an untracked file the remote has too", async () => {
      // NENO writes .pins.neno on first load and commits it with a pin.
      await writeFile(a, ".pins.neno", "");
      const sync = makeSync(a);
      await sync.start();
      await sync.setAutoSync(true);
      await pushFromB(".pins.neno", "pinned-on-b", 3600);

      await sync.syncNow();

      expect(await readFile(a, ".pins.neno")).toBe("pinned-on-b");
      expect(sync.getStatus()).toMatchObject({
        state: "idle",
        error: null,
        unpushedCommits: 0,
      });
    });

    it("reports a remote removed after sync was switched on", async () => {
      const sync = makeSync(a);
      await sync.start();
      await sync.setAutoSync(true);
      git(a, "remote", "remove", "origin");

      await sync.syncNow();

      expect(sync.getStatus()).toMatchObject({
        enabled: true,
        state: "error",
        error: { kind: "no-remote" },
      });
    });

    it("replays local commits as the configured author", async () => {
      const sync = makeSync(a);
      await sync.start();
      sync.setAuthor({ name: "Me", email: "me@example.com" });
      await pushFromB("from-b.subtext", "B");
      await writeFile(a, "local.subtext", "A");
      git(a, "add", ".");
      git(a, "commit", "--quiet", "-m", "local");

      await sync.setAutoSync(true);

      expect(git(a, "log", "-1", "--format=%s|%cn", "main"))
        .toBe("local|Me");
    });
  });
});
