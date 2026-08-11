import sanitizeUrl from "./sanitizeUrl";
import {
  MarkdownSpan,
  MarkdownSpanType,
} from "./types";

const ESCAPABLE = /[\\`*_{}[\]()#+\-.!|~<>]/;
const AUTOLINK = /^<([a-zA-Z][a-zA-Z0-9+.-]*:[^<>\s]+)>/;
const EMAIL_AUTOLINK = /^<([^<>\s@]+@[^<>\s@]+\.[^<>\s@]+)>/;
const ALPHANUMERIC = /[\p{L}\p{N}]/u;


const getRunLength = (
  text: string,
  startIndex: number,
  char: string,
): number => {
  let length = 0;
  while (text[startIndex + length] === char) {
    length++;
  }
  return length;
};


/*
  Finds the index of the backtick run that closes a code span. Other than
  emphasis, code spans are closed by a run of exactly the same length.
*/
const findCodeSpanEnd = (
  text: string,
  searchStartIndex: number,
  runLength: number,
): number => {
  let i = searchStartIndex;

  while (i < text.length) {
    if (text[i] !== "`") {
      i++;
      continue;
    }

    const length = getRunLength(text, i, "`");
    if (length === runLength) {
      return i;
    }
    i += length;
  }

  return -1;
};


interface LinkTarget {
  url: string,
  title: string | null,
  endIndex: number,
}


/*
  Reads the "(url "title")" part of a link or image, starting at the opening
  parenthesis. Returns null if there is no valid target.
*/
const parseLinkTarget = (
  text: string,
  startIndex: number,
): LinkTarget | null => {
  if (text[startIndex] !== "(") {
    return null;
  }

  let i = startIndex + 1;
  let url = "";
  let title: string | null = null;

  while (i < text.length && /\s/.test(text[i])) {
    i++;
  }

  if (text[i] === "<") {
    const end = text.indexOf(">", i + 1);
    if (end === -1) {
      return null;
    }
    url = text.slice(i + 1, end);
    i = end + 1;
  } else {
    let depth = 0;
    while (i < text.length) {
      const char = text[i];
      if (char === "\\" && ESCAPABLE.test(text[i + 1] ?? "")) {
        url += text[i + 1];
        i += 2;
        continue;
      }
      if (/\s/.test(char)) {
        break;
      }
      if (char === "(") {
        depth++;
      }
      if (char === ")") {
        if (depth === 0) {
          break;
        }
        depth--;
      }
      url += char;
      i++;
    }
  }

  while (i < text.length && /\s/.test(text[i])) {
    i++;
  }

  const titleDelimiter = text[i];
  if (
    titleDelimiter === "\""
    || titleDelimiter === "'"
    || titleDelimiter === "("
  ) {
    const closingDelimiter = titleDelimiter === "(" ? ")" : titleDelimiter;
    const end = text.indexOf(closingDelimiter, i + 1);
    if (end === -1) {
      return null;
    }
    title = text.slice(i + 1, end);
    i = end + 1;
  }

  while (i < text.length && /\s/.test(text[i])) {
    i++;
  }

  if (text[i] !== ")") {
    return null;
  }

  return {
    url,
    title,
    endIndex: i + 1,
  };
};


interface LinkParseResult extends LinkTarget {
  label: string,
}


/*
  Reads a "[label](url)" construct, starting at the opening bracket.
*/
const parseLink = (
  text: string,
  startIndex: number,
): LinkParseResult | null => {
  let depth = 0;
  let i = startIndex;

  while (i < text.length) {
    const char = text[i];

    if (char === "\\") {
      i += 2;
      continue;
    }

    if (char === "[") {
      depth++;
    } else if (char === "]") {
      depth--;
      if (depth === 0) {
        break;
      }
    }

    i++;
  }

  if (depth !== 0 || i >= text.length) {
    return null;
  }

  const label = text.slice(startIndex + 1, i);
  const target = parseLinkTarget(text, i + 1);

  if (!target) {
    return null;
  }

  return {
    ...target,
    label,
  };
};


/*
  Finds the index at which the delimiter run that closes an emphasis,
  strong emphasis or strikethrough starts. A run of exactly the same length is
  preferred, so that "*a **b** c*" is parsed the way it is written.
*/
const findClosingDelimiterRun = (
  text: string,
  searchStartIndex: number,
  char: string,
  length: number,
): number => {
  let fallback = -1;
  let i = searchStartIndex;

  while (i < text.length) {
    if (text[i] === "\\") {
      i += 2;
      continue;
    }

    if (text[i] !== char) {
      i++;
      continue;
    }

    const runLength = getRunLength(text, i, char);
    const precedingCharacter = text[i - 1];
    const followingCharacter = text[i + runLength];
    const isRightFlanking = typeof precedingCharacter === "string"
      && !/\s/.test(precedingCharacter);
    const closesIntraWord = char === "_"
      && typeof followingCharacter === "string"
      && ALPHANUMERIC.test(followingCharacter);

    if (runLength >= length && isRightFlanking && !closesIntraWord) {
      if (runLength === length) {
        return i;
      }
      if (fallback === -1) {
        fallback = i;
      }
    }

    i += runLength;
  }

  return fallback;
};


