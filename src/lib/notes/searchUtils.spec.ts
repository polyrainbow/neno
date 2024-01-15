import {
  getNotesWithFlag,
  getNotesWithUrl,
} from "./searchUtils.js";
import ExistingNote from "./types/ExistingNote.js";

jest.mock("../../constants", () => {
  return {
    BASE_URL: "/",
  };
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
