import { InlineText } from "../subwaytext/types/Block.js";
import { SpanType } from "../subwaytext/types/SpanType.js";
import {
  createSlug,
  getSlugAndNameForNewArbitraryFile,
  getSlugsFromInlineText,
  isValidNoteSlug,
  isValidSlug,
  sluggifyNoteText,
  sluggifyWikilinkText,
} from "./slugUtils.js";
import { describe, it, expect } from "vitest";

describe("getSlugAndNameForNewArbitraryFile", () => {
  it(
    "should correctly create slugs for dotfiles",
    async () => {
      expect(
        getSlugAndNameForNewArbitraryFile("files", ".graph.json", new Set()),
      ).toStrictEqual({ slug: "files/graph.json", filename: "graph.json" });
      expect(
        getSlugAndNameForNewArbitraryFile("files", ".htaccess", new Set()),
      ).toStrictEqual({ slug: "files/htaccess", filename: "htaccess" });
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


describe("isValidSlug", () => {
  it(
    "should approve file slugs with dots",
    () => {
      expect(
        isValidSlug("fi.les/file.mp3"),
      ).toBe(true);
    },
  );

  it(
    "should approve slugs with single-letter namespaces",
    () => {
      expect(
        isValidSlug("a/b/c"),
      ).toBe(true);
    },
  );

  it(
    "should catch slugs with whitespace",
    () => {
      expect(
        isValidSlug("invalid slug/file.mp3"),
      ).toBe(false);
      expect(
        isValidSlug("invalid-slug/file 1.mp3"),
      ).toBe(false);
    },
  );

  it(
    "should catch slugs with slash as last char",
    () => {
      expect(
        isValidSlug("slug/"),
      ).toBe(false);
    },
  );

  it(
    "should catch slugs with dot as last char",
    () => {
      expect(
        isValidSlug("slug."),
      ).toBe(false);
    },
  );

  it(
    "should catch slugs with dot as first char",
    () => {
      expect(
        isValidSlug(".slug"),
      ).toBe(false);
    },
  );

  it(
    "should catch slugs starting with a dash",
    () => {
      expect(
        isValidSlug("-slug"),
      ).toBe(false);
    },
  );

  it(
    "should catch slugs with dot as first char after a slash",
    () => {
      expect(
        isValidSlug("files/.slug"),
      ).toBe(false);
    },
  );

  it(
    "should catch slugs with dot as last char before a slash",
    () => {
      expect(
        isValidSlug("files./slug"),
      ).toBe(false);
    },
  );

  it(
    "should catch slugs with double dots",
    () => {
      expect(
        isValidSlug("files/sl..ug"),
      ).toBe(false);
      expect(
        isValidSlug("fi..les/slug"),
      ).toBe(false);
    },
  );
});


describe("isValidNoteSlug", () => {
  it(
    "should catch file slugs with dots",
    () => {
      expect(
        isValidNoteSlug("files/file.mp3"),
      ).toBe(false);
    },
  );

  it(
    "should catch slugs with whitespace",
    () => {
      expect(
        isValidNoteSlug("invalid slug/file.mp3"),
      ).toBe(false);
      expect(
        isValidNoteSlug("invalid-slug/file 1.mp3"),
      ).toBe(false);
    },
  );

  it(
    "should catch slugs with invalid end char",
    () => {
      expect(
        isValidNoteSlug("slug/"),
      ).toBe(false);
    },
  );
});
