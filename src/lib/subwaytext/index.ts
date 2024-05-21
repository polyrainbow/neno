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


const parse = (input: string): Block[] => {
  const lines = input.replaceAll("\r", "").split("\n");
  let withinBlock = false;
  let codeBlockJustStarted = false;

  const blocks: Block[] = lines.reduce(
    (blocks: Block[], line: string): Block[] => {
      if (withinBlock) {
        /* within block, let's consider multiline blocks */

        const currentBlock = blocks[blocks.length - 1];

        if (currentBlock.type === BlockType.CODE) {
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
        } else {
          throw new Error(
            "Subwaytext parser: Within unknown block: " + currentBlock.type,
          );
        }
      } else { // not within block
        if (line.startsWith(HEADING_SIGIL)) {
          const newBlock: BlockHeading = {
            type: BlockType.HEADING,
            data: {
              whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
              text: parseText(line.substring(1).trimStart()),
            },
          };

          blocks.push(newBlock);

          return blocks;
        } else if (
          /^\$[\p{L}\p{M}\d\-_]+(\s(.*)?)?$/gu.test(line)
        ) {
          const newBlock: BlockKeyValuePair = {
            type: BlockType.KEY_VALUE_PAIR,
            data: {
              key: line.substring(1).match(/^[^\s]+/)?.[0] ?? "",
              whitespace: line.substring(1).match(/\s+/g)?.[0] ?? "",
              value: parseText(
                Array.from(line.matchAll(/^[^\s]+\s*(.*)$/g))[0][1] ?? "",
              ),
            },
          };

          blocks.push(newBlock);

          return blocks;
        } else if (line.startsWith("-")) {
          const newBlock: UnorderedListItemBlock = {
            type: BlockType.UNORDERED_LIST_ITEM,
            data: {
              whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
              text: parseText(line.substring(1).trimStart()),
            },
          };

          blocks.push(newBlock);
          return blocks;
        } else if (line.startsWith(QUOTE_SIGIL)) {
          const newBlock: BlockQuote = {
            type: BlockType.QUOTE,
            data: {
              whitespace: line.substring(1).match(/^\s*/g)?.[0] ?? "",
              text: parseText(line.substring(1).trimStart()),
            },
          };

          blocks.push(newBlock);
          return blocks;
        } else if (line.match(/^\d+\./)) {
          const index = line.match(/^\d+/)?.[0] ?? "0";
          const whitespace = line.match(/^\d+\.(\s*)/)?.[1] ?? "";
          const textString = line.match(/^\d+\.\s*(.*)/)?.[1] ?? "";

          const newBlock: OrderedListItemBlock = {
            type: BlockType.ORDERED_LIST_ITEM,
            data: {
              index,
              whitespace,
              text: parseText(textString),
            },
          };

          blocks.push(newBlock);

          return blocks;
        } else if (
          line.startsWith(CODE_SIGIL)
        ) {
          withinBlock = true;
          codeBlockJustStarted = true;

          const newBlock: BlockCode = {
            type: BlockType.CODE,
            data: {
              code: "",
              contentType: line.substring(CODE_SIGIL.length).trim(),
              whitespace: line.substring(3).match(/^\s*/g)?.[0] ?? "",
            },
          };

          blocks.push(newBlock);

          return blocks;
        } else if (line.trim().length === 0) {
          const newBlock: BlockEmpty = {
            type: BlockType.EMPTY,
            data: {
              whitespace: line,
            },
          };

          blocks.push(newBlock);
          return blocks;
        } else {
          const newBlock: BlockParagraph = {
            type: BlockType.PARAGRAPH,
            data: {
              text: parseText(line),
            },
          };

          blocks.push(newBlock);
          return blocks;
        }
      }

      return blocks;
    },
    [],
  );

  return blocks;
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
  typeof WorkerGlobalScope !== "undefined"
  // @ts-ignore
  && self instanceof WorkerGlobalScope
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
