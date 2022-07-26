import assert from 'node:assert';
import it, { describe } from 'node:test';
import * as Notes from "./index.js";
import NoteFromUser from './interfaces/NoteFromUser';
import MockStorageProvider from './test/MockStorageProvider.js';

const TEST_GRAPH_ID = "graph";

Notes.init(
  new MockStorageProvider(),
  () => Math.floor(Math.random() * 10e10).toString()
);

describe("Notes module", () => {
  it("should create and output notes", async () => {
    const noteFromUser1: NoteFromUser = {
      blocks: [],
      title: "Note 1",
    };
    await Notes.put(noteFromUser1, TEST_GRAPH_ID);
    const noteFromUser2: NoteFromUser = {
      blocks: [],
      title: "Note 2",
    };
    await Notes.put(noteFromUser2, TEST_GRAPH_ID);
    const page = await Notes.getNotesList(TEST_GRAPH_ID, {});
    assert.strictEqual(page.numberOfResults, 2);
  });

  it("should output correct graph stats", async () => {
    const stats = await Notes.getStats(TEST_GRAPH_ID, {
      includeMetadata: true,
      includeAnalysis: true,
    });
    assert.strictEqual(stats.numberOfAllNotes, 2);
    assert.strictEqual(stats.numberOfLinks, 0);
    assert.strictEqual(stats.numberOfFiles, 0);
    assert.strictEqual(stats.numberOfPins, 0);
    assert.strictEqual(stats.numberOfUnlinkedNotes, 2);
  });
});
