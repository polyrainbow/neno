import { describe, it, expect } from "vitest";
import git from "isomorphic-git";
import FakeDirectoryHandle from "./test/FakeDirectoryHandle";
import FileSystemAccessFs from "./FileSystemAccessFs";
import {
  ensureRepo,
  commitChanged,
  getCommitDiff,
  getCommitHistory,
  hasExistingRepo,
} from "./git";

const AUTHOR = { name: "Test", email: "test@example.com" };

const makeFs = () => {
  const handle = new FakeDirectoryHandle();
  const fs = new FileSystemAccessFs(
    handle as unknown as FileSystemDirectoryHandle,
  );
  return { handle, fs };
};

describe("git helpers via FileSystemAccessFs", () => {
  it("ensureRepo initializes a fresh repo with initial commit", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    const head = await fs.readFile("/.git/HEAD", "utf8") as string;
    expect(head).toContain("refs/heads/main");

    const gitignore = await fs.readFile("/.gitignore", "utf8") as string;
    expect(gitignore).toContain(".DS_Store");

    const commits = await git.log({ fs, dir: "/" });
    expect(commits.length).toBe(1);
    expect(commits[0].commit.message).toContain("initial");
    expect(commits[0].commit.author.name).toBe("Test");
  });

  it("ensureRepo commits pre-existing files in initial commit", async () => {
    const { fs } = makeFs();
    await fs.writeFile("/existing.subtext", "already here");
    await fs.writeFile("/other.subtext", "and me");
    await ensureRepo(fs, "/", AUTHOR);

    const tree = await git.listFiles({ fs, dir: "/", ref: "HEAD" });
    expect(tree).toContain("existing.subtext");
    expect(tree).toContain("other.subtext");
    expect(tree).toContain(".gitignore");
  });

  it("hasExistingRepo returns false before init and true after", async () => {
    const { fs } = makeFs();
    expect(await hasExistingRepo(fs, "/")).toBe(false);

    await ensureRepo(fs, "/", AUTHOR);
    expect(await hasExistingRepo(fs, "/")).toBe(true);
  });

  it("ensureRepo is a no-op on an existing repo", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);
    const logBefore = await git.log({ fs, dir: "/" });

    await ensureRepo(fs, "/", { name: "Other", email: "other@x.com" });
    const logAfter = await git.log({ fs, dir: "/" });

    expect(logAfter.length).toBe(logBefore.length);
    expect(logAfter[0].oid).toBe(logBefore[0].oid);
  });

  it("commitChanged commits a new note", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    await fs.writeFile("/my-note.subtext", "hello");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["my-note"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const log = await git.log({ fs, dir: "/" });
    expect(log.length).toBe(2);
    expect(log[0].commit.message).toContain("my-note");
    expect(log[0].commit.author.email).toBe("test@example.com");
  });

  it("commitChanged uses 'create' for a new note", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    await fs.writeFile("/brand-new.subtext", "hi");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["brand-new"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const log = await git.log({ fs, dir: "/" });
    expect(log[0].commit.message.trim()).toBe("create: brand-new");
  });

  it("commitChanged uses 'update' when modifying existing note", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    await fs.writeFile("/existing.subtext", "v1");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["existing"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    await fs.writeFile("/existing.subtext", "v2");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["existing"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const log = await git.log({ fs, dir: "/" });
    expect(log[0].commit.message.trim()).toBe("update: existing");
  });

  it("commitChanged stages a delete when file is missing", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    await fs.writeFile("/doomed.subtext", "x");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["doomed"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    await fs.unlink("/doomed.subtext");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["doomed"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const log = await git.log({ fs, dir: "/" });
    expect(log[0].commit.message).toContain("delete");
  });

  it("commitChanged is a no-op when nothing changed", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);
    const before = await git.log({ fs, dir: "/" });

    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const after = await git.log({ fs, dir: "/" });
    expect(after.length).toBe(before.length);
  });

  it("commitChanged uses statusMatrix when a set is 'all'", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    await fs.writeFile("/a.subtext", "a");
    await fs.writeFile("/b.subtext", "b");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: "all",
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const log = await git.log({ fs, dir: "/" });
    expect(log.length).toBe(2);
  });
});

