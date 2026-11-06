import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import GitRepo from "./GitRepo";
import {
  AUTHOR,
  GIT,
  git,
  makeTempDir,
  readFile,
  writeFile,
} from "./test/testRepos";
import { FlushChanges } from "../../src/lib/git/types";

describe("GitRepo", () => {
  let dir: string;
  let repo: GitRepo;

  beforeEach(async () => {
    dir = await makeTempDir("repo");
    repo = new GitRepo({ dir, gitPath: GIT });
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  describe("init", () => {
    it("creates a repo on main with an initial commit", async () => {
      expect(await repo.exists()).toBe(false);

      await repo.init(AUTHOR);

      expect(await repo.exists()).toBe(true);
      expect(git(dir, "symbolic-ref", "--short", "HEAD")).toBe("main");
      expect(git(dir, "log", "--format=%s|%an")).toBe("initial commit|Test");
      expect(await readFile(dir, ".gitignore")).toContain(".DS_Store");
    });

    it("commits files that were already in the folder", async () => {
      await writeFile(dir, "existing.subtext", "already here");

      await repo.init(AUTHOR);

      expect(git(dir, "ls-files").split("\n"))
        .toEqual([".gitignore", "existing.subtext"]);
    });

    it("does nothing to an existing repo", async () => {
      await repo.init(AUTHOR);
      await repo.init(AUTHOR);

      expect(git(dir, "rev-list", "--count", "HEAD")).toBe("1");
    });
  });

  describe("commit", () => {
    const changes = (
      notes: FlushChanges["canonicalNoteSlugs"],
      extra: Partial<FlushChanges> = {},
    ): FlushChanges => ({
      canonicalNoteSlugs: notes,
      aliases: [],
      arbitraryFiles: [],
      flushPins: false,
      ...extra,
    });

    beforeEach(async () => {
      await repo.init(AUTHOR);
    });

    it("names a single new note in the subject", async () => {
      await writeFile(dir, "hello.subtext", "Hello");

      await repo.commit(changes(["hello"]), AUTHOR);

      expect(git(dir, "log", "-1", "--format=%s|%an"))
        .toBe("create: hello|Test");
      expect(git(dir, "status", "--porcelain")).toBe("");
    });

    it("says update for a note that was committed before", async () => {
      await writeFile(dir, "hello.subtext", "Hello");
      await repo.commit(changes(["hello"]), AUTHOR);
      await writeFile(dir, "hello.subtext", "Hello again");

      await repo.commit(changes(["hello"]), AUTHOR);

      expect(git(dir, "log", "-1", "--format=%s")).toBe("update: hello");
    });

    it("commits a deletion when the file is gone", async () => {
      await writeFile(dir, "hello.subtext", "Hello");
      await repo.commit(changes(["hello"]), AUTHOR);
      await fs.rm(`${dir}/hello.subtext`);

      await repo.commit(changes(["hello"]), AUTHOR);

      expect(git(dir, "log", "-1", "--format=%s")).toBe("delete: hello");
      expect(git(dir, "ls-files")).toBe(".gitignore");
    });

    it("ignores a slug that was never on disk or in git", async () => {
      await writeFile(dir, "real.subtext", "Real");

      await repo.commit(changes(["ghost", "real"]), AUTHOR);

      expect(git(dir, "log", "-1", "--format=%s")).toBe("create: real");
    });

    it("makes no commit when nothing changed", async () => {
      await writeFile(dir, "hello.subtext", "Hello");
      await repo.commit(changes(["hello"]), AUTHOR);

      const oid = await repo.commit(changes(["hello"]), AUTHOR);

      expect(oid).toBeNull();
      expect(git(dir, "rev-list", "--count", "HEAD")).toBe("2");
    });

    it("commits an uploaded file with its graph file", async () => {
      await writeFile(dir, "files/photo.png", new Uint8Array([0, 1, 2]));
      await writeFile(dir, "files/photo.png.subtext", ":file:photo.png");

      await repo.commit(
        changes([], { arbitraryFiles: ["files/photo.png"] }),
        AUTHOR,
      );

      expect(git(dir, "log", "-1", "--format=%B")).toBe(
        "create: 1 note, 1 file\n\n"
        + "+ files/photo.png\n"
        + "+ files/photo.png.subtext",
      );
    });

    it("commits the pins file when pins changed", async () => {
      await writeFile(dir, ".pins.neno", "hello");

      await repo.commit(changes([], { flushPins: true }), AUTHOR);

      expect(git(dir, "log", "-1", "--format=%s"))
        .toBe("create file: .pins.neno");
    });

    it("commits every change when a set is 'all'", async () => {
      await writeFile(dir, "a.subtext", "A");
      await writeFile(dir, "b.subtext", "B");

      await repo.commit(changes("all"), AUTHOR);

      expect(git(dir, "log", "-1", "--format=%s"))
        .toBe("create: 2 notes");
      expect(git(dir, "status", "--porcelain")).toBe("");
    });
  });
  describe("history", () => {
    const save = async (slug: string, content: string | null) => {
      if (content === null) {
        await fs.rm(`${dir}/${slug}.subtext`);
      } else {
        await writeFile(dir, `${slug}.subtext`, content);
      }
      await repo.commit({
        canonicalNoteSlugs: [slug],
        aliases: [],
        arbitraryFiles: [],
        flushPins: false,
      }, AUTHOR);
    };

    beforeEach(async () => {
      await writeFile(dir, "seed.subtext", "Seed");
      await repo.init(AUTHOR);
    });

    it("lists commits newest first with what each one changed", async () => {
      await save("a", "A");
      await save("a", "A2");
      await save("a", null);

      const log = await repo.log({ limit: 10, offset: 0 });

      expect(log.map((c) => [c.message.trim(), c.changes])).toEqual([
        ["delete: a", [{ path: "a.subtext", change: "delete" }]],
        ["update: a", [{ path: "a.subtext", change: "modify" }]],
        ["create: a", [{ path: "a.subtext", change: "add" }]],
        ["initial commit", [
          { path: ".gitignore", change: "add" },
          { path: "seed.subtext", change: "add" },
        ]],
      ]);
      expect(log[0].author).toEqual(AUTHOR);
      expect(Math.abs(log[0].timestamp - Date.now() / 1000)).toBeLessThan(60);
      expect(log[0].timezoneOffset).toBe(new Date().getTimezoneOffset());
    });

    it("pages through the history", async () => {
      await save("a", "1");
      await save("a", "2");
      await save("a", "3");

      const page = await repo.log({ limit: 2, offset: 1 });

      expect(page.map((c) => c.message.trim()))
        .toEqual(["update: a", "create: a"]);
    });

    it("diffs a new file as added lines", async () => {
      await save("a", "one\ntwo");
      const [commit] = await repo.log({ limit: 1, offset: 0 });

      expect(await repo.diff(commit.oid)).toEqual([{
        path: "a.subtext",
        change: "add",
        lines: [
          { type: "add", text: "one" },
          { type: "add", text: "two" },
        ],
      }]);
    });

    it("emphasizes the changed words of a modified line", async () => {
      await save("a", "the quick brown fox");
      await save("a", "the slow brown fox");
      const [commit] = await repo.log({ limit: 1, offset: 0 });

      const [file] = await repo.diff(commit.oid);

      expect(file.change).toBe("modify");
      expect(file.lines?.find((l) => l.type === "remove")).toEqual({
        type: "remove",
        text: "the quick brown fox",
        segments: [
          { text: "the ", emphasized: false },
          { text: "quick", emphasized: true },
          { text: " brown fox", emphasized: false },
        ],
      });
      expect(file.lines?.find((l) => l.type === "add")).toEqual({
        type: "add",
        text: "the slow brown fox",
        segments: [
          { text: "the ", emphasized: false },
          { text: "slow", emphasized: true },
          { text: " brown fox", emphasized: false },
        ],
      });
    });

    it("diffs a deleted file as removed lines", async () => {
      await save("a", "gone");
      await save("a", null);
      const [commit] = await repo.log({ limit: 1, offset: 0 });

      expect(await repo.diff(commit.oid)).toEqual([{
        path: "a.subtext",
        change: "delete",
        lines: [{ type: "remove", text: "gone" }],
      }]);
    });

    it("flags a binary file instead of diffing it", async () => {
      await writeFile(dir, "files/x.bin", new Uint8Array([0, 159, 146]));
      await writeFile(dir, "files/x.bin.subtext", ":file:x.bin");
      await repo.commit({
        canonicalNoteSlugs: [],
        aliases: [],
        arbitraryFiles: ["files/x.bin"],
        flushPins: false,
      }, AUTHOR);
      const [commit] = await repo.log({ limit: 1, offset: 0 });

      const [binary] = await repo.diff(commit.oid);

      expect(binary).toEqual({
        path: "files/x.bin",
        change: "add",
        binary: true,
      });
    });

    it("diffs the initial commit against nothing", async () => {
      const [initial] = await repo.log({ limit: 1, offset: 0 });

      const diff = await repo.diff(initial.oid);

      expect(diff.map((f) => [f.path, f.change])).toEqual([
        [".gitignore", "add"],
        ["seed.subtext", "add"],
      ]);
    });
  });
});
