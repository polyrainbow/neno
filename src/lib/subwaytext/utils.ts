import CharIterator from "./CharIterator.js";
import { InlineText, Span } from "./types/Block.js";
import { SpanType } from "./types/SpanType.js";

export const isWhiteSpace = (string: string): boolean => {
  return string.trim().length === 0;
};


export const parseText = (text: string): InlineText => {
  const spans: Span[] = [];
  const iterator = new CharIterator(text);
  let currentSpanType: SpanType | null = null;
  let currentSpanText = "";

  while (true) {
    const step = iterator.next();
    if (step.done) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText,
        });
      }
      break;
    }
    const char = step.value;
    const lastChar = iterator.peekBack();

    if (
      (
        typeof lastChar !== "string"
        || isWhiteSpace(lastChar)
      )
      && char === "h"
      && (
        iterator.peek(5).join("") === "ttp:/"
        || iterator.peek(6).join("") === "ttps:/"
      )
    ) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText,
        });
      }

      currentSpanText = "";
      currentSpanType = SpanType.HYPERLINK;
    } else if (
      (
        typeof lastChar !== "string"
        || isWhiteSpace(lastChar)
      )
      && char === "/"
      && currentSpanType !== SpanType.WIKILINK
      && /^[\p{L}\d_]$/u.test(iterator.peek(1).join(""))
      && (
        (
          typeof iterator.charsUntil(" ") === "string"
          && /^[\p{L}\d_]$/u.test(iterator.charsUntil(" ")!.slice(-1))
        )
        || (
          iterator.charsUntil(" ") === null
          && /^[\p{L}\d_]$/u.test(iterator.getRest().slice(-1))
        )
      )
    ) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText,
        });
      }

      currentSpanText = "";
      currentSpanType = SpanType.SLASHLINK;
    } else if (
      isWhiteSpace(char)
      && currentSpanType !== SpanType.NORMAL_TEXT
      && currentSpanType !== SpanType.WIKILINK
    ) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText,
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.NORMAL_TEXT;
    } else if (
      char === "["
      && iterator.peek(1).join("") === "["
      && iterator.getRest().includes("]]")
      && !(iterator.charsUntil("]]", 2)?.includes("["))
      && !(iterator.charsUntil("]]", 2)?.includes("]"))
    ) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText,
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.WIKILINK;
    } else if (
      currentSpanType === SpanType.WIKILINK
      && lastChar === "]"
      && iterator.peekBack(2) === "]"
    ) {
      spans.push({
        type: currentSpanType,
        text: currentSpanText,
      });
      currentSpanText = "";
      currentSpanType = SpanType.NORMAL_TEXT;
    } else if (!currentSpanType) {
      currentSpanType = SpanType.NORMAL_TEXT;
    }
    currentSpanText += char;
  }

  return spans;
};
