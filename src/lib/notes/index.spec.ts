import * as Notes from "./index.js";
import MockStorageProvider from "./test/MockStorageProvider.js";
import {
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "./interfaces/NoteSaveRequest.js";

Notes.init(new MockStorageProvider());

describe("Notes module", () => {
  const TEST_GRAPH_ID = "random";

  it("should create and output notes", async () => {
    const noteSaveRequest1: NewNoteSaveRequest = {
      note: {
        content: "",
        meta: {
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
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
    };
    await Notes.put(noteSaveRequest2, TEST_GRAPH_ID);
    const page = await Notes.getNotesList(TEST_GRAPH_ID, {});
    expect(page.numberOfResults).toBe(2);
  });

  it("should output correct graph stats", async () => {
    const stats = await Notes.getStats(TEST_GRAPH_ID, {
      includeMetadata: true,
      includeAnalysis: false,
    });
    expect(stats.numberOfAllNotes).toBe(2);
    expect(stats.numberOfLinks).toBe(0);
    expect(stats.numberOfFiles).toBe(0);
    expect(stats.numberOfPins).toBe(0);
    expect(stats.numberOfUnlinkedNotes).toBe(2);
  });

  it("should correctly create links", async () => {
    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "Note with a link to [[another existing note]]",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
    };
    await Notes.put(noteSaveRequest, TEST_GRAPH_ID);
    const stats = await Notes.getStats(TEST_GRAPH_ID, {
      includeMetadata: false,
      includeAnalysis: false,
    });
    expect(stats.numberOfLinks).toBe(1);
  });

  it("should correctly update key values pairs", async () => {
    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          custom: {
            "test": "1",
          },
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
    };

    const note = await Notes.put(noteSaveRequest, TEST_GRAPH_ID);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          slug: note.meta.slug,
          custom: {
            "test": "12",
          },
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
    };

    const updatedNote = await Notes.put(noteSaveRequest2, TEST_GRAPH_ID);

    expect(updatedNote.meta.custom.test).toBe("12");
  });
});
