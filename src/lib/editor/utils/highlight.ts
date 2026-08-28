import { tokenizeCode } from "./tokenizeCode.js";

const CODE_TOKEN_HIGHLIGHT_PREFIX = "code-token-";

/** Every text node under `el`, in document order. */
export const collectTextNodes = (el: Element): Text[] => {
  const result: Text[] = [];
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      result.push(node as Text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      result.push(...collectTextNodes(node as Element));
    }
  }
  return result;
};

const mapSpanToRanges = (
  lines: Element[],
  spanStart: number,
  spanEnd: number,
): Range[] => {
  const ranges: Range[] = [];
  let cursor = 0;

  for (const line of lines) {
    const lineText = line.textContent ?? "";
    const lineStart = cursor;
    const lineEnd = cursor + lineText.length;

    if (spanEnd <= lineStart) break;

    if (spanStart < lineEnd && spanEnd > lineStart) {
      const localStart = Math.max(spanStart - lineStart, 0);
      const localEnd = Math.min(spanEnd - lineStart, lineText.length);

      if (localEnd > localStart) {
        const textNodes = collectTextNodes(line);
        let nodeOffset = 0;
        for (const textNode of textNodes) {
          const nodeLength = textNode.data.length;
          const nodeStart = nodeOffset;
          const nodeEnd = nodeOffset + nodeLength;

          if (localEnd <= nodeStart) break;

          if (localStart < nodeEnd && localEnd > nodeStart) {
            const range = new Range();
            range.setStart(textNode, Math.max(localStart - nodeStart, 0));
            range.setEnd(textNode, Math.min(localEnd - nodeStart, nodeLength));
            ranges.push(range);
          }

          nodeOffset = nodeEnd;
        }
      }
    }

    cursor = lineEnd + 1;
  }

  return ranges;
};

export const highlightCodeTokens = () => {
  // @ts-ignore — CSS Custom Highlight API not in current lib.dom.d.ts
  const registry = CSS.highlights;
  const staleKeys: string[] = [];
  for (const key of registry.keys()) {
    if (key.startsWith(CODE_TOKEN_HIGHLIGHT_PREFIX)) {
      staleKeys.push(key);
    }
  }
  for (const key of staleKeys) {
    registry.delete(key);
  }

  const editor = document.querySelector("div[data-lexical-editor]");
  if (!editor) return;

  const children = Array.from(editor.children);
  const rangesByType = new Map<string, Range[]>();

  let i = 0;
  while (i < children.length) {
    const opener = children[i];
    const openerText = opener.textContent ?? "";
    if (
      !opener.classList.contains("code-block")
      || !openerText.startsWith("```")
    ) {
      i++;
      continue;
    }

    const language = openerText.substring(3).trim();
    const bodyLines: Element[] = [];
    i++;

    while (i < children.length) {
      const inner = children[i];
      const innerText = inner.textContent ?? "";
      if (!inner.classList.contains("code-block")) {
        break;
      }
      if (innerText.trimEnd() === "```") {
        i++;
        break;
      }
      bodyLines.push(inner);
      i++;
    }

    if (bodyLines.length === 0 || language === "") continue;

    const code = bodyLines.map((el) => el.textContent ?? "").join("\n");
    const spans = tokenizeCode(code, language);

    for (const span of spans) {
      const ranges = mapSpanToRanges(bodyLines, span.start, span.end);
      if (ranges.length === 0) continue;
      const bucket = rangesByType.get(span.type);
      if (bucket) {
        bucket.push(...ranges);
      } else {
        rangesByType.set(span.type, ranges);
      }
    }
  }

  for (const [type, ranges] of rangesByType) {
    // @ts-ignore — Highlight constructor not in current lib.dom.d.ts
    const highlight = new Highlight(...ranges);
    registry.set(CODE_TOKEN_HIGHLIGHT_PREFIX + type, highlight);
  }
};

export const highlightHeadingSigils = () => {
  const headingElements = document.querySelectorAll(
    "div[data-lexical-editor] .s-heading",
  );

  const ranges: Range[] = [];
  Array.from(headingElements).forEach((element) => {
    const span = element.children[0];
    const textNode = span.childNodes[0];
    const range = new Range();
    range.setStart(textNode, 0);
    range.setEnd(textNode, 1);
    ranges.push(range);
  });

  // @ts-ignore
  const highlight = new Highlight(...ranges);
  // @ts-ignore
  CSS.highlights.set("heading-block-sigil", highlight);
};

