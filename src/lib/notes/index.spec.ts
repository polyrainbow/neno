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
import { describe, it, expect, vi } from "vitest";
import { getCompareKeyForTimestamp } from "./utils.js";
import { ErrorMessage } from "./types/ErrorMessage.js";

vi.stubGlobal("navigator", {
  hardwareConcurrency: 4,
});

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
    const mockStorageProvider = new MockStorageProvider();
    const notesProvider = new NotesProvider(mockStorageProvider);

    const noteSaveRequest1: NewNoteSaveRequest = {
      note: {
        content: "",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
      aliases: new Set(),
    };
    await notesProvider.put(noteSaveRequest1);
    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
      aliases: new Set(),
    };
    await notesProvider.put(noteSaveRequest2);
    const page = await notesProvider.getNotesList({});
    expect(page.numberOfResults).toBe(2);

    const note1FromStorageProvider = await mockStorageProvider
      .readObjectAsString(
        "new-1.subtext",
      );

    expect(typeof note1FromStorageProvider).toBe("string");

    const note2FromStorageProvider = await mockStorageProvider
      .readObjectAsString(
        "new-2.subtext",
      );

    expect(typeof note2FromStorageProvider).toBe("string");
  });

  it("should output correct graph stats", async () => {
    const notesProvider = new NotesProvider(new MockStorageProvider());

    const noteSaveRequest1: NewNoteSaveRequest = {
      note: {
        content: "",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
      aliases: new Set(),
    };
    await notesProvider.put(noteSaveRequest1);
    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
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
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "1",
        aliases: new Set(),
      };
      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "2",
        aliases: new Set(),
      };
      await notesProvider.put(noteSaveRequest2);

      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "Note 3 with link to [[1]]",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
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

  it("should correctly update additional headers", async () => {
    const mockStorageProvider = new MockStorageProvider();
    const notesProvider = new NotesProvider(mockStorageProvider);

    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          additionalHeaders: {
            "test": "1",
          },
          flags: [],
        },
      },
      aliases: new Set(),
    };

    const note = await notesProvider.put(noteSaveRequest);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          slug: note.meta.slug,
          additionalHeaders: {
            "test": "12",
          },
          flags: [],
        },
      },
      aliases: new Set(),
    };

    const updatedNote = await notesProvider.put(noteSaveRequest2);

    expect(updatedNote.meta.additionalHeaders.test).toBe("12");

    const noteFromStorageProvider = await mockStorageProvider
      .readObjectAsString(
        `${note.meta.slug}.subtext`,
      );

    expect(noteFromStorageProvider.includes("\n:test:12\n")).toBe(true);
  });

  it("should show correct backlinks for new created notes", async () => {
    const notesProvider = new NotesProvider(new MockStorageProvider());

    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "Note 1 with a link to [[Note 2]] that does not exist yet.",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
      changeSlugTo: "note-1",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "This is Note 2",
        meta: {
          additionalHeaders: {
            "test": "12",
          },
          flags: [],
        },
      },
      changeSlugTo: "note-2",
      aliases: new Set(),
    };

    const note2 = await notesProvider.put(noteSaveRequest2);

    expect(note2.backlinks.length).toBe(1);
    expect(note2.backlinks[0].slug).toBe("note-1");
  });

  it("should update existing slugs", async () => {
    const mockStorageProvider = new MockStorageProvider();
    const notesProvider = new NotesProvider(mockStorageProvider);

    const noteSaveRequest: NoteSaveRequest = {
      note: {
        content: "Note 1",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
      changeSlugTo: "note-1",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "Note 1 with new slug",
        meta: {
          slug: "note-1",
          additionalHeaders: {},
          flags: [],
        },
      },
      changeSlugTo: "note-1a",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest2);

    const notes = await notesProvider.getNotesList({});

    expect(notes.numberOfResults).toBe(1);
    expect(notes.results[0].slug).toBe("note-1a");

    expect(
      mockStorageProvider.readObjectAsString("note-1.subtext"),
    ).rejects.toThrow();

    const noteFromStorageProvider = await mockStorageProvider
      .readObjectAsString(
        "note-1a.subtext",
      );

    expect(typeof noteFromStorageProvider).toBe("string");
  });

  it(
    "should correctly output number of links when link is in heading",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const noteSaveRequest1: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "note-1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest1);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "# Heading with a link to [[Note 1]]",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "note-1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest1);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "> Quote with a link to [[Note 1]]",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
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
          additionalHeaders: {},
          flags: [],
        },
      },
      changeSlugTo: "note-1",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "Note 2 with a wikilink to Note 1: [[Note 1]]",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
      changeSlugTo: "note-2",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest2);

    const noteSaveRequest3: NoteSaveRequest = {
      note: {
        content: "Note 3 with a slashlink to Note 1: /note-1\n# [[Note 1]]",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
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
          additionalHeaders: {},
          flags: [],
        },
      },
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
          additionalHeaders: {},
          flags: [],
        },
      },
      changeSlugTo: "n2",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
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
          additionalHeaders: {},
          flags: [],
        },
      },
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
          additionalHeaders: {},
          flags: [],
        },
      },
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
          additionalHeaders: {},
          flags: [],
        },
      },
      changeSlugTo: "n1",
      aliases: new Set(),
    };

    await notesProvider.put(noteSaveRequest);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "[[n1]]",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
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
        "files",
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
        "files",
        "test.test.test+.txt",
      );

      expect(fileInfo.slug).toBe("files/test.test.test.txt");
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
        "files",
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
        "files",
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
        "files",
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
        "files",
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
        "files",
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
        "files",
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
        "files",
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
        "files",
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
          additionalHeaders: {},
          flags: [],
        },
      },
      changeSlugTo: "another-existing-note",
      aliases: new Set(),
    };
    await notesProvider.put(noteSaveRequest1);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "Note with a link to [[another existing note]]",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
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
            additionalHeaders: {},
            flags: [],
          },
        },
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
    "should recognize notes created with another app",
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

      expect(graph.version).toBe("5");
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
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n2",
        aliases: new Set(),
      };

      await notesProvider2.put(noteSaveRequest2);

      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "Foo Bar",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest);
      await sleep(2000);
      await notesProvider.pin("n1");

      const graphFileCheck2
        = await storageProvider.readObjectAsString(".graph.json");
      const graphCheck2 = JSON.parse(graphFileCheck2);
      const graphMetadataUpdateTimeCheck2 = graphCheck2.updatedAt;

      expect(getCompareKeyForTimestamp(graphMetadataUpdateTimeCheck2))
        .toBeGreaterThan(
          getCompareKeyForTimestamp(graphMetadataUpdateTimeCheck1),
        );
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
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest1);
      await notesProvider.pin("n1");

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n2",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest2);
      await notesProvider.pin("n2");

      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "Note 3",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
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

  it(
    "should correctly decrease pin position",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest1: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest1);
      await notesProvider.pin("n1");

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n2",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest2);
      await notesProvider.pin("n2");

      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "Note 3",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n3",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest3);
      await notesProvider.pin("n3");

      await notesProvider.movePinPosition("n3", -1);

      const pins = await notesProvider.getPins();
      const pinSlugs = pins.map((pin) => pin.meta.slug);

      expect(pinSlugs).toEqual(["n1", "n3", "n2"]);
    },
  );


  it(
    "should correctly increase pin position",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest1: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest1);
      await notesProvider.pin("n1");

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n2",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest2);
      await notesProvider.pin("n2");

      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "Note 3",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n3",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest3);
      await notesProvider.pin("n3");

      await notesProvider.movePinPosition("n1", 2);

      const pins = await notesProvider.getPins();
      const pinSlugs = pins.map((pin) => pin.meta.slug);

      expect(pinSlugs).toEqual(["n2", "n3", "n1"]);
    },
  );


  it(
    "should not adjust pin positions when moving with offset=0",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest1: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest1);
      await notesProvider.pin("n1");

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n2",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest2);
      await notesProvider.pin("n2");

      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "Note 3",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n3",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest3);
      await notesProvider.pin("n3");

      await notesProvider.movePinPosition("n1", 0);
      await notesProvider.movePinPosition("n2", 0);
      await notesProvider.movePinPosition("n3", 0);

      const pins = await notesProvider.getPins();
      const pinSlugs = pins.map((pin) => pin.meta.slug);

      expect(pinSlugs).toEqual(["n1", "n2", "n3"]);
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
        aliases: new Set([]),
        note: {
          content: "Test note",
          meta: {
            slug: "note",
            additionalHeaders: {},
            flags: [],
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
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
        aliases: new Set(),
        changeSlugTo: "note-1",
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            slug: "note-1",
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "note-1",
        aliases: new Set(["alias"]),
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2 with a link to the [[alias]].",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "note-1",
        aliases: new Set(["alias"]),
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2 with a link to the [[alias]].",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "z",
        aliases: new Set([]),
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "y",
        aliases: new Set([]),
      };

      await notesProvider.put(noteSaveRequest);

      // create x
      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
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
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "x",
        aliases: new Set(["y"]),
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "link to [[y]]",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
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


  it(
    "should find note when searching for alias",
    async () => {
      const storageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(storageProvider);

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "a",
        aliases: new Set(["alias"]),
      };

      await notesProvider.put(noteSaveRequest);

      const notes = await notesProvider.getNotesList({
        searchString: "alias",
      });

      expect(notes.numberOfResults).toBe(1);
      expect(notes.results[0].slug).toBe("a");
    },
  );


  it(
    "should find file after rename",
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
        "files",
        "a.txt",
      );

      expect(fileInfo.slug).toBe("files/a.txt");

      const fileInfoUpdated = await notesProvider.renameFile(
        "files/a.txt",
        "files/a-renamed.txt",
        false,
      );

      expect(fileInfoUpdated.slug).toBe("files/a-renamed.txt");

      const readable2 = await notesProvider.getReadableFileStream(
        "files/a-renamed.txt",
      );

      expect(readable2 instanceof ReadableStream).toBe(true);
    },
  );

  it(
    "should update file references when renaming",
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
        "files",
        "a.txt",
      );

      expect(fileInfo.slug).toBe("files/a.txt");

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1 with slashlink to /files/a.txt",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        aliases: new Set(),
        changeSlugTo: "note-1",
      };

      await notesProvider.put(noteSaveRequest);

      /*
      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Note 2 with wikilink to [[files/a.txt]]",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        aliases: new Set(),
        changeSlugTo: "note-2",
      };

      await notesProvider.put(noteSaveRequest2);
      */

      const fileInfoUpdated = await notesProvider.renameFile(
        "files/a.txt",
        "files/a-renamed.txt",
        true,
      );

      expect(fileInfoUpdated.slug).toBe("files/a-renamed.txt");

      const note1 = await notesProvider.get("note-1");
      expect(note1.content).toBe(
        "Note 1 with slashlink to /files/a-renamed.txt",
      );

      expect(note1.files.length).toBe(1);
      expect(note1.files[0].slug).toBe("files/a-renamed.txt");

      // It is currently not possible that files are referenced via Wikilinks
      // because Wikilink-to-slug normalization normalizes the slashes to
      // dashes.
      /*
      const note2 = await notesProvider.get("note-2");
      expect(note2.content).toBe(
        "Note 2 with wikilink to [[files/a-renamed.txt]]",
      );

      expect(note2.files.length).toBe(1);
      expect(note2.files[0].slug).toBe("files/a-renamed.txt");
      */
    },
  );


  it(
    "should update file references when renaming file, data loaded from disk",
    async () => {
      const mockStorageProvider = new MockStorageProvider();

      await mockStorageProvider.writeObject(
        "note-1.subtext",
        "Note 1 with slashlink to /files/a.txt",
      );

      await mockStorageProvider.writeObject(
        "files/a.txt",
        "Some text",
      );

      await mockStorageProvider.writeObject(
        ".graph.json",
        `{
          "files": [
            {
              "slug": "files/a.txt",
              "size": 5,
              "createdAt": 1234
            }
          ]
        }`,
      );

      const notesProvider = new NotesProvider(mockStorageProvider);

      await notesProvider.renameFile(
        "files/a.txt",
        "files/a-renamed.txt",
        true,
      );

      const note1 = await notesProvider.get("note-1");
      expect(note1.content).toBe(
        "Note 1 with slashlink to /files/a-renamed.txt",
      );

      expect(note1.files.length).toBe(1);
      expect(note1.files[0].slug).toBe("files/a-renamed.txt");
    },
  );

  it(
    "existing metadata file should not be overwritten on startup",
    async () => {
      const mockStorageProvider = new MockStorageProvider();

      await mockStorageProvider.writeObject(
        ".graph.json",
        `{
          "files": []
        }`,
      );

      mockStorageProvider.clearJournal();

      const notesProvider = new NotesProvider(mockStorageProvider);
      await notesProvider.getNotesList({});
      const metadataFileWrites = mockStorageProvider.journal
        .filter((entry) => {
          return entry.type === "WRITE"
            && entry.requestPath === ".graph.json";
        });

      expect(metadataFileWrites.length).toBe(0);
    },
  );


  it(
    "backlinks of note should include notes that links to slug in KV value",
    async () => {
      const notesProvider = new NotesProvider(new MockStorageProvider());

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "Note 1\n$written-in [[Berlin]]",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "Berlin",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        aliases: new Set(),
      };

      const note2 = await notesProvider.put(noteSaveRequest2);

      expect(note2.backlinks.length).toBe(1);
      expect(note2.backlinks[0].slug).toBe("note-1");
    });

  it("should allow degrading canonical slugs to aliases", async () => {
    const mockStorageProvider = new MockStorageProvider();
    const notesProvider = new NotesProvider(mockStorageProvider);

    const noteSaveRequest1: NewNoteSaveRequest = {
      note: {
        content: "",
        meta: {
          additionalHeaders: {},
          flags: [],
        },
      },
      changeSlugTo: "main-slug",
      aliases: new Set(),
    };
    await notesProvider.put(noteSaveRequest1);

    const noteSaveRequest2: NoteSaveRequest = {
      note: {
        content: "",
        meta: {
          slug: "main-slug",
          additionalHeaders: {},
          flags: [],
        },
      },
      changeSlugTo: "new-canonical-slug",
      aliases: new Set(["main-slug"]), // same as old canonical slug
    };
    const note = await notesProvider.put(noteSaveRequest2);

    expect(note.meta.slug).toBe("new-canonical-slug");
    expect(note.aliases.size).toBe(1);
    expect(note.aliases.has("main-slug")).toBe(true);
  });

  it(
    "should fail when adding a slug of an existing note as alias to a new note",
    async () => {
      const mockStorageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(mockStorageProvider);

      const noteSaveRequest1: NewNoteSaveRequest = {
        note: {
          content: "",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "s1",
        aliases: new Set(),
      };
      await notesProvider.put(noteSaveRequest1);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "s2",
        aliases: new Set(["s1"]),
      };
      expect(notesProvider.put(noteSaveRequest2))
        .rejects.toThrowError(ErrorMessage.SLUG_EXISTS);
    },
  );

  it(
    "should fail when adding a slug of an existing note as alias to an "
    + "existing note",
    async () => {
      const mockStorageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(mockStorageProvider);

      const noteSaveRequest1: NewNoteSaveRequest = {
        note: {
          content: "",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "s1",
        aliases: new Set(),
      };
      await notesProvider.put(noteSaveRequest1);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "s2",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest2);

      const noteSaveRequest3: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            slug: "s2",
            additionalHeaders: {},
            flags: [],
          },
        },
        aliases: new Set(["s1"]),
      };
      expect(notesProvider.put(noteSaveRequest3))
        .rejects.toThrowError(ErrorMessage.SLUG_EXISTS);
    },
  );

  it(
    "should fail when adding an existing alias as alias",
    async () => {
      const mockStorageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(mockStorageProvider);

      const noteSaveRequest1: NewNoteSaveRequest = {
        note: {
          content: "",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "s1",
        aliases: new Set(["alias"]),
      };
      await notesProvider.put(noteSaveRequest1);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "s2",
        aliases: new Set(["alias"]),
      };
      expect(notesProvider.put(noteSaveRequest2))
        .rejects.toThrowError(ErrorMessage.ALIAS_EXISTS);
    },
  );


  it(
    "should save and retrieve notes with slashes in slug",
    async () => {
      const mockStorageProvider = new MockStorageProvider();

      await mockStorageProvider.writeObject(
        "folder/note-1.subtext",
        "test",
      );

      const notesProvider = new NotesProvider(mockStorageProvider);

      const note1 = await notesProvider.get("folder/note-1");
      expect(note1.content).toBe("test");


      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "test 2",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "a/b/c/d",
        aliases: new Set(["y"]),
      };

      await notesProvider.put(noteSaveRequest);

      const noteFromProvider = await notesProvider.get("a/b/c/d");
      expect(noteFromProvider.content).toBe("test 2");
    },
  );

  it(
    "should not allow changing a slug of a new note to an existing file slug",
    async () => {
      const mockStorageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(mockStorageProvider);

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

      await notesProvider.addFile(
        readable,
        "files",
        "file",
      );

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "test",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "files/file",
        aliases: new Set(),
      };

      await expect(notesProvider.put(noteSaveRequest))
        .rejects.toThrow(ErrorMessage.SLUG_EXISTS);
    },
  );

  it(
    "should not allow changing a slug of an existing note "
    + "to an existing file slug",
    async () => {
      const mockStorageProvider = new MockStorageProvider();
      const notesProvider = new NotesProvider(mockStorageProvider);

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

      await notesProvider.addFile(
        readable,
        "files",
        "file",
      );

      const noteSaveRequest: NoteSaveRequest = {
        note: {
          content: "test",
          meta: {
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "n1",
        aliases: new Set(),
      };

      await notesProvider.put(noteSaveRequest);

      const noteSaveRequest2: NoteSaveRequest = {
        note: {
          content: "test",
          meta: {
            slug: "n1",
            additionalHeaders: {},
            flags: [],
          },
        },
        changeSlugTo: "files/file",
        aliases: new Set(),
      };

      await expect(notesProvider.put(noteSaveRequest2))
        .rejects.toThrow(ErrorMessage.SLUG_EXISTS);
    },
  );


  it(
    "should ignore files with invalid slugs",
    async () => {
      const mockStorageProvider = new MockStorageProvider();

      await mockStorageProvider.writeObject(
        "invalid slug/note-1.subtext",
        "note text",
      );

      await mockStorageProvider.writeObject(
        "valid-slug/note-2.subtext",
        "note text",
      );

      const notesProvider = new NotesProvider(mockStorageProvider);

      const notes = await notesProvider.getNotesList({});
      expect(notes.numberOfResults).toBe(1);
      expect(notes.results[0].slug).toBe("valid-slug/note-2");
    },
  );
});
