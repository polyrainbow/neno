import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import NodeFsStorageProvider from "./NodeFsStorageProvider";

/*
  Asserts the behaviours src/lib/notes/index.spec.ts relies on from
  MockStorageProvider, but against a real temporary directory — plus the
  two things only a real file system can get wrong: recursive listings
  and macOS's NFD directory entries.
*/

const readAll = async (stream: ReadableStream): Promise<Uint8Array> => {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value as Uint8Array);
  }
  const size = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
};

const streamOf = (data: Uint8Array): ReadableStream<Uint8Array> => {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  });
};


describe("NodeFsStorageProvider", () => {
  let root: string;
  let storageProvider: NodeFsStorageProvider;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "neno-test-"));
    storageProvider = new NodeFsStorageProvider(root);
  });

  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it("should round-trip a string object", async () => {
    await storageProvider.writeObject("note.subtext", "Test note");
    expect(await storageProvider.readObjectAsString("note.subtext"))
      .toBe("Test note");
  });

  it("should create missing parent directories on write", async () => {
    await storageProvider.writeObject("files/deep/a.txt", "x");
    expect(await storageProvider.readObjectAsString("files/deep/a.txt"))
      .toBe("x");
  });

  it("should reject reading an object that does not exist", async () => {
    await expect(storageProvider.readObjectAsString("nope.subtext"))
      .rejects.toThrow();
  });

  it("should list all object names recursively", async () => {
    await storageProvider.writeObject("a.subtext", "a");
    await storageProvider.writeObject("files/b.txt", "bb");
    await storageProvider.writeObject("files/nested/c.txt", "ccc");

    const names = await storageProvider.getAllObjectNames();
    expect(names.sort()).toEqual([
      "a.subtext",
      "files/b.txt",
      "files/nested/c.txt",
    ]);
  });

  it("should report object and total sizes", async () => {
    await storageProvider.writeObject("a.subtext", "12345");
    await storageProvider.writeObject("files/b.txt", "123");

    expect(await storageProvider.getObjectSize("a.subtext")).toBe(5);
    expect(await storageProvider.getTotalSize()).toBe(8);
  });

  it("should rename an object within the same folder", async () => {
    await storageProvider.writeObject("old.subtext", "content");
    await storageProvider.renameObject("old.subtext", "new.subtext");

    expect(await storageProvider.readObjectAsString("new.subtext"))
      .toBe("content");
    await expect(storageProvider.readObjectAsString("old.subtext"))
      .rejects.toThrow();
  });

  it("should rename an object across folders", async () => {
    await storageProvider.writeObject("old.subtext", "content");
    await storageProvider.renameObject("old.subtext", "files/new.subtext");

    expect(await storageProvider.readObjectAsString("files/new.subtext"))
      .toBe("content");
  });

  it("should remove an object", async () => {
    await storageProvider.writeObject("a.subtext", "a");
    await storageProvider.removeObject("a.subtext");
    expect(await storageProvider.getAllObjectNames()).toEqual([]);
  });

  it("should list sub directories", async () => {
    await storageProvider.writeObject("files/b.txt", "b");
    await storageProvider.writeObject("a.subtext", "a");
    expect(await storageProvider.listSubDirectories("")).toEqual(["files"]);
  });

  /*
    macOS returns directory listings in NFD ("u" + combining diaeresis)
    even for names written as NFC. Everything above the storage provider
    assumes NFC, so the provider has to normalize.
  */
  it("should return filenames in NFC even if stored as NFD", async () => {
    const nfc = "über.subtext".normalize("NFC");
    const nfd = "über.subtext".normalize("NFD");

    await fs.writeFile(path.join(root, nfd), "content");

    const names = await storageProvider.getAllObjectNames();
    expect(names).toEqual([nfc]);
    expect(names[0]).not.toBe(nfd);
  });

  it("should read a filename written as NFC back as NFC", async () => {
    const nfc = "grün.subtext".normalize("NFC");
    await storageProvider.writeObject(nfc, "content");

    expect(await storageProvider.getAllObjectNames()).toEqual([nfc]);
    expect(await storageProvider.readObjectAsString(nfc)).toBe("content");
  });

  it("should write an object from a readable and return its size",
    async () => {
      const data = new Uint8Array([1, 2, 3, 4, 5]);
      const size = await storageProvider.writeObjectFromReadable(
        "files/blob.bin",
        streamOf(data),
      );

      expect(size).toBe(5);
      const readBack = await readAll(
        await storageProvider.getReadableStream("files/blob.bin"),
      );
      expect([...readBack]).toEqual([1, 2, 3, 4, 5]);
    },
  );

  it("should honour a ByteRange on getReadableStream", async () => {
    await storageProvider.writeObject("a.txt", "0123456789");

    const stream = await storageProvider.getReadableStream(
      "a.txt",
      { start: 2, end: 5 },
    );
    const bytes = await readAll(stream);
    expect(new TextDecoder().decode(bytes)).toBe("2345");
  });

  it("should reject request paths that escape the root", async () => {
    await expect(storageProvider.readObjectAsString("../outside.txt"))
      .rejects.toThrow("Invalid request path");
    await expect(storageProvider.writeObject("../outside.txt", "x"))
      .rejects.toThrow("Invalid request path");
  });
});
