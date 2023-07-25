import NotesProvider from "./index.js";
import MockStorageProvider from "./test/MockStorageProvider.js";
import {
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "./interfaces/NoteSaveRequest.js";
// @ts-ignore
import { TextEncoder, TextDecoder } from "util";
// @ts-ignore
Object.assign(global, { TextDecoder, TextEncoder });

const notesProvider = new NotesProvider(new MockStorageProvider());

describe("Notes module", () => {
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
    await notesProvider.put(noteSaveRequest1);
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
    await notesProvider.put(noteSaveRequest2);
    const page = await notesProvider.getNotesList({});
    expect(page.numberOfResults).toBe(2);
  });

  it("should output correct graph stats", async () => {
    const stats = await notesProvider.getStats({
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
    await notesProvider.put(noteSaveRequest);
    const stats = await notesProvider.getStats({
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

    const note = await notesProvider.put(noteSaveRequest);

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

    const updatedNote = await notesProvider.put(noteSaveRequest2);

    expect(updatedNote.meta.custom.test).toBe("12");
  });
});
