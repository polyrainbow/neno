import { InlineText } from "../subwaytext/types/Block.js";
import { SpanType } from "../subwaytext/types/SpanType.js";
import {
  createSlug,
  getSlugFromFilename,
  getSlugsFromInlineText,
  sluggifyNoteText,
  sluggifyWikilinkText,
} from "./slugUtils.js";
import { describe, it, expect } from "vitest";

describe("getSlugFromFilename", () => {
  it(
    "should correctly create slugs for dotfiles",
    async () => {
      expect(
        getSlugFromFilename("files", ".graph.json", []),
      ).toBe("files/graph.json");
      expect(
        getSlugFromFilename("files", ".htaccess", []),
      ).toBe("files/htaccess");
    },
  );
});


describe("sluggifyNoteText", () => {
  it(
    "should create correct slugs",
    async () => {
      expect(sluggifyNoteText("AUDIO.mp3")).toBe("audio-mp3");
      expect(sluggifyNoteText("Der Äther")).toBe("der-äther");
      expect(sluggifyNoteText("--hey there")).toBe("hey-there");
      expect(
        sluggifyNoteText("#   This is a heading"),
      ).toBe(
        "this-is-a-heading",
      );
      expect(
        sluggifyNoteText("#   This is a heading\n\nThis is a paragraph"),
      ).toBe(
        "this-is-a-heading-this-is-a-paragraph",
      );
      expect(
        sluggifyNoteText("dots.and.slashes.are/trans.formed"),
      ).toBe(
        "dots-and-slashes-are-trans-formed",
      );
      expect(
        sluggifyNoteText("Apostrophes won't be used, but will be removed"),
      ).toBe(
        "apostrophes-wont-be-used-but-will-be-removed",
      );
      expect(
        sluggifyNoteText("Underscores are VALID_CHARS"),
      ).toBe(
        "underscores-are-valid_chars",
      );
    },
  );


  describe("sluggifyWikilinkText", () => {
    it(
      "should create correct slugs",
      async () => {
        expect(sluggifyWikilinkText("AUDIO.mp3")).toBe("audio-mp3");
        expect(sluggifyWikilinkText("Der Äther")).toBe("der-äther");
        expect(sluggifyWikilinkText("--hey there")).toBe("hey-there");
        expect(
          sluggifyWikilinkText("#   This is a heading"),
        ).toBe(
          "this-is-a-heading",
        );
        expect(
          sluggifyWikilinkText("#   This is a heading\n\nThis is a paragraph"),
        ).toBe(
          "this-is-a-heading-this-is-a-paragraph",
        );
        expect(
          sluggifyWikilinkText("dots.are..trans.....formed"),
        ).toBe(
          "dots-are-trans-formed",
        );
        expect(
          sluggifyWikilinkText("single/slashes/are/removed"),
        ).toBe(
          "single-slashes-are-removed",
        );
        expect(
          sluggifyWikilinkText("double/slashes//are/transformed"),
        ).toBe(
          "double-slashes/are-transformed",
        );
        expect(
          sluggifyWikilinkText(
            "Apostrophes won't be used, but will be removed",
          ),
        ).toBe(
          "apostrophes-wont-be-used-but-will-be-removed",
        );
        expect(
          sluggifyWikilinkText("Underscores are VALID_CHARS"),
        ).toBe(
          "underscores-are-valid_chars",
        );
      },
    );
  });


  describe("createSlug", () => {
    it(
      "should use the first meaningful line for slug creation",
      async () => {
        const noteContent
          = "\n\n\n\n# This is a heading\n\nThis is a paragraph";
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


  describe("getSlugsFromInlineText", () => {
    it(
      "should return file slugs from slashlinks",
      async () => {
        const inlineText: InlineText = [
          {
            text: "This is a text with a ",
            type: SpanType.NORMAL_TEXT,
          },
          {
            text: "/files/slashlink-to-file",
            type: SpanType.SLASHLINK,
          },
          {
            text: " in between.",
            type: SpanType.NORMAL_TEXT,
          },
        ];

        expect(getSlugsFromInlineText(inlineText)).toStrictEqual(
          ["files/slashlink-to-file"],
        );
      },
    );
  });
});
