import {
  Block,
  BlockCode,
  BlockEmpty,
  BlockHeading,
  BlockKeyValuePair,
  BlockParagraph,
  BlockQuote,
  BlockType,
  InlineText,
  OrderedListItemBlock,
  Span,
  UnorderedListItemBlock,
} from "./types/Block";

export function serializeInlineText(spans: InlineText): string {
  return spans.reduce((acc: string, span: Span) => {
    return acc + span.text;
  }, "");
}

function serializeParagraph(block: BlockParagraph): string {
  return serializeInlineText(block.data.text);
}

function serializeHeading(block: BlockHeading): string {
  return "#" + block.data.whitespace + serializeInlineText(block.data.text);
}

function serializeKeyValuePair(block: BlockKeyValuePair): string {
  return "$"
    + block.data.key
    + block.data.whitespace
    + serializeInlineText(block.data.value);
}

function serializeQuote(block: BlockQuote): string {
  return ">" + block.data.whitespace + serializeInlineText(block.data.text);
}

function serializeEmpty(block: BlockEmpty): string {
  return block.data.whitespace;
}

function serializeCodeString(code: string): string {
  return code.replace(/^```(.*)/gm, "\\```$1");
}

function serializeCodeBlock(block: BlockCode): string {
  return "```"
    + block.data.whitespace
    + block.data.contentType
    + "\n" + serializeCodeString(block.data.code) + "\n```";
}

function serializeUnorderedListItem(block: UnorderedListItemBlock): string {
  return "-" + block.data.whitespace + serializeInlineText(block.data.text);
}

function serializeOrderedListItem(block: OrderedListItemBlock): string {
  return block.data.index + "."
    + block.data.whitespace + serializeInlineText(block.data.text);
}

export default function serialize(blocks: Block[]): string {
  return blocks.map((block: Block) => {
    switch (block.type) {
      case BlockType.PARAGRAPH:
        return serializeParagraph(block);
      case BlockType.HEADING:
        return serializeHeading(block);
      case BlockType.UNORDERED_LIST_ITEM:
        return serializeUnorderedListItem(block);
      case BlockType.ORDERED_LIST_ITEM:
        return serializeOrderedListItem(block);
      case BlockType.CODE:
        return serializeCodeBlock(block);
      case BlockType.QUOTE:
        return serializeQuote(block);
      case BlockType.KEY_VALUE_PAIR:
        return serializeKeyValuePair(block);
      case BlockType.EMPTY:
        return serializeEmpty(block);
    }
  }).join("\n");
}
