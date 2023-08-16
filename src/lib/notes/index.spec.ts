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
});
