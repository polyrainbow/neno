import assert from 'node:assert';
import test from 'node:test';
import * as Notes from "./index.js";
import MockStorageProvider from './test/MockStorageProvider.js';
import { randomUUID } from 'node:crypto';
import { UserNoteChangeType } from './interfaces/UserNoteChangeType.js';
import {
  NewNoteSaveRequest,
  NoteSaveRequest,
} from './interfaces/NoteSaveRequest.js';



Notes.init(
  new MockStorageProvider(),
  () => randomUUID(),
);

await test("Notes module", async (t) => {
  const TEST_GRAPH_ID = randomUUID();

  await t.test("should create and output notes", async () => {
    const noteSaveRequest1: NewNoteSaveRequest = {
      note: {
        content: "",
        meta: {
          title: "Note 1",
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
    };
    await Notes.put(noteSaveRequest1, TEST_GRAPH_ID);
    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          title: "Note 2",
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
    };
    await Notes.put(noteSaveRequest2, TEST_GRAPH_ID);
    const page = await Notes.getNotesList(TEST_GRAPH_ID, {});
    assert.strictEqual(page.numberOfResults, 2);
  });

  await t.test("should output correct graph stats", async () => {
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

  await t.test("should correctly create links", async () => {
    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          title: "Note 3",
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      changes: [
        {
          type: UserNoteChangeType.LINKED_NOTE_ADDED,
          noteId: 1,
        }
      ],
      ignoreDuplicateTitles: false,
    };
    await Notes.put(noteSaveRequest, TEST_GRAPH_ID);
    const stats = await Notes.getStats(TEST_GRAPH_ID, {
      includeMetadata: false,
      includeAnalysis: false,
    });
    assert.strictEqual(stats.numberOfLinks, 1);
  });

  await t.test("should correctly update key values pairs", async () => {
    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          title: "Note",
          custom: {
            "test": "1",
          },
          flags: [],
          contentType: "",
        },
      },
      changes: [],
      ignoreDuplicateTitles: false,
    };

    const note = await Notes.put(noteSaveRequest, TEST_GRAPH_ID);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          id: note.meta.id,
          title: "Note",
          custom: {
            "test": "12",
          },
          flags: [],
          contentType: "",
        },
      },
      changes: [],
      ignoreDuplicateTitles: false,
    };

    const updatedNote = await Notes.put(noteSaveRequest2, TEST_GRAPH_ID);

    assert.strictEqual(updatedNote.meta.custom.test, "12");
  });
});