export const highlightQuoteBlockSigils = () => {
  const quoteBlocks = document.querySelectorAll(
    "div[data-lexical-editor] .quote-block",
  );

  const ranges: Range[] = [];
  Array.from(quoteBlocks).forEach((element) => {
    const span = element.children[0];
    const textNode = span.childNodes[0];
    const range = new Range();
    range.setStart(textNode, 0);
    range.setEnd(textNode, 1);
    ranges.push(range);
  });

  // @ts-ignore
  const highlight = new Highlight(...ranges);
  // @ts-ignore
  CSS.highlights.set("quote-block-sigil", highlight);
};


export const highlightInlineCodeSigils = () => {
  const inlineCodeSpans = document.querySelectorAll(
    "div[data-lexical-editor] .inline-code",
  );

  const ranges: Range[] = [];
  Array.from(inlineCodeSpans).forEach((span) => {
    const textNode = span.childNodes[0];
    const rangeStart = new Range();
    rangeStart.setStart(textNode, 0);
    rangeStart.setEnd(textNode, 1);
    ranges.push(rangeStart);

    const textContent = textNode.textContent;

    if (textContent) {
      const rangeEnd = new Range();
      rangeEnd.setStart(textNode, textContent.length - 1);
      rangeEnd.setEnd(textNode, textContent.length);
      ranges.push(rangeEnd);
    }
  });

  // @ts-ignore
  const highlight = new Highlight(...ranges);
  // @ts-ignore
  CSS.highlights.set("inline-code-sigil", highlight);
};

export const highlightBoldSigils = () => {
  const boldSpans = document.querySelectorAll(
    "div[data-lexical-editor] span.bold",
  );

  const ranges: Range[] = [];
  Array.from(boldSpans).forEach((span) => {
    const textNode = span.childNodes[0];
    const rangeStart = new Range();
    rangeStart.setStart(textNode, 0);
    rangeStart.setEnd(textNode, 1);
    ranges.push(rangeStart);

    const textContent = textNode.textContent;

    if (textContent) {
      const rangeEnd = new Range();
      rangeEnd.setStart(textNode, textContent.length - 1);
      rangeEnd.setEnd(textNode, textContent.length);
      ranges.push(rangeEnd);
    }
  });

  // @ts-ignore
  const highlight = new Highlight(...ranges);
  // @ts-ignore
  CSS.highlights.set("bold-sigil", highlight);
};

/*
  The find bar's matches (src/components/FindBar.tsx). Two highlights
  rather than one, so the match the user is standing on can be told
  apart from the rest; they are kept disjoint because a range in both
  would be painted twice.

  These are not part of applyAllHighlights(): the others are derived
  from the editor's content and are rebuilt on every change, while these
  are derived from what the user typed into the find bar and outlive
  nothing but the search itself.
*/
const FIND_MATCH_HIGHLIGHT = "find-match";
const FIND_MATCH_ACTIVE_HIGHLIGHT = "find-match-active";

export const clearFindHighlights = (): void => {
  // @ts-ignore — CSS Custom Highlight API not in current lib.dom.d.ts
  const registry = CSS.highlights;
  registry.delete(FIND_MATCH_HIGHLIGHT);
  registry.delete(FIND_MATCH_ACTIVE_HIGHLIGHT);
};

export const setFindHighlights = (
  ranges: Range[],
  activeIndex: number,
): void => {
  // @ts-ignore — CSS Custom Highlight API not in current lib.dom.d.ts
  const registry = CSS.highlights;

  if (ranges.length === 0) {
    clearFindHighlights();
    return;
  }

  const inactive = ranges.filter((_range, i) => i !== activeIndex);
  const active = ranges[activeIndex];

  if (inactive.length > 0) {
    // @ts-ignore — Highlight constructor not in current lib.dom.d.ts
    registry.set(FIND_MATCH_HIGHLIGHT, new Highlight(...inactive));
  } else {
    registry.delete(FIND_MATCH_HIGHLIGHT);
  }

  if (active) {
    // @ts-ignore
    registry.set(FIND_MATCH_ACTIVE_HIGHLIGHT, new Highlight(active));
  } else {
    registry.delete(FIND_MATCH_ACTIVE_HIGHLIGHT);
  }
};

export const applyAllHighlights = () => {
  highlightHeadingSigils();
  highlightQuoteBlockSigils();
  highlightInlineCodeSigils();
  highlightBoldSigils();
  highlightCodeTokens();
};
