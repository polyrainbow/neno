import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import NodeFsGit from "./nodeFsGit";

/*
  The isomorphic-git file system against a real temporary directory. The
  paths isomorphic-git passes are absolute relative to the graph root
  (it is initialized with dir "/"), so they have to land inside the
  rooted folder and nowhere else.
*/

describe("NodeFsGit", () => {
  let root: string;
  let gitFs: NodeFsGit;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "neno-git-test-"));
    gitFs = new NodeFsGit(root);
  });

  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it("should alias promises to itself, as isomorphic-git expects", () => {
    expect(gitFs.promises).toBe(gitFs);
  });

  it("should resolve isomorphic-git's absolute paths inside the root",
    async () => {
      await gitFs.writeFile("/.git/HEAD", "ref: refs/heads/main\n");
      const onDisk = await fs.readFile(
        path.join(root, ".git", "HEAD"),
        "utf8",
      );
      expect(onDisk).toBe("ref: refs/heads/main\n");
    },
  );

  it("should create missing parent directories on writeFile", async () => {
    await gitFs.writeFile("/.git/refs/heads/main", "abc\n");
    expect(await gitFs.readFile("/.git/refs/heads/main", "utf8")).toBe("abc\n");
  });

  it("should round-trip binary data", async () => {
    const bytes = new Uint8Array([0, 1, 250, 255]);
    await gitFs.writeFile("/.git/objects/ab/cdef", bytes);
    const back = await gitFs.readFile("/.git/objects/ab/cdef");
    expect(back).toBeInstanceOf(Uint8Array);
    expect([...(back as Uint8Array)]).toEqual([0, 1, 250, 255]);
  });

  it("should accept an ArrayBuffer, which is what the proxy sends",
    async () => {
      const buffer = new Uint8Array([7, 8, 9]).slice().buffer;
      await gitFs.writeFile("/.git/objects/x", buffer);
      const back = await gitFs.readFile("/.git/objects/x");
      expect([...(back as Uint8Array)]).toEqual([7, 8, 9]);
    },
  );

  it("should reject a missing file with code ENOENT", async () => {
    await expect(gitFs.readFile("/.git/HEAD"))
      .rejects.toMatchObject({ code: "ENOENT" });
    await expect(gitFs.stat("/.git/HEAD"))
      .rejects.toMatchObject({ code: "ENOENT" });
  });

  it("should stat files and directories", async () => {
    await gitFs.writeFile("/a.txt", "12345");
    const fileStat = await gitFs.stat("/a.txt");
    expect(fileStat.type).toBe("file");
    expect(fileStat.size).toBe(5);

    await gitFs.mkdir("/sub");
    expect((await gitFs.stat("/sub")).type).toBe("dir");
  });

  it("should list a directory in NFC", async () => {
    await fs.writeFile(
      path.join(root, "über.subtext".normalize("NFD")),
      "x",
    );
    expect(await gitFs.readdir("/"))
      .toEqual(["über.subtext".normalize("NFC")]);
  });

  it("should unlink files and rmdir directories", async () => {
    await gitFs.writeFile("/a.txt", "x");
    await gitFs.unlink("/a.txt");
    expect(await gitFs.readdir("/")).toEqual([]);

    await gitFs.mkdir("/sub");
    await gitFs.rmdir("/sub");
    expect(await gitFs.readdir("/")).toEqual([]);
  });

  it("should read and write symlinks", async () => {
    await gitFs.writeFile("/target.txt", "x");
    await gitFs.symlink("target.txt", "/link.txt");
    expect(await gitFs.readlink("/link.txt")).toBe("target.txt");
    expect((await gitFs.lstat("/link.txt")).type).toBe("symlink");
    expect((await gitFs.stat("/link.txt")).type).toBe("file");
  });

  it("should chmod", async () => {
    await gitFs.writeFile("/a.sh", "#!/bin/sh\n");
    await gitFs.chmod("/a.sh", 0o755);
    expect((await gitFs.stat("/a.sh")).mode & 0o777).toBe(0o755);
  });

  it("should refuse paths that escape the root", async () => {
    await expect(gitFs.readFile("/../outside.txt"))
      .rejects.toThrow("Invalid path");
    await expect(gitFs.writeFile("/../outside.txt", "x"))
      .rejects.toThrow("Invalid path");
  });
});
