import { DEFAULT_CONTENT_TYPE } from "../../config.js";
import ExistingNote from "./interfaces/ExistingNote.js";
import NewNote from "./interfaces/NewNote.js";
import {
  createSlug,
  getExtensionFromFilename,
  getNotesWithFlag,
  getNotesWithUrl,
  getSlugFromFilename,
  inferNoteTitle,
  parseSerializedExistingNote,
  parseSerializedNewNote,
  removeExtensionFromFilename,
  serializeNote,
  sluggify,
} from "./noteUtils.js";

jest.mock("../../constants", () => {
  return {
    BASE_URL: "/",
  };
});

describe("getExtensionFromFilename", () => {
  it(
    "should correctly normalize filenames",
    async () => {
      expect(getExtensionFromFilename("AUDIO.mp3")).toBe("mp3");
      expect(getExtensionFromFilename("AUDIO.MP3")).toBe("mp3");
      expect(getExtensionFromFilename("AUDIO. MP3")).toBe(" mp3");
      expect(getExtensionFromFilename("AUDIO.mp3  ")).toBe("mp3  ");
    },
  );
});


describe("removeExtensionFromFilename", () => {
  it(
    "should correctly normalize filenames",
    async () => {
      expect(removeExtensionFromFilename("AUDIO.mp3")).toBe("AUDIO");
      expect(removeExtensionFromFilename("audio 1.MP3")).toBe("audio 1");
      expect(removeExtensionFromFilename(".graph.json")).toBe(".graph");
      expect(removeExtensionFromFilename(".htaccess")).toBe("");
    },
  );
});


describe("getSlugFromFilename", () => {
  it(
    "should correctly create slugs for dotfiles",
    async () => {
      expect(getSlugFromFilename(".graph.json", [])).toBe("files/graph.json");
      expect(getSlugFromFilename(".htaccess", [])).toBe("files/htaccess");
    },
  );
});


