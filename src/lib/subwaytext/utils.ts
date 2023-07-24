import CharIterator from "./CharIterator.js";
import { InlineText, Span } from "./interfaces/Block.js";
import { SpanType } from "./interfaces/SpanType.js";

export const isWhiteSpace = (string: string): boolean => {
  return string.trim().length === 0;
};


export const parseText = (text: string): InlineText => {
  const spans: Span[] = [];
  const iterator = new CharIterator(text);
  let currentSpanType: SpanType = SpanType.NORMAL_TEXT;
  let currentSpanText = "";


  while (true) {
    const step = iterator.next();
    if (step.done) {
      spans.push({
        type: currentSpanType,
        text: currentSpanText,
      });
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
      spans.push({
        type: currentSpanType,
        text: currentSpanText,
      });

      currentSpanText = "";
      currentSpanType = SpanType.HYPERLINK;
    } else if (
      (
        typeof lastChar !== "string"
        || isWhiteSpace(lastChar)
      )
      && char === "/"
    ) {
      spans.push({
        type: currentSpanType,
        text: currentSpanText,
      });

      currentSpanText = "";
      currentSpanType = SpanType.SLASHLINK;
    } else if (
      isWhiteSpace(char)
      && currentSpanType !== SpanType.NORMAL_TEXT
      && currentSpanType !== SpanType.WIKILINK
    ) {
      spans.push({
        type: currentSpanType,
        text: currentSpanText,
      });
      currentSpanText = "";
      currentSpanType = SpanType.NORMAL_TEXT;
    } else if (
      char === "["
      && iterator.peek(1).join("") === "["
      && currentSpanType !== SpanType.WIKILINK
      && iterator.getRest().includes("]]")
      && !(iterator.charsUntil("]]", 2)?.includes("["))
      && !(iterator.charsUntil("]]", 2)?.includes("]"))
    ) {
      spans.push({
        type: currentSpanType,
        text: currentSpanText,
      });
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
    }
    currentSpanText += char;
  }

  return spans;
};
