// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import {
  createRangeForSpan,
  getMatchOffsets,
  getMatchRanges,
  getScrollDistance,
  getSteppedIndex,
} from "./findInEditor";

const buildEditor = (html: string): HTMLElement => {
  const editor = document.createElement("div");
  editor.setAttribute("data-lexical-editor", "true");
  editor.innerHTML = html;
  return editor;
};

const textOf = (ranges: Range[]): string[] => {
  return ranges.map((range) => range.toString());
};

describe("getMatchOffsets", () => {
  it("should find every non-overlapping occurrence", () => {
    expect(getMatchOffsets("abcabcabc", "abc")).toStrictEqual([0, 3, 6]);
  });

  it("should not overlap a match with itself", () => {
    expect(getMatchOffsets("aaaa", "aa")).toStrictEqual([0, 2]);
  });

  it("should ignore case", () => {
    expect(getMatchOffsets("Note note NOTE", "note")).toStrictEqual([0, 5, 10]);
  });

  it("should treat the query as literal text, not as a pattern", () => {
    expect(getMatchOffsets("a.c abc", "a.c")).toStrictEqual([0]);
    expect(getMatchOffsets("[x] y", "[x]")).toStrictEqual([0]);
  });

  it("should return nothing for an empty query", () => {
    expect(getMatchOffsets("anything", "")).toStrictEqual([]);
  });

  /*
    "İ".toLowerCase() is two code units, so a lower-cased haystack would
    report every later match one character too far to the right.
  */
  it("should keep offsets exact when case folding changes length", () => {
    expect(getMatchOffsets("İxy", "xy")).toStrictEqual([1]);
  });
});

describe("getSteppedIndex", () => {
  it("should advance and wrap at the end", () => {
    expect(getSteppedIndex(0, 3, true)).toBe(1);
    expect(getSteppedIndex(2, 3, true)).toBe(0);
  });

  it("should go back and wrap at the start", () => {
    expect(getSteppedIndex(1, 3, false)).toBe(0);
    expect(getSteppedIndex(0, 3, false)).toBe(2);
  });

  it("should stay put with a single match", () => {
    expect(getSteppedIndex(0, 1, true)).toBe(0);
    expect(getSteppedIndex(0, 1, false)).toBe(0);
  });

  it("should not divide by zero without matches", () => {
    expect(getSteppedIndex(0, 0, true)).toBe(0);
  });
});

describe("getScrollDistance", () => {
  it("should not scroll a match that sits comfortably inside", () => {
    expect(getScrollDistance(300, 320, 0, 800, 64)).toBe(0);
  });

  it("should scroll up for a match above the viewport", () => {
    expect(getScrollDistance(-100, -80, 0, 800, 64)).toBe(-164);
  });

  it("should scroll down for a match below the viewport", () => {
    expect(getScrollDistance(900, 920, 0, 800, 64)).toBe(184);
  });

  it("should scroll a match that is visible but against an edge", () => {
    expect(getScrollDistance(20, 40, 0, 800, 64)).toBe(-44);
  });

  it("should align the top of a match too tall to fit", () => {
    expect(getScrollDistance(500, 3000, 0, 800, 64)).toBe(436);
  });
});

describe("createRangeForSpan", () => {
  const nodes = (...parts: string[]): Text[] => {
    return parts.map((part) => document.createTextNode(part));
  };

  it("should span a single text node", () => {
    const textNodes = nodes("hello world");
    const range = createRangeForSpan(textNodes, 6, 11);
    expect(range?.toString()).toBe("world");
  });

  it("should span several text nodes", () => {
    const textNodes = nodes("he", "llo wo", "rld");
    const parent = document.createElement("p");
    textNodes.forEach((textNode) => parent.appendChild(textNode));
    const range = createRangeForSpan(textNodes, 3, 8);
    expect(range?.toString()).toBe("lo wo");
  });

  it("should return null when the span runs past the text", () => {
    expect(createRangeForSpan(nodes("short"), 2, 40)).toBe(null);
  });
});

describe("getMatchRanges", () => {
  it("should find matches across the styled spans of one block", () => {
    const editor = buildEditor(
      "<p>a <span>hay</span><span>stack</span> b</p>",
    );
    expect(textOf(getMatchRanges(editor, "haystack"))).toStrictEqual([
      "haystack",
    ]);
  });

  /*
    Each block is searched on its own, so two blocks whose text happens
    to join up into the query do not produce a match between them.
  */
  it("should not match across two blocks", () => {
    const editor = buildEditor("<p>the end</p><p>of it</p>");
    expect(getMatchRanges(editor, "endof")).toStrictEqual([]);
  });

  it("should report matches in document order", () => {
    const editor = buildEditor("<p>one two</p><p>two three</p>");
    const ranges = getMatchRanges(editor, "two");
    expect(ranges).toHaveLength(2);
    expect(ranges[0].startContainer.textContent).toBe("one two");
    expect(ranges[1].startContainer.textContent).toBe("two three");
  });

  it("should ignore case", () => {
    const editor = buildEditor("<p>Note the note</p>");
    expect(textOf(getMatchRanges(editor, "note"))).toStrictEqual([
      "Note",
      "note",
    ]);
  });

  it("should find nothing for an empty query", () => {
    const editor = buildEditor("<p>content</p>");
    expect(getMatchRanges(editor, "")).toStrictEqual([]);
  });

  it("should search a root that has no element children", () => {
    const editor = buildEditor("plain");
    expect(textOf(getMatchRanges(editor, "lai"))).toStrictEqual(["lai"]);
  });
});
