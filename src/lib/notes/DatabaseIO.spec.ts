import { describe, expect, it } from "vitest";
import DatabaseIO from "./DatabaseIO";
import MockStorageProvider from "./test/MockStorageProvider";

describe("DatabaseIO: parsePinsFile", () => {
  it("should return empty array if file is empty", async () => {
    expect(DatabaseIO.parsePinsFile("")).toHaveLength(0);
  });
});

describe("DatabaseIO: getArbitraryGraphFilepath", () => {
  it("should return correct filepath in nested structure", async () => {
    expect(
      DatabaseIO.getArbitraryGraphFilepath("a/b/c/d", "filename.txt"),
    ).toBe("a/b/c/filename.txt");
  });
});

describe("DatabaseIO: graph load", () => {
  class BatchingStorageProvider extends MockStorageProvider {
    batches: string[][] = [];
    singleReads: string[] = [];

    readObjectAsString(requestPath: string): Promise<string> {
      this.singleReads.push(requestPath);
      return super.readObjectAsString(requestPath);
    }

    async readObjectsAsStrings(requestPaths: string[]): Promise<string[]> {
      this.batches.push(requestPaths);
      return Promise.all(
        requestPaths.map((path) => super.readObjectAsString(path)),
      );
    }
  }

  it("should read all notes in one call when the provider can", async () => {
    const storageProvider = new BatchingStorageProvider();
    await storageProvider.writeObject("a.subtext", "Note A\n[[b]]");
    await storageProvider.writeObject("b.subtext", "Note B");

    const io = new DatabaseIO({ storageProvider });
    const graph = await io.getGraph();

    expect(storageProvider.batches).toHaveLength(1);
    expect([...storageProvider.batches[0]].sort())
      .toEqual(["a.subtext", "b.subtext"]);
    // Only the pins file is read on its own.
    expect(storageProvider.singleReads).toEqual([".pins.neno"]);
    expect([...graph.notes.keys()].sort()).toEqual(["a", "b"]);
  });

  it("should fall back to one read per note", async () => {
    const storageProvider = new MockStorageProvider();
    await storageProvider.writeObject("a.subtext", "Note A");
    await storageProvider.writeObject("b.subtext", "Note B");

    const io = new DatabaseIO({ storageProvider });
    const graph = await io.getGraph();

    expect([...graph.notes.keys()].sort()).toEqual(["a", "b"]);
  });
});
