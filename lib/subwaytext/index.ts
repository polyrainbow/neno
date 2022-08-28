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


export default (input: string): Block[] => {
  const lines = input.replaceAll("\r", "").split("\n");
  let withinBlock = false;
  let codeBlockJustStarted = false;

  const blocks: Block[] = lines.reduce(
    (blocks: Block[], line: string): Block[] => {
      if (withinBlock) {
        /* within block, let's consider multiline blocks */

        const currentBlock = blocks[blocks.length - 1];

        if (
          currentBlock.type === BlockType.LIST
            && currentBlock.data.type === ListBlockStyle.UNORDERED
        ) {
          if (line.startsWith("-")) {
            currentBlock.data.items.push(line.substring(1).trimStart());
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
              .push(line.substring(posOfDot + 1).trimStart());
            return blocks;
          } else {
            withinBlock = false;
          }
        } else if (currentBlock.type === BlockType.PARAGRAPH) {
          if (line.trim().length === 0) {
            withinBlock = false;
            return blocks;
          } else {
            currentBlock.data.text += "\n" + line;
            return blocks;
          }
        } else if (currentBlock.type === BlockType.CODE) {
          if (line === "<>") {
            withinBlock = false;
            return blocks;
          }

          if (codeBlockJustStarted) {
            currentBlock.data.code += line;
            codeBlockJustStarted = false;
          } else {
            currentBlock.data.code += "\n" + line;
          }
          return blocks;
        }
      }

      if (!withinBlock) {
        if (line.startsWith("#")) {
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
              items: [line.substring(1).trimStart()],
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
              items: [line.substring(2).trimStart()],
              type: ListBlockStyle.ORDERED,
            },
          };

          blocks.push(newBlock);

          return blocks;
        } else if (line.startsWith("/")) {
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
          line === "<>"
        ) {
          withinBlock = true;
          codeBlockJustStarted = true;

          const newBlock: BlockCode = {
            type: BlockType.CODE,
            data: {
              code: "",
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
          const newBlock: BlockParagraph = {
            type: BlockType.PARAGRAPH,
            data: {
              text: line,
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