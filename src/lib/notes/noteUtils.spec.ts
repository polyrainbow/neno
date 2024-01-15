import { DEFAULT_CONTENT_TYPE } from "../../config.js";
import ExistingNote from "./types/ExistingNote.js";
import NewNote from "./types/NewNote.js";
import {
  inferNoteTitle,
  parseSerializedExistingNote,
  parseSerializedNewNote,
  serializeNote,
} from "./noteUtils.js";


jest.mock("../../constants", () => {
  return {
    BASE_URL: "/",
  };
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
