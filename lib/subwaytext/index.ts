import {
  Block,
  BlockCode,
  BlockHeading,
  BlockParagraph,
  BlockSlashlink,
  BlockType,
  BlockUrl,
  ListBlock,
  ListBlockStyle,
} from "./interfaces/Block.js";
import { parseText } from "./utils.js";

export const HEADING_SIGIL = "#";
export const CODE_SIGIL = "```";
export const SLASHLINK_SIGIL = "/";


export default (input: string): Block[] => {
  const lines = input.replaceAll("\r", "").split("\n");
  let lineIndex = -1;
  let withinBlock = false;
  let codeBlockJustStarted = false;
  let multilineTextCollector = "";

  const blocks: Block[] = lines.reduce(
    (blocks: Block[], line: string): Block[] => {
      lineIndex++;

      if (withinBlock) {
        /* within block, let's consider multiline blocks */

        const currentBlock = blocks[blocks.length - 1];

        if (
          currentBlock.type === BlockType.LIST
            && currentBlock.data.type === ListBlockStyle.UNORDERED
        ) {
          if (line.startsWith("-")) {
            currentBlock.data.items.push(
              parseText(line.substring(1).trimStart()),
            );
            return blocks;
          } else {
            withinBlock = false;
          }
        } else if (
          currentBlock.type === BlockType.LIST
            && currentBlock.data.type === ListBlockStyle.ORDERED
        ) {
          if (line.match(/^[0-9]+\./g) !== null) {
            const posOfDot = line.indexOf(".");
            currentBlock.data.items
              .push(parseText(line.substring(posOfDot + 1).trimStart()));
            return blocks;
          } else {
            withinBlock = false;
          }
        } else if (currentBlock.type === BlockType.PARAGRAPH) {
          if (line.trim().length === 0) {
            withinBlock = false;
            currentBlock.data.text = parseText(multilineTextCollector);
            multilineTextCollector = "";
            return blocks;
          } else if (lineIndex === lines.length - 1) {
            withinBlock = false;
            multilineTextCollector += "\n" + line;
            currentBlock.data.text = parseText(multilineTextCollector);
            multilineTextCollector = "";
            return blocks;
          } else {
            multilineTextCollector += "\n" + line;
            return blocks;
          }
        } else if (currentBlock.type === BlockType.CODE) {
          if (line === CODE_SIGIL) {
            withinBlock = false;
            return blocks;
          }

          const lineValue = (line === "\\" + CODE_SIGIL)
            ? CODE_SIGIL
            : line;

          if (codeBlockJustStarted) {
            currentBlock.data.code += lineValue;
            codeBlockJustStarted = false;
          } else {
            currentBlock.data.code += "\n" + lineValue;
          }
          return blocks;
        }
      }

      if (!withinBlock) {
        if (line.startsWith(HEADING_SIGIL)) {
          const newBlock: BlockHeading = {
            type: BlockType.HEADING,
            data: {
              text: line.substring(1).trimStart(),
            },
          };

          blocks.push(newBlock);

          return blocks;
        } else if (line.startsWith("-")) {
          withinBlock = true;
          const newBlock: ListBlock = {
            type: BlockType.LIST,
            data: {
              items: [parseText(line.substring(1).trimStart())],
              type: ListBlockStyle.UNORDERED,
            },
          };

          blocks.push(newBlock);

          return blocks;
        } else if (line.startsWith("1.")) {
          withinBlock = true;
          const newBlock: ListBlock = {
            type: BlockType.LIST,
            data: {
              items: [parseText(line.substring(2).trimStart())],
              type: ListBlockStyle.ORDERED,
            },
          };

          blocks.push(newBlock);

          return blocks;
        } else if (line.startsWith(SLASHLINK_SIGIL)) {
          const link = line.substring(1).trim().split(/\s+/)[0];
          const text = line.substring(1).substring(link.length).trim();
          const newBlock: BlockSlashlink = {
            type: BlockType.SLASHLINK,
            data: {
              link,
              text,
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
            },
          };

          blocks.push(newBlock);

          return blocks;
        } else if (
          line.startsWith("http:/")
            || line.startsWith("https:/")
        ) {
          const link = line.trim().split(/\s+/)[0];
          const text = line.substring(link.length).trim();

          const newBlock: BlockUrl = {
            type: BlockType.URL,
            data: {
              url: link,
              text,
            },
          };

          blocks.push(newBlock);

          return blocks;
        } else if (line.trim().length === 0) {
          return blocks;
        } else {
          withinBlock = true;
          multilineTextCollector = line;
          const newBlock: BlockParagraph = {
            type: BlockType.PARAGRAPH,
            data: {
              text: [],
            },
          };

          blocks.push(newBlock);

          if (lineIndex === lines.length - 1) {
            withinBlock = false;
            newBlock.data.text
              = parseText(multilineTextCollector);
            multilineTextCollector = "";
            return blocks;
          }

          return blocks;
        }
      }
      
      return blocks;
    },
    [],
  );


      
  return blocks;
};