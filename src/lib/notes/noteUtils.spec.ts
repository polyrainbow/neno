import ExistingNote from "./interfaces/ExistingNote.js";
import {
  getExtensionFromFilename,
  getNotesWithFlag,
  getNotesWithUrl,
  inferNoteTitle,
  sluggifyLink,
} from "./noteUtils.js";


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

describe("sluggifyLink", () => {
  it(
    "should create correct slugs",
    async () => {
      expect(sluggifyLink("AUDIO.mp3")).toBe("audio.mp3");
      expect(sluggifyLink("Der Äther")).toBe("der-äther");
      expect(sluggifyLink("--hey there")).toBe("hey-there");
      expect(
        sluggifyLink("#   This is a heading"),
      ).toBe(
        "this-is-a-heading",
      );
      expect(
        sluggifyLink("#   This is a heading\n\nThis is a paragraph"),
      ).toBe(
        "this-is-a-heading-this-is-a-paragraph",
      );
      expect(
        sluggifyLink("#slashes/are/allowed"),
      ).toBe(
        "slashes/are/allowed",
      );
    },
  );
});

describe("infer note title", () => {
  it(
    "should remove wikilink punctuation",
    async () => {
      expect(inferNoteTitle(
        "a title with a [[wikilink]] and some brackets []",
      )).toBe("a title with a wikilink and some brackets []");
    },
  );
});