const wrapEmphasis = (
  char: string,
  length: number,
  children: MarkdownSpan[],
): MarkdownSpan => {
  if (char === "~") {
    return {
      type: MarkdownSpanType.STRIKETHROUGH,
      children,
    };
  }

  if (length === 1) {
    return {
      type: MarkdownSpanType.EMPHASIS,
      children,
    };
  }

  if (length === 2) {
    return {
      type: MarkdownSpanType.STRONG,
      children,
    };
  }

  return {
    type: MarkdownSpanType.STRONG,
    children: [{
      type: MarkdownSpanType.EMPHASIS,
      children,
    }],
  };
};


const parseInline = (text: string): MarkdownSpan[] => {
  const spans: MarkdownSpan[] = [];
  let buffer = "";
  let i = 0;

  const flushBuffer = () => {
    if (buffer.length > 0) {
      spans.push({
        type: MarkdownSpanType.TEXT,
        text: buffer,
      });
      buffer = "";
    }
  };

  while (i < text.length) {
    const char = text[i];

    if (char === "\\" && ESCAPABLE.test(text[i + 1] ?? "")) {
      buffer += text[i + 1];
      i += 2;
      continue;
    }

    // Two or more spaces or a backslash at the end of a line create a
    // hard line break.
    if (char === "\n") {
      const hardBreak = /(?: {2,}|\\)$/.test(buffer);
      if (hardBreak) {
        buffer = buffer.replace(/(?: {2,}|\\)$/, "");
        flushBuffer();
        spans.push({ type: MarkdownSpanType.LINE_BREAK });
      } else {
        buffer += "\n";
      }
      i++;
      continue;
    }

    if (char === "`") {
      const runLength = getRunLength(text, i, "`");
      const closingIndex = findCodeSpanEnd(text, i + runLength, runLength);

      if (closingIndex !== -1) {
        let code = text.slice(i + runLength, closingIndex)
          .replace(/\n/g, " ");

        if (
          code.length > 2
          && code.startsWith(" ")
          && code.endsWith(" ")
          && code.trim().length > 0
        ) {
          code = code.slice(1, -1);
        }

        flushBuffer();
        spans.push({
          type: MarkdownSpanType.CODE,
          text: code,
        });
        i = closingIndex + runLength;
        continue;
      }
    }

    if (char === "!" && text[i + 1] === "[") {
      const link = parseLink(text, i + 1);
      if (link) {
        flushBuffer();
        spans.push({
          type: MarkdownSpanType.IMAGE,
          url: sanitizeUrl(link.url),
          alt: link.label,
          title: link.title,
        });
        i = link.endIndex;
        continue;
      }
    }

    if (char === "[") {
      const link = parseLink(text, i);
      if (link) {
        const url = sanitizeUrl(link.url);
        flushBuffer();
        if (url) {
          spans.push({
            type: MarkdownSpanType.LINK,
            url,
            title: link.title,
            children: parseInline(link.label),
          });
        } else {
          spans.push(...parseInline(link.label));
        }
        i = link.endIndex;
        continue;
      }
    }

    if (char === "<") {
      const rest = text.slice(i);
      const autolinkMatch = rest.match(AUTOLINK) ?? rest.match(EMAIL_AUTOLINK);

      if (autolinkMatch) {
        const target = autolinkMatch[1];
        const url = sanitizeUrl(
          target.includes("@") && !target.includes(":")
            ? "mailto:" + target
            : target,
        );

        flushBuffer();

        if (url) {
          spans.push({
            type: MarkdownSpanType.LINK,
            url,
            title: null,
            children: [{
              type: MarkdownSpanType.TEXT,
              text: target,
            }],
          });
        } else {
          buffer += autolinkMatch[0];
        }

        i += autolinkMatch[0].length;
        continue;
      }
    }

    if (char === "*" || char === "_" || char === "~") {
      const runLength = getRunLength(text, i, char);
      const delimiterLength = char === "~"
        ? Math.min(runLength, 2)
        : Math.min(runLength, 3);
      const followingCharacter = text[i + runLength];
      const precedingCharacter = text[i - 1];
      const isLeftFlanking = typeof followingCharacter === "string"
        && !/\s/.test(followingCharacter);
      const opensIntraWord = char === "_"
        && typeof precedingCharacter === "string"
        && ALPHANUMERIC.test(precedingCharacter);

      if (isLeftFlanking && !opensIntraWord) {
        const closingIndex = findClosingDelimiterRun(
          text,
          i + runLength,
          char,
          delimiterLength,
        );

        if (closingIndex !== -1) {
          const content = text.slice(i + runLength, closingIndex);
          flushBuffer();
          spans.push(wrapEmphasis(
            char,
            delimiterLength,
            parseInline(content),
          ));
          i = closingIndex + delimiterLength;
          continue;
        }
      }
    }

    buffer += char;
    i++;
  }

  flushBuffer();

  return spans;
};


export default parseInline;