describe("getNotesWithUrl", () => {
  it(
    "should find correct notes",
    async () => {
      const notes: ExistingNote[] = [
        {
          content: "https://example.com/path",
          meta: {
            slug: "0",
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        {
          content: "https://example.com/path    This url should not match",
          meta: {
            slug: "1",
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        {
          content: "https://example.com/path\n    This url should not match",
          meta: {
            slug: "2",
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        {
          content: "   https://example.com\n    This url should match",
          meta: {
            slug: "3",
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            custom: {},
            flags: [],
            contentType: "",
          },
        },
        {
          content: "   https://example.com    This url should match",
          meta: {
            slug: "4",
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            custom: {},
            flags: [],
            contentType: "",
          },
        },
      ];

      const queryUrl = "https://example.com";
      const result = getNotesWithUrl(notes, queryUrl);
      expect(result.length).toBe(2);
      expect(result[0].meta.slug).toBe("3");
      expect(result[1].meta.slug).toBe("4");
    },
  );
});


describe("getNotesWithFlag", () => {
  it(
    "should find notes with this flag",
    async () => {
      const notes: ExistingNote[] = [
        {
          content: "Bla",
          meta: {
            slug: "0",
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            custom: {},
            flags: ["CREATED_WITH_BROWSER_EXTENSION"],
            contentType: "",
          },
        },
        {
          content: "Bla",
          meta: {
            slug: "1",
            createdAt: 0,
            updatedAt: 0,
            position: {
              x: 0,
              y: 0,
            },
            custom: {},
            flags: ["DUPLICATE_OF(232)"],
            contentType: "",
          },
        },
      ];

      const result = getNotesWithFlag(notes, "DUPLICATE_OF(232)");
      expect(result.length).toBe(1);
      expect(result[0].meta.slug).toBe("1");
    },
  );
});

describe("sluggify", () => {
  it(
    "should create correct slugs",
    async () => {
      expect(sluggify("AUDIO.mp3")).toBe("audio-mp3");
      expect(sluggify("Der Äther")).toBe("der-äther");
      expect(sluggify("--hey there")).toBe("hey-there");
      expect(
        sluggify("#   This is a heading"),
      ).toBe(
        "this-is-a-heading",
      );
      expect(
        sluggify("#   This is a heading\n\nThis is a paragraph"),
      ).toBe(
        "this-is-a-heading-this-is-a-paragraph",
      );
      expect(
        sluggify("slashes/and.dots.are/transformed"),
      ).toBe(
        "slashes-and-dots-are-transformed",
      );
      expect(
        sluggify("Apostrophes won't be used, but will be removed"),
      ).toBe(
        "apostrophes-wont-be-used-but-will-be-removed",
      );
      expect(
        sluggify("Underscores are VALID_CHARS"),
      ).toBe(
        "underscores-are-valid_chars",
      );
    },
  );
});

describe("inferNoteTitle", () => {
  it(
    "should remove wikilink punctuation",
    async () => {
      expect(inferNoteTitle(
        "a title with a [[wikilink]] and some brackets []",
      )).toBe("a title with a wikilink and some brackets []");
    },
  );

  it(
    "should remove heading sigil",
    async () => {
      expect(inferNoteTitle(
        "#   A heading with # and ##",
      )).toBe("A heading with # and ##");
    },
  );

  it(
    "should remove quote block sigil",
    async () => {
      expect(inferNoteTitle(
        ">  A quote block with an <HTMLElement>",
      )).toBe("A quote block with an <HTMLElement>");
    },
  );
});


describe("createSlug", () => {
  it(
    "should use the first meaningful line for slug creation",
    async () => {
      const noteContent = "\n\n\n\n# This is a heading\n\nThis is a paragraph";
      expect(createSlug(noteContent, [])).toBe("this-is-a-heading");
    },
  );

  it(
    "should add a number if the slug already exists",
    async () => {
      const noteContent = "content";
      expect(createSlug(noteContent, ["content"])).toBe("content-2");

      const noteContent2 = "content-2";
      expect(createSlug(noteContent2, ["content-2"])).toBe("content-2-2");
    },
  );
});


describe("serializeNote", () => {
  it(
    "should serialize a note correctly",
    async () => {
      const note: ExistingNote = {
        content: "This is a note",
        meta: {
          slug: "1",
          createdAt: 1000,
          updatedAt: 2000,
          position: {
            x: 1.2,
            y: 3.4,
          },
          custom: {
            "custom-header-1": "custom-value-1",
            "custom-header-2": "custom-value-2",
          },
          flags: [
            "flag1",
            "flag2",
          ],
          contentType: "text/plain",
        },
      };

      const expectedResult = `:created-at:1000
:updated-at:2000
:neno-default-graph-position:1.2,3.4
:neno-flags:flag1,flag2
:content-type:text/plain
:custom-header-1:custom-value-1
:custom-header-2:custom-value-2

This is a note`;

      expect(
        serializeNote(note),
      ).toBe(expectedResult);
    },
  );
});


describe("parseSerializedExistingNote", () => {
  it(
    "should parse a note with optional and custom headers",
    async () => {
      const serializedNote = `:created-at:1000
:updated-at:2000
:neno-default-graph-position:1.2,3.4
:neno-flags:flag1,flag2
:content-type:text/plain
:custom-header-1:custom-value-1
:custom-header-2:custom-value-2

This is a note`;

      const expectedResult: ExistingNote = {
        content: "This is a note",
        meta: {
          slug: "1",
          createdAt: 1000,
          updatedAt: 2000,
          position: {
            x: 1.2,
            y: 3.4,
          },
          custom: {
            "custom-header-1": "custom-value-1",
            "custom-header-2": "custom-value-2",
          },
          flags: [
            "flag1",
            "flag2",
          ],
          contentType: "text/plain",
        },
      };

      expect(
        parseSerializedExistingNote(serializedNote, "1"),
      ).toStrictEqual(expectedResult);
    },
  );

  it(
    "should parse a note without headers",
    async () => {
      const serializedNote = "This is a note";

      const expectedResult: ExistingNote = {
        content: "This is a note",
        meta: {
          slug: "1",
          createdAt: undefined,
          updatedAt: undefined,
          position: {
            x: 0,
            y: 0,
          },
          custom: {},
          flags: [],
          contentType: "text/subtext",
        },
      };

      expect(
        parseSerializedExistingNote(serializedNote, "1"),
      ).toStrictEqual(expectedResult);
    },
  );

  it(
    "should parse a note with CR chars",
    async () => {
      const serializedNote = `:created-at:1000\r
:updated-at:2000\r
:neno-default-graph-position:1.2,3.4\r
:neno-flags:flag1,flag2\r
:content-type:text/plain\r
:custom-header-1:custom-value-1\r
:custom-header-2:custom-value-2\r
\r
This is a note\r
with several\r
blocks`;

      const expectedResult: ExistingNote = {
        content: "This is a note\nwith several\nblocks",
        meta: {
          slug: "1",
          createdAt: 1000,
          updatedAt: 2000,
          position: {
            x: 1.2,
            y: 3.4,
          },
          custom: {
            "custom-header-1": "custom-value-1",
            "custom-header-2": "custom-value-2",
          },
          flags: [
            "flag1",
            "flag2",
          ],
          contentType: "text/plain",
        },
      };

      expect(
        parseSerializedExistingNote(serializedNote, "1"),
      ).toStrictEqual(expectedResult);
    },
  );
});


describe("parseSerializedNewNote", () => {
  it(
    "should parse a note with no headers",
    async () => {
      const serializedNote = "This is a note";

      const expectedResult: NewNote = {
        content: "This is a note",
        meta: {
          custom: {},
          flags: [],
          contentType: DEFAULT_CONTENT_TYPE,
        },
      };

      expect(
        parseSerializedNewNote(serializedNote),
      ).toStrictEqual(expectedResult);
    },
  );
});
