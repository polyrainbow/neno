import CharIterator from "./CharIterator.js";
import { RunningText, Span } from "./interfaces/Block.js";
import { SpanType } from "./interfaces/SpanType.js";

export const isWhiteSpace = (string: string): boolean => {
  return string.trim().length === 0;
};


export const parseText = (text: string): RunningText => {
  const spans: Span[] = [];
  const iterator = new CharIterator(text);
  let currentSpanType: SpanType = SpanType.NORMAL_TEXT;
  let currentSpanText = "";

  // eslint-disable-next-line no-constant-condition
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

    if (typeof lastChar !== "string" || isWhiteSpace(lastChar)) {
      if (
        char === "h"
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
        char === "/"
      ) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText,
        });
  
        currentSpanText = "";
        currentSpanType = SpanType.SLASHLINK;
      } else {
        currentSpanType = SpanType.NORMAL_TEXT;
      }
    }

    if (
      isWhiteSpace(char) && currentSpanType !== SpanType.NORMAL_TEXT
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