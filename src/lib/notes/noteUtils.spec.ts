/* eslint-disable max-len */

import ExistingNote from "./interfaces/ExistingNote.js";
import {
  createSlug,
  getExtensionFromFilename,
  getNotesWithFlag,
  getNotesWithUrl,
  inferNoteTitle,
  parseFileIds,
  sluggify,
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

  it(
    "should remove heading sigil",
    async () => {
      expect(inferNoteTitle(
        "#   A heading with # and ##",
      )).toBe("A heading with # and ##");
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
    "should use add a number if the slug already exists",
    async () => {
      const noteContent = "content";
      expect(createSlug(noteContent, ["content"])).toBe("content-2");

      const noteContent2 = "content-2";
      expect(createSlug(noteContent2, ["content-2"])).toBe("content-2-2");
    },
  );
});


describe("parseFileIds", () => {
  it(
    "should find all valid file ids referenced with a slashlink",
    async () => {
      const noteContent = `/files/1ab11718-5e6e-453d-a610-7207ac8a4488.jpg valid
      Valid: /files/2ab11718-5e6e-453d-a610-7207ac8a4488.jpg
      Invalid:/files/3ab11718-5e6e-453d-a610-7207ac8a4488.jpg
      Valid: /files/4ab11718-5e6e-453d-a610-7207ac8a4488.jpg test /files/5ab11718-5e6e-453d-a610-7207ac8a4488.jpg
      Invalid: /file/6ab11718-5e6e-453d-a610-7207ac8a4488.jpg
      Invalid: /files/7ab11718-5e6e-453d-a610-7207ac8a4488
      Invalid: /files/8ab11718-5e6e-453d-a610-7207ac8a4488.jpg!
      Invalid: /files/9.jpg
/files/9ab11718-5e6e-453d-a610-7207ac8a4488.jpg valid
      `;

      const expectedResult = [
        "1ab11718-5e6e-453d-a610-7207ac8a4488.jpg",
        "2ab11718-5e6e-453d-a610-7207ac8a4488.jpg",
        "4ab11718-5e6e-453d-a610-7207ac8a4488.jpg",
        "5ab11718-5e6e-453d-a610-7207ac8a4488.jpg",
        "9ab11718-5e6e-453d-a610-7207ac8a4488.jpg",
      ];
      expect(parseFileIds(noteContent)).toStrictEqual(expectedResult);
    },
  );
});