describe("getCommitHistory", () => {
  it("returns the initial commit with seeded files marked as add", async () => {
    const { fs } = makeFs();
    await fs.writeFile("/seeded.subtext", "hello");
    await ensureRepo(fs, "/", AUTHOR);

    const history = await getCommitHistory(
      fs,
      "/",
      { limit: 10, offset: 0 },
    );

    expect(history.length).toBe(1);
    expect(history[0].message).toContain("initial");
    expect(history[0].author.name).toBe("Test");
    const paths = history[0].changes.map((c) => c.path).sort();
    expect(paths).toContain("seeded.subtext");
    expect(paths).toContain(".gitignore");
    for (const change of history[0].changes) {
      expect(change.change).toBe("add");
    }
  });

  it("classifies add, modify, and delete across commits", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    await fs.writeFile("/note.subtext", "v1");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["note"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    await fs.writeFile("/note.subtext", "v2");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["note"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    await fs.unlink("/note.subtext");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["note"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const history = await getCommitHistory(
      fs,
      "/",
      { limit: 10, offset: 0 },
    );

    expect(history.length).toBe(4);

    const newest = history[0].changes.find((c) => c.path === "note.subtext");
    expect(newest?.change).toBe("delete");

    const middle = history[1].changes.find((c) => c.path === "note.subtext");
    expect(middle?.change).toBe("modify");

    const earliest = history[2].changes.find((c) => c.path === "note.subtext");
    expect(earliest?.change).toBe("add");
  });

});

describe("getCommitDiff", () => {
  it("returns added lines for a brand-new file", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    await fs.writeFile("/note.subtext", "line1\nline2\n");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["note"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const log = await git.log({ fs, dir: "/" });
    const diff = await getCommitDiff(fs, "/", log[0].oid);

    expect(diff.length).toBe(1);
    expect(diff[0].path).toBe("note.subtext");
    expect(diff[0].change).toBe("add");
    const types = diff[0].lines!.map((l) => l.type);
    expect(types.every((t) => t === "add")).toBe(true);
    const texts = diff[0].lines!.map((l) => l.text);
    expect(texts).toContain("line1");
    expect(texts).toContain("line2");
  });

  it("returns add+remove lines for a modified file", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    await fs.writeFile("/note.subtext", "alpha\nbeta\ngamma\n");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["note"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    await fs.writeFile("/note.subtext", "alpha\nBETA\ngamma\n");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["note"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const log = await git.log({ fs, dir: "/" });
    const diff = await getCommitDiff(fs, "/", log[0].oid);

    expect(diff.length).toBe(1);
    expect(diff[0].change).toBe("modify");
    const removed = diff[0].lines!.filter((l) => l.type === "remove");
    const added = diff[0].lines!.filter((l) => l.type === "add");
    expect(removed.map((l) => l.text)).toContain("beta");
    expect(added.map((l) => l.text)).toContain("BETA");
    const context = diff[0].lines!.filter((l) => l.type === "context");
    expect(context.map((l) => l.text)).toContain("alpha");
    expect(context.map((l) => l.text)).toContain("gamma");
  });

  it("marks emphasized segments on modified lines", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    await fs.writeFile("/note.subtext", "the quick brown fox\n");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["note"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    await fs.writeFile("/note.subtext", "the slow brown fox\n");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["note"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const log = await git.log({ fs, dir: "/" });
    const diff = await getCommitDiff(fs, "/", log[0].oid);

    const removed = diff[0].lines!.find((l) => l.type === "remove");
    const added = diff[0].lines!.find((l) => l.type === "add");

    expect(removed?.segments).toBeDefined();
    expect(added?.segments).toBeDefined();

    const removedEmphasized = removed!.segments!
      .filter((s) => s.emphasized)
      .map((s) => s.text)
      .join("");
    const addedEmphasized = added!.segments!
      .filter((s) => s.emphasized)
      .map((s) => s.text)
      .join("");

    expect(removedEmphasized).toContain("quick");
    expect(addedEmphasized).toContain("slow");

    const removedContext = removed!.segments!
      .filter((s) => !s.emphasized)
      .map((s) => s.text)
      .join("");
    expect(removedContext).toContain("the ");
    expect(removedContext).toContain(" brown fox");
  });

  it("returns removed lines for a deleted file", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    await fs.writeFile("/gone.subtext", "x\ny\n");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["gone"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    await fs.unlink("/gone.subtext");
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(["gone"]),
        aliases: new Set(),
        arbitraryFiles: new Set(),
        flushPins: false,
      },
      AUTHOR,
    );

    const log = await git.log({ fs, dir: "/" });
    const diff = await getCommitDiff(fs, "/", log[0].oid);

    expect(diff.length).toBe(1);
    expect(diff[0].change).toBe("delete");
    expect(diff[0].lines!.every((l) => l.type === "remove")).toBe(true);
  });

  it("flags binary files instead of computing a diff", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    const binary = new Uint8Array([1, 2, 0, 3, 4, 0, 5]);
    await fs.writeFile("/blob.bin", binary);
    await commitChanged(
      fs,
      "/",
      {
        canonicalNoteSlugs: new Set(),
        aliases: new Set(),
        arbitraryFiles: new Set(["blob.bin"]),
        flushPins: false,
      },
      AUTHOR,
    );

    const log = await git.log({ fs, dir: "/" });
    const diff = await getCommitDiff(fs, "/", log[0].oid);

    const binaryEntry = diff.find((d) => d.path === "blob.bin");
    expect(binaryEntry).toBeDefined();
    expect(binaryEntry!.binary).toBe(true);
    expect(binaryEntry!.lines).toBeUndefined();
  });
});

describe("getCommitHistory pagination", () => {
  it("respects limit and offset", async () => {
    const { fs } = makeFs();
    await ensureRepo(fs, "/", AUTHOR);

    for (let i = 0; i < 3; i++) {
      await fs.writeFile(`/n${i}.subtext`, `v${i}`);
      await commitChanged(
        fs,
        "/",
        {
          canonicalNoteSlugs: new Set([`n${i}`]),
          aliases: new Set(),
          arbitraryFiles: new Set(),
          flushPins: false,
        },
        AUTHOR,
      );
    }

    const firstPage = await getCommitHistory(
      fs,
      "/",
      { limit: 2, offset: 0 },
    );
    expect(firstPage.length).toBe(2);
    expect(firstPage[0].message).toContain("n2");
    expect(firstPage[1].message).toContain("n1");

    const secondPage = await getCommitHistory(
      fs,
      "/",
      { limit: 2, offset: 2 },
    );
    expect(secondPage.length).toBe(2);
    expect(secondPage[0].message).toContain("n0");
    expect(secondPage[1].message).toContain("initial");
  });
});
