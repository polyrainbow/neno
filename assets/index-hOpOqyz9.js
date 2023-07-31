var BlockType = /* @__PURE__ */ ((BlockType2) => {
  BlockType2["PARAGRAPH"] = "paragraph";
  BlockType2["HEADING"] = "heading";
  BlockType2["UNORDERED_LIST_ITEM"] = "unordered-list-item";
  BlockType2["ORDERED_LIST_ITEM"] = "ordered-list-item";
  BlockType2["CODE"] = "code";
  BlockType2["QUOTE"] = "quote";
  BlockType2["KEY_VALUE_PAIR"] = "key-value-pair";
  BlockType2["EMPTY"] = "empty";
  return BlockType2;
})(BlockType || {});

class CharIterator {
  #chars;
  #index;
  constructor(input) {
    this.#chars = Array.from(input);
    this.#index = -1;
  }
  next() {
    this.#index++;
    const done = this.#index === this.#chars.length;
    return done ? {
      done,
      value: null
    } : {
      done,
      value: this.#chars[this.#index]
    };
  }
  peek(numberOfChars) {
    return this.#chars.slice(this.#index + 1, this.#index + 1 + numberOfChars);
  }
  peekBack(numberOfChars) {
    return this.#chars[this.#index - (numberOfChars ?? 1)];
  }
  getRest() {
    return this.#chars.slice(this.#index).join("");
  }
  charsUntil(delimiter, offset) {
    const stringToAnalyse = this.#chars.slice(this.#index + (offset ?? 0)).join("");
    const delimiterIndex = stringToAnalyse.indexOf(delimiter, 0);
    if (delimiterIndex === -1) {
      return null;
    }
    const charsUntilDelimiter = stringToAnalyse.slice(0, delimiterIndex);
    return charsUntilDelimiter;
  }
}

var SpanType = /* @__PURE__ */ ((SpanType2) => {
  SpanType2["NORMAL_TEXT"] = "NORMAL_TEXT";
  SpanType2["HYPERLINK"] = "HYPERLINK";
  SpanType2["SLASHLINK"] = "SLASHLINK";
  SpanType2["WIKILINK"] = "WIKILINK";
  return SpanType2;
})(SpanType || {});

