import {
  Block,
  BlockCode,
  BlockEmpty,
  BlockHeading,
  BlockParagraph,
  BlockQuote,
  BlockType,
  InlineText,
  OrderedListItemBlock,
  Span,
  UnorderedListItemBlock,
} from "./interfaces/Block";

function serializeInlineText(spans: InlineText): string {
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

function serializeQuote(block: BlockQuote): string {
  return ">" + block.data.whitespace + serializeInlineText(block.data.text);
}

function serializeEmpty(block: BlockEmpty): string {
  return block.data.whitespace;
}

function serializeCode(block: BlockCode): string {
  return "```"
    + block.data.whitespace
    + block.data.contentType
    + "\n" + block.data.code + "\n```";
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
        return serializeCode(block);
      case BlockType.QUOTE:
        return serializeQuote(block);
      case BlockType.EMPTY:
        return serializeEmpty(block);
    }
  }).join("\n");
}
