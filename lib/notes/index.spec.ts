import assert from 'node:assert';
import it, { describe } from 'node:test';
import * as Notes from "./index.js";
import NoteFromUser from './interfaces/NoteFromUser';
import MockStorageProvider from './test/MockStorageProvider.js';
import { randomUUID } from 'node:crypto';
import { UserNoteChangeType } from './interfaces/UserNoteChangeType.js';



Notes.init(
  new MockStorageProvider(),
  () => randomUUID(),
);

describe("Notes module", () => {
  const TEST_GRAPH_ID = randomUUID();

  it("should create and output notes", async () => {
    const noteFromUser1: NoteFromUser = {
      content: "",
      title: "Note 1",
    };
    await Notes.put(noteFromUser1, TEST_GRAPH_ID);
    const noteFromUser2: NoteFromUser = {
      content: "",
      title: "Note 2",
    };
    await Notes.put(noteFromUser2, TEST_GRAPH_ID);
    const page = await Notes.getNotesList(TEST_GRAPH_ID, {});
    assert.strictEqual(page.numberOfResults, 2);
  });

  it("should output correct graph stats", async () => {
    const stats = await Notes.getStats(TEST_GRAPH_ID, {
      includeMetadata: true,
      includeAnalysis: false,
    });
    assert.strictEqual(stats.numberOfAllNotes, 2);
    assert.strictEqual(stats.numberOfLinks, 0);
    assert.strictEqual(stats.numberOfFiles, 0);
    assert.strictEqual(stats.numberOfPins, 0);
    assert.strictEqual(stats.numberOfUnlinkedNotes, 2);
  });

  it("should correctly create links", async () => {
    const noteFromUser: NoteFromUser = {
      content: "",
      title: "Note 3",
      changes: [
        {
          type: UserNoteChangeType.LINKED_NOTE_ADDED,
          noteId: 1,
        }
      ]
    };
    await Notes.put(noteFromUser, TEST_GRAPH_ID);
    const stats = await Notes.getStats(TEST_GRAPH_ID, {
      includeMetadata: false,
      includeAnalysis: false,
    });
    assert.strictEqual(stats.numberOfLinks, 1);
  });
});