const isWhiteSpace = (string) => {
  return string.trim().length === 0;
};
const parseText = (text) => {
  const spans = [];
  const iterator = new CharIterator(text);
  let currentSpanType = null;
  let currentSpanText = "";
  while (true) {
    const step = iterator.next();
    if (step.done) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      break;
    }
    const char = step.value;
    const lastChar = iterator.peekBack();
    if ((typeof lastChar !== "string" || isWhiteSpace(lastChar)) && char === "h" && (iterator.peek(5).join("") === "ttp:/" || iterator.peek(6).join("") === "ttps:/")) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.HYPERLINK;
    } else if ((typeof lastChar !== "string" || isWhiteSpace(lastChar)) && char === "/" && currentSpanType !== SpanType.WIKILINK && /^[\p{L}\d_]$/u.test(iterator.peek(1).join("")) && (typeof iterator.charsUntil(" ") === "string" && /^[\p{L}\d_]$/u.test(iterator.charsUntil(" ").slice(-1)) || iterator.charsUntil(" ") === null && /^[\p{L}\d_]$/u.test(iterator.getRest().slice(-1)))) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.SLASHLINK;
    } else if (isWhiteSpace(char) && currentSpanType !== SpanType.NORMAL_TEXT && currentSpanType !== SpanType.WIKILINK) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.NORMAL_TEXT;
    } else if (char === "[" && iterator.peek(1).join("") === "[" && iterator.getRest().includes("]]") && !iterator.charsUntil("]]", 2)?.includes("[") && !iterator.charsUntil("]]", 2)?.includes("]")) {
      if (currentSpanType) {
        spans.push({
          type: currentSpanType,
          text: currentSpanText
        });
      }
      currentSpanText = "";
      currentSpanType = SpanType.WIKILINK;
    } else if (currentSpanType === SpanType.WIKILINK && lastChar === "]" && iterator.peekBack(2) === "]") {
      spans.push({
        type: currentSpanType,
        text: currentSpanText
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

const HEADING_SIGIL = "#";
const CODE_SIGIL = "```";
const QUOTE_SIGIL = ">";
const KEY_VALUE_PAIR_REGEX = /^\$[\p{L}\p{M}\d\-_]+(\s(.*)?)?$/u;
const ORDERED_LIST_ITEM_REGEX = /^\d+\./;
const parseHeading = (line) => ({
  type: BlockType.HEADING,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart())
  }
});
const parseKeyValuePair = (line) => ({
  type: BlockType.KEY_VALUE_PAIR,
  data: {
    key: line.substring(1).match(/^[^\s]+/)?.[0] ?? "",
    whitespace: line.substring(1).match(/\s+/g)?.[0] ?? "",
    value: parseText(
      Array.from(line.matchAll(/^[^\s]+\s*(.*)$/g))[0][1] ?? ""
    )
  }
});
const parseUnorderedListItem = (line) => ({
  type: BlockType.UNORDERED_LIST_ITEM,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart())
  }
});
const parseQuote = (line) => ({
  type: BlockType.QUOTE,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart())
  }
});
const parseOrderedListItem = (line) => ({
  type: BlockType.ORDERED_LIST_ITEM,
  data: {
    index: line.match(/^\d+/)?.[0] ?? "0",
    whitespace: line.match(/^\d+\.(\s*)/)?.[1] ?? "",
    text: parseText(line.match(/^\d+\.\s*(.*)/)?.[1] ?? "")
  }
});
const parseCode = (line) => ({
  type: BlockType.CODE,
  data: {
    code: "",
    contentType: line.substring(CODE_SIGIL.length).trim(),
    whitespace: line.substring(3).match(/^\s*/g)?.[0] ?? ""
  }
});
const parseEmpty = (line) => ({
  type: BlockType.EMPTY,
  data: { whitespace: line }
});
const parseParagraph = (line) => ({
  type: BlockType.PARAGRAPH,
  data: { text: parseText(line) }
});
const BLOCK_MATCHERS = [
  { match: (l) => l.startsWith(HEADING_SIGIL), parse: parseHeading },
  { match: (l) => KEY_VALUE_PAIR_REGEX.test(l), parse: parseKeyValuePair },
  { match: (l) => l.startsWith("- "), parse: parseUnorderedListItem },
  { match: (l) => l.startsWith(QUOTE_SIGIL), parse: parseQuote },
  {
    match: (l) => ORDERED_LIST_ITEM_REGEX.test(l),
    parse: parseOrderedListItem
  },
  { match: (l) => l.startsWith(CODE_SIGIL), parse: parseCode },
  { match: (l) => l.trim().length === 0, parse: parseEmpty }
];
const parse = (input) => {
  const lines = input.replaceAll("\r", "").split("\n");
  let withinBlock = false;
  let codeBlockJustStarted = false;
  return lines.reduce((blocks, line) => {
    if (withinBlock) {
      const currentBlock = blocks[blocks.length - 1];
      if (currentBlock.type !== BlockType.CODE) {
        throw new Error(
          "Subwaytext parser: Within unknown block: " + currentBlock.type
        );
      }
      if (line.trimEnd() === CODE_SIGIL) {
        withinBlock = false;
        return blocks;
      }
      const lineValue = line.trimEnd() === "\\" + CODE_SIGIL ? line.substring(1) : line;
      if (codeBlockJustStarted) {
        currentBlock.data.code += lineValue;
        codeBlockJustStarted = false;
      } else {
        currentBlock.data.code += "\n" + lineValue;
      }
      return blocks;
    }
    const matched = BLOCK_MATCHERS.find((m) => m.match(line));
    const newBlock = matched ? matched.parse(line) : parseParagraph(line);
    blocks.push(newBlock);
    if (newBlock.type === BlockType.CODE) {
      withinBlock = true;
      codeBlockJustStarted = true;
    }
    return blocks;
  }, []);
};
if (
  // @ts-ignore
  typeof DedicatedWorkerGlobalScope !== "undefined" && self instanceof DedicatedWorkerGlobalScope
) {
  onmessage = (event) => {
    const eventData = event.data;
    if (eventData.action === "PARSE_NOTES") {
      const notes = eventData.notes;
      if (!Array.isArray(notes)) {
        throw new Error(
          "Subwaytext worker: Expected an array of notes, received " + typeof notes + " instead."
        );
      }
      const notesParsed = notes.map((note) => {
        return {
          id: note.id,
          parsedContent: parse(note.content)
        };
      });
      postMessage(notesParsed);
    }
  };
}
