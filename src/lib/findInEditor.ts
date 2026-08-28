/*
  Find-in-editor: the search behind the find bar
  (src/components/FindBar.tsx).

  It replaces Chromium's webContents.findInPage(), which searches
  everything the window renders — the note list, the header, the
  navigation rail, the find bar's own input — and so answers a question
  nobody asked. Searching the whole graph is what the search bar is for;
  Cmd-F is for the note in front of you, so this walks the text nodes of
  the active editor and nothing else.

  Matches are reported as DOM Ranges and painted with the CSS Custom
  Highlight API (src/lib/editor/utils/highlight.ts), the same mechanism
  the editor already uses for code tokens and block sigils. Nothing in
  the editor's DOM is mutated and no Lexical state is touched, so the
  document Lexical thinks it has is the document on screen, and the
  caret and the page selection stay where the user left them.

  The parts that are pure arithmetic live here with tests; the two
  functions that need a document are marked as such.
*/

import { collectTextNodes } from "./editor/utils/highlight";

/** Distance kept between a match and the edge of the viewport. */
const SCROLL_MARGIN = 64;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Offsets of every non-overlapping, case-insensitive occurrence of
 * `needle` in `haystack`.
 *
 * Matching runs as a RegExp over the original string rather than over a
 * lower-cased copy: `toLowerCase()` can change a string's length (the
 * Turkish dotted capital İ becomes two code units), which would slide
 * every offset after it and put the highlight in the wrong place. The
 * `i` flag folds case without ever changing lengths, so a match is
 * always exactly `needle.length` long.
 */
export function getMatchOffsets(haystack: string, needle: string): number[] {
  if (needle.length === 0) return [];

  const pattern = new RegExp(escapeRegExp(needle), "gi");
  const offsets: number[] = [];

  let match = pattern.exec(haystack);
  while (match !== null) {
    offsets.push(match.index);
    pattern.lastIndex = match.index + needle.length;
    match = pattern.exec(haystack);
  }

  return offsets;
}

/**
 * Index of the match a step lands on, wrapping at both ends the way
 * every find bar does.
 */
export function getSteppedIndex(
  currentIndex: number,
  total: number,
  forward: boolean,
): number {
  if (total <= 0) return 0;
  const next = forward ? currentIndex + 1 : currentIndex - 1;
  return ((next % total) + total) % total;
}

/**
 * How far to scroll, in pixels, to bring a match into view — positive
 * downwards, 0 when it already sits comfortably inside. A match that is
 * visible but pressed against an edge is still scrolled, so that the
 * line it sits on can be read in context.
 */
export function getScrollDistance(
  matchTop: number,
  matchBottom: number,
  viewportTop: number,
  viewportBottom: number,
  margin: number = SCROLL_MARGIN,
): number {
  /*
    A match taller than the space left over cannot satisfy both edges;
    aligning its top is the useful half.
  */
  const room = viewportBottom - viewportTop - 2 * margin;
  if (matchBottom - matchTop > room) {
    return matchTop - viewportTop - margin;
  }
  if (matchTop < viewportTop + margin) {
    return matchTop - viewportTop - margin;
  }
  if (matchBottom > viewportBottom - margin) {
    return matchBottom - viewportBottom + margin;
  }
  return 0;
}

/**
 * A Range over `textNodes` spanning [start, end) of their concatenated
 * text, or null when the span does not fit them.
 */
export function createRangeForSpan(
  textNodes: Text[],
  start: number,
  end: number,
): Range | null {
  const range = new Range();
  let cursor = 0;
  let hasStart = false;

  for (const textNode of textNodes) {
    const nodeStart = cursor;
    const nodeEnd = cursor + textNode.data.length;

    if (!hasStart && start < nodeEnd) {
      range.setStart(textNode, start - nodeStart);
      hasStart = true;
    }
    if (hasStart && end <= nodeEnd) {
      range.setEnd(textNode, end - nodeStart);
      return range;
    }

    cursor = nodeEnd;
  }

  return null;
}

/**
 * Every match of `query` inside `root`, in document order.
 *
 * Each of the root's element children is searched on its own. Those are
 * the subtext blocks, and keeping them apart is what stops a match from
 * spanning the gap between two of them — "the end" followed by "Of the
 * matter" is two blocks, not the word "endof".
 */
export function getMatchRanges(root: Element, query: string): Range[] {
  if (query.length === 0) return [];

  const blocks: Element[] = root.children.length > 0
    ? Array.from(root.children)
    : [root];
  const ranges: Range[] = [];

  for (const block of blocks) {
    const textNodes = collectTextNodes(block);
    if (textNodes.length === 0) continue;

    const text = textNodes.map((textNode) => textNode.data).join("");
    for (const offset of getMatchOffsets(text, query)) {
      const range = createRangeForSpan(
        textNodes,
        offset,
        offset + query.length,
      );
      if (range) ranges.push(range);
    }
  }

  return ranges;
}

/* --- The two functions below need a live document. --- */

/**
 * The editor the user is looking at, or null on a view without one.
 * There is only ever one mounted; Lexical marks it for us, and the
 * editor's own highlighting already finds it by the same attribute.
 */
export function getActiveEditorElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>("div[data-lexical-editor]");
}

/**
 * Scrolls the match into view without touching the selection.
 *
 * Range has no scrollIntoView() of its own, and the element around a
 * match is usually a whole paragraph, so scrolling that would aim at
 * the wrong line. The nearest scrollable ancestor is scrolled by the
 * distance the match is out by instead.
 */
export function scrollRangeIntoView(range: Range): void {
  const element = range.startContainer.parentElement;
  if (!element) return;

  const rect = range.getBoundingClientRect();
  let scrollable = element.parentElement;

  while (scrollable) {
    const overflowY = getComputedStyle(scrollable).overflowY;
    const scrolls = (overflowY === "auto" || overflowY === "scroll")
      && scrollable.scrollHeight > scrollable.clientHeight;

    if (scrolls) {
      const viewport = scrollable.getBoundingClientRect();
      const distance = getScrollDistance(
        rect.top,
        rect.bottom,
        viewport.top,
        viewport.bottom,
      );
      if (distance !== 0) {
        scrollable.scrollBy({ top: distance, behavior: "instant" });
      }
      return;
    }

    scrollable = scrollable.parentElement;
  }

  const distance = getScrollDistance(
    rect.top,
    rect.bottom,
    0,
    window.innerHeight,
  );
  if (distance !== 0) {
    window.scrollBy({ top: distance, behavior: "instant" });
  }
}
