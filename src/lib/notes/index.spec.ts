import NotesProvider from "./index.js";
import MockStorageProvider from "./test/MockStorageProvider.js";
import {
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "./types/NoteSaveRequest.js";
import subwaytext from "../subwaytext/index.js";
// @ts-ignore
import { TextEncoder, TextDecoder } from "util";
import { Block } from "../subwaytext/types/Block.js";
// @ts-ignore
Object.assign(global, { TextDecoder, TextEncoder });

jest.mock("../../constants", () => {
  return {
    BASE_URL: "/",
  };
});

// @ts-ignore
globalThis.navigator = {
  hardwareConcurrency: 4,
};

interface EventData {
  action: string,
  notes: {
    id: string,
    content: string,
  }[],
}

type Callback = (
  response: {
    data: {
      id: string,
      parsedContent: Block[],
    }[],
  }
) => void;

class subwaytextWorkerMock {
  _callback: Callback | undefined;

  postMessage(eventData: EventData) {
    if (eventData.action === "PARSE_NOTES") {
      const notes = eventData.notes;

      if (!Array.isArray(notes)) {
        throw new Error(
          "Subwaytext worker: Expected an array of notes, received "
          + typeof notes
          + " instead.",
        );
      }

      const notesParsed = notes
        .map((note) => {
          return {
            id: note.id,
            parsedContent: subwaytext(note.content),
          };
        });

      this._callback?.({
        data: notesParsed,
      });
    }
  }

  set onmessage(
    callback: Callback,
  ) {
    this._callback = callback;
  }
}

// @ts-ignore
globalThis.Worker = subwaytextWorkerMock;

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
      aliases: new Set(),
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
      aliases: new Set(),
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
      aliases: new Set(),
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
      aliases: new Set(),
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
        aliases: new Set(),
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
        aliases: new Set(),
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
        aliases: new Set(),
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
      aliases: new Set(),
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
      aliases: new Set(),
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
      aliases: new Set(),
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
      aliases: new Set(),
    };

    const note2 = await notesProvider.put(noteSaveRequest2);

    expect(note2.backlinks.length).toBe(1);
    expect(note2.backlinks[0].slug).toBe("note-1");
  });

  it("should update existing slugs", async () => {
    const notesProvider = new NotesProvider(new MockStorageProvider());

    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "Note 1",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "note-1",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "Note 1 with new slug",
        meta: {
          slug: "note-1",
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "note-1a",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest2);

    const notes = await notesProvider.getNotesList({});

    expect(notes.numberOfResults).toBe(1);
    expect(notes.results[0].slug).toBe("note-1a");
  });

  it(
    "should correctly output number of links when link is in heading",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const noteSaveRequest1: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "note-1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest1);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "# Heading with a link to [[Note 1]]",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        aliases: new Set(),
      };
      const noteFromProvider = await notesProvider.put(noteSaveRequest2);

      expect(noteFromProvider.outgoingLinks.length).toBe(1);
      expect(noteFromProvider.outgoingLinks[0].slug).toBe("note-1");
    },
  );

  it(
    "should correctly output number of links when link is in quote",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const noteSaveRequest1: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "note-1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest1);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "> Quote with a link to [[Note 1]]",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        aliases: new Set(),
      };
      const noteFromProvider = await notesProvider.put(noteSaveRequest2);

      expect(noteFromProvider.outgoingLinks.length).toBe(1);
      expect(noteFromProvider.outgoingLinks[0].slug).toBe("note-1");
    },
  );

  it("should update existing slugs with references", async () => {
    const mockStorageProvider = new MockStorageProvider();
    const notesProvider = new NotesProvider(mockStorageProvider);

    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "Note 1 with a reference to itself: [[Note 1]]",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "note-1",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "Note 2 with a wikilink to Note 1: [[Note 1]]",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "note-2",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest2);

    const noteSaveRequest3: NoteSaveRequest = {
      note: {
        content: "Note 3 with a slashlink to Note 1: /note-1\n# [[Note 1]]",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "note-3",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest3);

    // updating slug of note-1
    const noteSaveRequest1a: NoteSaveRequest = {
      note: {
        content: "Note 1 with a reference to itself: [[Note 1]]",
        meta: {
          slug: "note-1",
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "note-1a",
      updateReferences: true,
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest1a);

    const note1 = await notesProvider.get("note-1a");
    const note2 = await notesProvider.get("note-2");
    const note3 = await notesProvider.get("note-3");

    expect(note1.meta.slug).toBe("note-1a");
    expect(note1.backlinks.length).toBe(2);
    expect(note1.outgoingLinks.length).toBe(0);

    expect(note2.content).toBe("Note 2 with a wikilink to Note 1: [[note-1a]]");
    expect(note2.outgoingLinks.length).toBe(1);

    expect(note3.content).toBe(
      "Note 3 with a slashlink to Note 1: /note-1a\n# [[note-1a]]",
    );
    expect(note3.outgoingLinks.length).toBe(1);
  });


  it("should update backlinks after renaming notes", async () => {
    const mockStorageProvider = new MockStorageProvider();
    const notesProvider = new NotesProvider(mockStorageProvider);

    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "[[n1]]",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "n2",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest);

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
      changeSlugTo: "n1",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest2);

    // rename n1 to n1a
    const noteSaveRequest3: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          slug: "n1",
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "n1a",
      updateReferences: false,
      aliases: new Set(),
    };

    const n1a = await notesProvider.put(noteSaveRequest3);

    expect(n1a.backlinks.length).toBe(0);

    // rename n1a to n1
    const noteSaveRequest4: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          slug: "n1a",
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "n1",
      updateReferences: false,
      aliases: new Set(),
    };

    const n1 = await notesProvider.put(noteSaveRequest4);

    expect(n1.backlinks.length).toBe(1);
  });


  it("should update backlinks after note removal", async () => {
    const mockStorageProvider = new MockStorageProvider();
    const notesProvider = new NotesProvider(mockStorageProvider);

    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "n1",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "[[n1]]",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "n2",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest2);
    await notesProvider.remove("n2");
    const n1 = await notesProvider.get("n1");
    expect(n1.backlinks.length).toBe(0);
  });


  it(
    "should add files and return file info",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const readable = new ReadableStream({
        async pull(controller) {
          const strToUTF8 = (str: string) => {
            const encoder = new TextEncoder();
            return encoder.encode(str);
          };
          controller.enqueue(strToUTF8("foobar"));
          controller.close();
        },
      });

      const fileInfo = await notesProvider.addFile(
        readable,
        "test.txt",
      );

      expect(fileInfo.slug).toBe("files/test.txt");
      expect(fileInfo.size).toBe(6);
    },
  );

  it(
    "should sluggify filenames correctly",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const readable = new ReadableStream({
        async pull(controller) {
          const strToUTF8 = (str: string) => {
            const encoder = new TextEncoder();
            return encoder.encode(str);
          };
          controller.enqueue(strToUTF8("foobar"));
          controller.close();
        },
      });

      const fileInfo = await notesProvider.addFile(
        readable,
        "test.test.test+.txt",
      );

      expect(fileInfo.slug).toBe("files/test-test-test.txt");
    },
  );

  it(
    "should sluggify dotfiles correctly",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const readable = new ReadableStream({
        async pull(controller) {
          const strToUTF8 = (str: string) => {
            const encoder = new TextEncoder();
            return encoder.encode(str);
          };
          controller.enqueue(strToUTF8("foobar"));
          controller.close();
        },
      });

      const fileInfo = await notesProvider.addFile(
        readable,
        ".graph.json",
      );

      expect(fileInfo.slug).toBe("files/graph.json");

      const readable2 = new ReadableStream({
        async pull(controller) {
          const strToUTF8 = (str: string) => {
            const encoder = new TextEncoder();
            return encoder.encode(str);
          };
          controller.enqueue(strToUTF8("foobar"));
          controller.close();
        },
      });

      const fileInfo2 = await notesProvider.addFile(
        readable2,
        ".htaccess",
      );

      expect(fileInfo2.slug).toBe("files/htaccess");
    },
  );

  it(
    "should sluggify filenames correctly when slug already exists",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const readable1 = new ReadableStream({
        async pull(controller) {
          const strToUTF8 = (str: string) => {
            const encoder = new TextEncoder();
            return encoder.encode(str);
          };
          controller.enqueue(strToUTF8("foobar"));
          controller.close();
        },
      });

      await notesProvider.addFile(
        readable1,
        "test.txt",
      );

      const readable2 = new ReadableStream({
        async pull(controller) {
          const strToUTF8 = (str: string) => {
            const encoder = new TextEncoder();
            return encoder.encode(str);
          };
          controller.enqueue(strToUTF8("foobar"));
          controller.close();
        },
      });

      const fileInfo2 = await notesProvider.addFile(
        readable2,
        "test.txt",
      );

      expect(fileInfo2.slug).toBe("files/test-2.txt");

      const readable3 = new ReadableStream({
        async pull(controller) {
          const strToUTF8 = (str: string) => {
            const encoder = new TextEncoder();
            return encoder.encode(str);
          };
          controller.enqueue(strToUTF8("foobar"));
          controller.close();
        },
      });

      const fileInfo3 = await notesProvider.addFile(
        readable3,
        "test.txt",
      );

      expect(fileInfo3.slug).toBe("files/test-3.txt");
    },
  );

  it(
    "should sluggify umlauts with combining diacritical marks correctly",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const readable1 = new ReadableStream({
        async pull(controller) {
          const strToUTF8 = (str: string) => {
            const encoder = new TextEncoder();
            return encoder.encode(str);
          };
          controller.enqueue(strToUTF8("foobar"));
          controller.close();
        },
      });

      const fileInfo = await notesProvider.addFile(
        readable1,
        "ö.txt", // <-- ö with combining diacritical mark
      );

      expect(fileInfo.slug).toBe("files/ö.txt");
    },
  );

  it(
    "should remove files correctly",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const readable = new ReadableStream({
        async pull(controller) {
          const strToUTF8 = (str: string) => {
            const encoder = new TextEncoder();
            return encoder.encode(str);
          };
          controller.enqueue(strToUTF8("foobar"));
          controller.close();
        },
      });

      const fileInfo = await notesProvider.addFile(
        readable,
        "test.txt",
      );

      await notesProvider.deleteFile(fileInfo.slug);
      const files = await notesProvider.getFiles();

      expect(files.length).toBe(0);
    },
  );

  it(
    "should correctly retrieve files",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const readable = new ReadableStream({
        async pull(controller) {
          const strToUTF8 = (str: string) => {
            const encoder = new TextEncoder();
            return encoder.encode(str);
          };
          controller.enqueue(strToUTF8("foobar"));
          controller.close();
        },
      });

      const fileInfo = await notesProvider.addFile(
        readable,
        "test.txt",
      );

      const readableFromProvider
        = await notesProvider.getReadableFileStream(fileInfo.slug);

      const utf8ToString = (bytes: Uint8Array) => {
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
      };

      const reader = readableFromProvider.getReader();
      const result = await reader.read();
      const content = utf8ToString(result.value);

      expect(content).toBe("foobar");
    },
  );


  it("should correctly show actual links in stats", async () => {
    const notesProvider = new NotesProvider(new MockStorageProvider());

    const noteSaveRequest1: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      changeSlugTo: "another-existing-note",
      aliases: new Set(),
    };
    await notesProvider.put(noteSaveRequest1);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "Note with a link to [[another existing note]]",
        meta: {
          custom: {},
          flags: [],
          contentType: "",
        },
      },
      ignoreDuplicateTitles: false,
      aliases: new Set(),
    };
    await notesProvider.put(noteSaveRequest2);

    const stats = await notesProvider.getStats({
      includeMetadata: false,
      includeAnalysis: false,
    });
    expect(stats.numberOfLinks).toBe(1);
  });


  it(
    "should not consider links to non-existent notes in stats",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: `A note with several links to non-existent notes
          [[foo]] [[bar]] /baz`,
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "n2",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest);

      const stats = await notesProvider.getStats({
        includeAnalysis: false,
        includeMetadata: false,
      });

      expect(stats.numberOfLinks).toBe(0);
    },
  );

  it(
    "should recognize notes created via another tool",
    async () => {
      const storageProvider = new MockStorageProvider();
      await storageProvider.writeObject("note.subtext", "Test note");
      const notesProvider = new NotesProvider(storageProvider);

      const notes = await notesProvider.getNotesList({});

      expect(notes.numberOfResults).toBe(1);
      expect(notes.results[0].slug).toBe("note");
    },
  );

  it(
    "should create graph metadata file if missing",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      await notesProvider.getNotesList({});

      const graphFile = await storageProvider.readObjectAsString(".graph.json");
      const graph = JSON.parse(graphFile);

      expect(graph.version).toBe("4");
    },
  );

  it(
    "should update pinned note on slug update",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "A note that will be pinned",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest);

      await notesProvider.pin("n1");

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "A note that will be pinned",
          meta: {
            slug: "n1",
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "n2",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest2);

      const pinnedNotes = await notesProvider.getPins();

      expect(pinnedNotes.length).toBe(1);
      expect(pinnedNotes[0].meta.slug).toBe("n2");
    },
  );

  it(
    // eslint-disable-next-line @stylistic/max-len
    "should show all backlinks of a newly created note, including those from notes created in previous sessions",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note with link to [[Foo Bar]]",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest);

      // Let's create a second notes provider to simulate a new session
      const notesProvider2 = new NotesProvider(storageProvider);

      expect(notesProvider2.get("n1")).resolves.toBeDefined();
      expect(
        (await notesProvider2.getNotesList({})).numberOfResults,
      ).toBe(1);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2 with link to [[Foo Bar]]",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "n2",
        aliases: new Set(),
      };

      await notesProvider2.put(noteSaveRequest2);

      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "Foo Bar",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        aliases: new Set(),
      };

      const note3 = await notesProvider2.put(noteSaveRequest3);

      expect(note3.backlinks.length).toBe(2);
    },
  );

  it(
    "should not update the timestamp in graph metadata on a note update",
    async () => {
      function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      await notesProvider.getNotesList({});

      const graphFileCheck1
        = await storageProvider.readObjectAsString(".graph.json");
      const graphCheck1 = JSON.parse(graphFileCheck1);
      const graphMetadataUpdateTimeCheck1 = graphCheck1.updatedAt;

      await sleep(100);

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest);

      const graphFileCheck2
        = await storageProvider.readObjectAsString(".graph.json");
      const graphCheck2 = JSON.parse(graphFileCheck2);
      const graphMetadataUpdateTimeCheck2 = graphCheck2.updatedAt;

      expect(graphMetadataUpdateTimeCheck2).toBe(graphMetadataUpdateTimeCheck1);
    },
  );


  it(
    "should update the timestamp in graph metadata on pin update",
    async () => {
      function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      await notesProvider.getNotesList({});

      const graphFileCheck1
        = await storageProvider.readObjectAsString(".graph.json");
      const graphCheck1 = JSON.parse(graphFileCheck1);
      const graphMetadataUpdateTimeCheck1 = graphCheck1.updatedAt;

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest);
      await sleep(100);
      await notesProvider.pin("n1");

      const graphFileCheck2
        = await storageProvider.readObjectAsString(".graph.json");
      const graphCheck2 = JSON.parse(graphFileCheck2);
      const graphMetadataUpdateTimeCheck2 = graphCheck2.updatedAt;

      expect(graphMetadataUpdateTimeCheck2)
        .toBeGreaterThan(graphMetadataUpdateTimeCheck1);
    },
  );

  it(
    "should correctly unpin a specific slug",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest1: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest1);
      await notesProvider.pin("n1");

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
        changeSlugTo: "n2",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest2);
      await notesProvider.pin("n2");

      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "Note 3",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "n3",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest3);
      await notesProvider.pin("n3");

      await notesProvider.unpin("n2");

      const pins = await notesProvider.getPins();
      const pinSlugs = pins.map((pin) => pin.meta.slug);

      expect(pinSlugs).toEqual(["n1", "n3"]);
    },
  );

  /*
    ALIASES
  */

  it(
    "should parse alias files correctly",
    async () => {
      const storageProvider = new MockStorageProvider();
      await storageProvider.writeObject("note.subtext", "Test note");
      await storageProvider.writeObject("note-alias.subtext", ":alias-of:note");
      const notesProvider = new NotesProvider(storageProvider);

      const notes = await notesProvider.getNotesList({});

      expect(notes.numberOfResults).toBe(1);
      expect(notes.results[0].slug).toBe("note");
      const aliases = notes.results[0].aliases;
      expect(aliases.size).toBe(1);
      expect(aliases.has("note-alias")).toBe(true);
    },
  );

  it(
    "should delete aliases from disk on note removal",
    async () => {
      const storageProvider = new MockStorageProvider();
      await storageProvider.writeObject("note.subtext", "Test note");
      await storageProvider.writeObject(
        "note-alias-1.subtext",
        ":alias-of:note",
      );
      await storageProvider.writeObject(
        "note-alias-2.subtext",
        ":alias-of:note",
      );
      const notesProvider = new NotesProvider(storageProvider);

      await notesProvider.remove("note");

      await expect(storageProvider.readObjectAsString("note-alias-1.subtext"))
        .rejects.toThrow("File not found.");
      await expect(storageProvider.readObjectAsString("note-alias-2.subtext"))
        .rejects.toThrow("File not found.");
    },
  );

  it(
    "should delete aliases from disk on alias removal",
    async () => {
      const storageProvider = new MockStorageProvider();
      await storageProvider.writeObject("note.subtext", "Test note");
      await storageProvider.writeObject("note-alias.subtext", ":alias-of:note");
      const notesProvider = new NotesProvider(storageProvider);

      const putRequest: NoteSaveRequest = {
        ignoreDuplicateTitles: false,
        aliases: new Set([]),
        note: {
          content: "Test note",
          meta: {
            slug: "note",
            custom: {},
            flags: [],
            contentType: "",
          },
        },
      };

      const noteFromServer = await notesProvider.put(putRequest);

      expect(noteFromServer.aliases.size).toBe(0);
      await expect(storageProvider.readObjectAsString("note-alias.subtext"))
        .rejects.toThrow("File not found.");
    },
  );

  it(
    "should correctly create aliases",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        aliases: new Set(["note-alias"]),
      };

      await notesProvider.put(noteSaveRequest);

      const notes = await notesProvider.getNotesList({});

      expect(notes.numberOfResults).toBe(1);
      const aliases = notes.results[0].aliases;
      expect(aliases.size).toBe(1);
      expect(aliases.has("note-alias")).toBe(true);
    },
  );


  it(
    "should disallow empty aliases on new notes",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        aliases: new Set([""]),
      };

      await expect(notesProvider.put(noteSaveRequest)).rejects
        .toThrow("INVALID_ALIAS");
    },
  );


  it(
    "should disallow empty aliases on existing notes",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        aliases: new Set(),
        changeSlugTo: "note-1",
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            slug: "note-1",
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        aliases: new Set([""]),
      };

      await expect(notesProvider.put(noteSaveRequest2)).rejects
        .toThrow("INVALID_ALIAS");
    },
  );

  it(
    "should correctly create aliases for new note when "
    + "canonical slug is defined manually",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "a",
        aliases: new Set(["b", "c"]),
      };

      await notesProvider.put(noteSaveRequest);

      const notes = await notesProvider.getNotesList({});

      expect(notes.numberOfResults).toBe(1);
      const aliases = notes.results[0].aliases;
      expect(aliases.size).toBe(2);
      expect(aliases.has("b")).toBe(true);
      expect(aliases.has("c")).toBe(true);
    },
  );

  it(
    "backlinks of a note should include notes that link to aliases of the note",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());
      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1 with an alias.",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "note-1",
        aliases: new Set(["alias"]),
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2 with a link to the [[alias]].",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "note-2",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest2);

      const note1 = await notesProvider.get("note-1");

      expect(note1.backlinks.length).toBe(1);
      expect(note1.backlinks[0].slug).toBe("note-2");
    },
  );

  it(
    "should create backlinks for aliases on initial index generation",
    async () => {
      const storageProvider = new MockStorageProvider();
      await storageProvider.writeObject("note.subtext", "Test note");
      await storageProvider.writeObject("note-alias.subtext", ":alias-of:note");
      await storageProvider.writeObject("note-2.subtext", "[[note-alias]]");
      const notesProvider = new NotesProvider(storageProvider);

      const noteFromServer = await notesProvider.get("note");

      expect(noteFromServer.backlinks.length).toBe(1);
      expect(noteFromServer.backlinks[0].slug).toBe("note-2");
    },
  );

  it(
    "note's outgoing links should include aliases",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());
      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1 with an alias.",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "note-1",
        aliases: new Set(["alias"]),
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2 with a link to the [[alias]].",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "note-2",
        aliases: new Set(),
      };

      const note2 = await notesProvider.put(noteSaveRequest2);
      expect(note2.outgoingLinks.length).toBe(1);
      expect(note2.outgoingLinks[0].slug).toBe("note-1");
    },
  );

  it(
    "after creating a note with an alias, "
    + "backlinks should include links to the alias",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());
      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "link to [[y]]",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "z",
        aliases: new Set([]),
      };

      await notesProvider.put(noteSaveRequest);

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
        changeSlugTo: "x",
        aliases: new Set(["y"]),
      };

      const note2 = await notesProvider.put(noteSaveRequest2);
      expect(note2.backlinks.length).toBe(1);
      expect(note2.backlinks[0].slug).toBe("z");
    },
  );

  it(
    "adding an alias to an existing note should update backlinks",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());
      // create y with a link to alias
      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "link to [[alias]]",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "y",
        aliases: new Set([]),
      };

      await notesProvider.put(noteSaveRequest);

      // create x
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
        changeSlugTo: "x",
        aliases: new Set([]),
      };

      await notesProvider.put(noteSaveRequest2);

      // add alias to x
      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            slug: "x",
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        aliases: new Set(["alias"]),
      };

      const x = await notesProvider.put(noteSaveRequest3);
      expect(x.backlinks.length).toBe(1);
      expect(x.backlinks[0].slug).toBe("y");
    },
  );

  it(
    "stats links should include links to aliases",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());
      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "x",
        aliases: new Set(["y"]),
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "link to [[y]]",
          meta: {
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        ignoreDuplicateTitles: false,
        changeSlugTo: "z",
        aliases: new Set([]),
      };

      await notesProvider.put(noteSaveRequest2);

      const stats = await notesProvider.getStats({
        includeAnalysis: false,
        includeMetadata: false,
      });

      expect(stats.numberOfLinks).toBe(1);
    },
  );
});
