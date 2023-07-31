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

jest.mock("../../constants", () => {
  return {
    BASE_URL: "/",
  };
});

describe("Notes module", () => {
  it("should create and output notes", async () => {
    const notesProvider = new NotesProvider(new MockStorageProvider());

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
    const notesProvider = new NotesProvider(new MockStorageProvider());

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

  it("should correctly output number of links", async () => {
    const notesProvider = new NotesProvider(new MockStorageProvider());

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


  it(
    "search result only consider links to really existing notes",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: `Note with a links to some non-existing notes and one
          existing note and to itself.
          [[1]] [[2]] [[3]] [[4]] [[5]] [[6]]
          /7 /8 /9 /10 /test
          `,
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "1",
      };
      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "2",
      };
      await notesProvider.put(noteSaveRequest2);

      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "Note 3 with link to [[1]]",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "test",
      };
      await notesProvider.put(noteSaveRequest3);

      const list = await notesProvider.getNotesList({});

      const result = list.results.find((note) => note.slug === "1");

      expect(result?.linkCount).toStrictEqual({
        outgoing: 2,
        back: 1,
        sum: 3,
      });
    },
  );

  it("should correctly update key-value pairs", async () => {
    const notesProvider = new NotesProvider(new MockStorageProvider());

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

  it("should show correct backlinks for new created notes", async () => {
    const notesProvider = new NotesProvider(new MockStorageProvider());

    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "Note 1 with a link to [[Note 2]] that does not exist yet.",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "note-1",
    };

    await notesProvider.put(noteSaveRequest);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "This is Note 2",
        meta: {
          custom: {
            "test": "12",
          },
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "note-2",
    };

    const note2 = await notesProvider.put(noteSaveRequest2);

    expect(note2.backlinks.length).toBe(1);
    expect(note2.backlinks[0].slug).toBe("note-1");
  });
});
