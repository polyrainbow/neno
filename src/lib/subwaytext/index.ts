import {
  Block,
  BlockCode,
  BlockEmpty,
  BlockHeading,
  BlockKeyValuePair,
  BlockParagraph,
  BlockQuote,
  BlockType,
  OrderedListItemBlock,
  UnorderedListItemBlock,
} from "./types/Block.js";
import { parseText } from "./utils.js";

export const HEADING_SIGIL = "#";
export const CODE_SIGIL = "```";
export const QUOTE_SIGIL = ">";


const KEY_VALUE_PAIR_REGEX = /^\$[\p{L}\p{M}\d\-_]+(\s(.*)?)?$/u;
const ORDERED_LIST_ITEM_REGEX = /^\d+\./;


const parseHeading = (line: string): BlockHeading => ({
  type: BlockType.HEADING,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart()),
  },
});


const parseKeyValuePair = (line: string): BlockKeyValuePair => ({
  type: BlockType.KEY_VALUE_PAIR,
  data: {
    key: line.substring(1).match(/^[^\s]+/)?.[0] ?? "",
    whitespace: line.substring(1).match(/\s+/g)?.[0] ?? "",
    value: parseText(
      Array.from(line.matchAll(/^[^\s]+\s*(.*)$/g))[0][1] ?? "",
    ),
  },
});


const parseUnorderedListItem = (line: string): UnorderedListItemBlock => ({
  type: BlockType.UNORDERED_LIST_ITEM,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart()),
  },
});


const parseQuote = (line: string): BlockQuote => ({
  type: BlockType.QUOTE,
  data: {
    whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
    text: parseText(line.substring(1).trimStart()),
  },
});


const parseOrderedListItem = (line: string): OrderedListItemBlock => ({
  type: BlockType.ORDERED_LIST_ITEM,
  data: {
    index: line.match(/^\d+/)?.[0] ?? "0",
    whitespace: line.match(/^\d+\.(\s*)/)?.[1] ?? "",
    text: parseText(line.match(/^\d+\.\s*(.*)/)?.[1] ?? ""),
  },
});


const parseCode = (line: string): BlockCode => ({
  type: BlockType.CODE,
  data: {
    code: "",
    contentType: line.substring(CODE_SIGIL.length).trim(),
    whitespace: line.substring(3).match(/^\s*/g)?.[0] ?? "",
  },
});


const parseEmpty = (line: string): BlockEmpty => ({
  type: BlockType.EMPTY,
  data: { whitespace: line },
});


const parseParagraph = (line: string): BlockParagraph => ({
  type: BlockType.PARAGRAPH,
  data: { text: parseText(line) },
});


// Dispatch table: first matching entry wins. Order matters where shapes
// overlap (e.g. a heading line also has non-empty trim length, so HEADING
// must precede EMPTY/PARAGRAPH). PARAGRAPH is the fallback for everything
// that no entry matches.
const BLOCK_MATCHERS: {
  match: (line: string) => boolean;
  parse: (line: string) => Block;
}[] = [
  { match: (l) => l.startsWith(HEADING_SIGIL), parse: parseHeading },
  { match: (l) => KEY_VALUE_PAIR_REGEX.test(l), parse: parseKeyValuePair },
  { match: (l) => l.startsWith("- "), parse: parseUnorderedListItem },
  { match: (l) => l.startsWith(QUOTE_SIGIL), parse: parseQuote },
  {
    match: (l) => ORDERED_LIST_ITEM_REGEX.test(l),
    parse: parseOrderedListItem,
  },
  { match: (l) => l.startsWith(CODE_SIGIL), parse: parseCode },
  { match: (l) => l.trim().length === 0, parse: parseEmpty },
];


const parse = (input: string): Block[] => {
  const lines = input.replaceAll("\r", "").split("\n");
  let withinBlock = false;
  let codeBlockJustStarted = false;

  return lines.reduce((blocks: Block[], line: string): Block[] => {
    if (withinBlock) {
      /* within block, let's consider multiline blocks */
      const currentBlock = blocks[blocks.length - 1];

      if (currentBlock.type !== BlockType.CODE) {
        throw new Error(
          "Subwaytext parser: Within unknown block: " + currentBlock.type,
        );
      }

      if (line.trimEnd() === CODE_SIGIL) {
        withinBlock = false;
        return blocks;
      }

      const lineValue = (line.trimEnd() === "\\" + CODE_SIGIL)
        ? line.substring(1)
        : line;

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

interface UnparsedDocument {
  id: string;
  content: string;
}

interface ParsedDocument {
  id: string;
  parsedContent: Block[];
}

if (
  // @ts-ignore
  typeof DedicatedWorkerGlobalScope !== "undefined"
  // @ts-ignore
  && self instanceof DedicatedWorkerGlobalScope
) {
  onmessage = (event) => {
    const eventData = event.data;

    if (eventData.action === "PARSE_NOTES") {
      const notes = eventData.notes;

      if (!Array.isArray(notes)) {
        throw new Error(
          "Subwaytext worker: Expected an array of notes, received "
          + typeof notes
          + " instead.",
        );
      }

      const notesParsed: ParsedDocument[]
        = (notes as UnparsedDocument[])
          .map((note: UnparsedDocument) => {
            return {
              id: note.id,
              parsedContent: parse(note.content),
            };
          });

      postMessage(notesParsed);
    }
  };
}

export default parse;
