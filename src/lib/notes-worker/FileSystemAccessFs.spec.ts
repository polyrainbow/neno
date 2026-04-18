import { describe, it, expect } from "vitest";
import FakeDirectoryHandle from "./test/FakeDirectoryHandle";
import FileSystemAccessFs from "./FileSystemAccessFs";

const makeFs = () => {
  const handle = new FakeDirectoryHandle();
  const fs = new FileSystemAccessFs(
    handle as unknown as FileSystemDirectoryHandle,
  );
  return { handle, fs };
};

describe("FileSystemAccessFs", () => {
  it("round-trips a utf8 string file", async () => {
    const { fs } = makeFs();
    await fs.writeFile("/hello.txt", "hello world");
    const result = await fs.readFile("/hello.txt", { encoding: "utf8" });
    expect(result).toBe("hello world");
  });

  it("round-trips a binary file", async () => {
    const { fs } = makeFs();
    const bytes = new Uint8Array([1, 2, 3, 4]);
    await fs.writeFile("/blob.bin", bytes);
    const read = await fs.readFile("/blob.bin") as Uint8Array;
    expect(Array.from(read)).toEqual([1, 2, 3, 4]);
  });

  it("creates nested directories implicitly on writeFile", async () => {
    const { fs } = makeFs();
    await fs.writeFile("/.git/objects/ab/cd", "x");
    const result = await fs.readFile("/.git/objects/ab/cd", "utf8");
    expect(result).toBe("x");
  });

  it("lists readdir entries", async () => {
    const { fs } = makeFs();
    await fs.writeFile("/a.txt", "a");
    await fs.writeFile("/b.txt", "b");
    await fs.mkdir("/sub");
    const names = await fs.readdir("/");
    expect(names.sort()).toEqual(["a.txt", "b.txt", "sub"]);
  });

  it("throws ENOENT for missing readFile", async () => {
    const { fs } = makeFs();
    await expect(fs.readFile("/nope.txt", "utf8"))
      .rejects.toMatchObject({ code: "ENOENT" });
  });

  it("throws ENOENT for missing readdir", async () => {
    const { fs } = makeFs();
    await expect(fs.readdir("/nope"))
      .rejects.toMatchObject({ code: "ENOENT" });
  });

  it("unlink removes files", async () => {
    const { fs } = makeFs();
    await fs.writeFile("/x.txt", "x");
    await fs.unlink("/x.txt");
    await expect(fs.readFile("/x.txt", "utf8"))
      .rejects.toMatchObject({ code: "ENOENT" });
  });

  it("mkdir + rmdir work", async () => {
    const { fs } = makeFs();
    await fs.mkdir("/a");
    await fs.mkdir("/a/b");
    const stat = await fs.stat("/a/b");
    expect(stat.isDirectory()).toBe(true);
    await fs.rmdir("/a/b");
    await expect(fs.stat("/a/b"))
      .rejects.toMatchObject({ code: "ENOENT" });
  });

  it("stat reports file vs dir correctly", async () => {
    const { fs } = makeFs();
    await fs.writeFile("/f.txt", "hi");
    await fs.mkdir("/d");

    const fileStat = await fs.stat("/f.txt");
    expect(fileStat.isFile()).toBe(true);
    expect(fileStat.isDirectory()).toBe(false);
    expect(fileStat.size).toBe(2);

    const dirStat = await fs.stat("/d");
    expect(dirStat.isDirectory()).toBe(true);
    expect(dirStat.isFile()).toBe(false);
  });

  it("lstat matches stat (no symlinks)", async () => {
    const { fs } = makeFs();
    await fs.writeFile("/y.txt", "y");
    const s = await fs.lstat("/y.txt");
    expect(s.isFile()).toBe(true);
  });

  it("exposes promises namespace pointing at itself", () => {
    const { fs } = makeFs();
    expect(fs.promises).toBe(fs);
  });

  it("handles paths without leading slash", async () => {
    const { fs } = makeFs();
    await fs.writeFile("a/b.txt", "ab");
    expect(await fs.readFile("a/b.txt", "utf8")).toBe("ab");
  });
});
