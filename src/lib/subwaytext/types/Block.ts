import { SpanType } from "./SpanType";

export enum BlockType {
  PARAGRAPH = "paragraph",
  HEADING = "heading",
  UNORDERED_LIST_ITEM = "unordered-list-item",
  ORDERED_LIST_ITEM = "ordered-list-item",
  CODE = "code",
  QUOTE = "quote",
  KEY_VALUE_PAIR = "key-value-pair",
  EMPTY = "empty",
}


export interface Span {
  type: SpanType,
  text: string,
}

export type InlineText = Span[];

interface BlockParagraphData {
  text: InlineText,
}

export interface BlockParagraph {
  readonly type: BlockType.PARAGRAPH,
  data: BlockParagraphData,
}

interface InlineTextWithWhitespace {
  text: InlineText,
  whitespace: string,
}

export interface BlockHeading {
  readonly type: BlockType.HEADING,
  data: InlineTextWithWhitespace,
}

interface KeyValuePairBlockData {
  key: string,
  value: InlineText,
  whitespace: string,
}

export interface BlockKeyValuePair {
  readonly type: BlockType.KEY_VALUE_PAIR,
  data: KeyValuePairBlockData,
}

export interface UnorderedListItemBlock {
  readonly type: BlockType.UNORDERED_LIST_ITEM,
  data: InlineTextWithWhitespace,
}

export interface OrderedListItemBlockData extends InlineTextWithWhitespace {
  index: string,
}

export interface OrderedListItemBlock {
  readonly type: BlockType.ORDERED_LIST_ITEM,
  data: OrderedListItemBlockData,
}


interface BlockCodeData {
  code: string,
  contentType: string,
  whitespace: string,
}

export interface BlockCode {
  readonly type: BlockType.CODE,
  data: BlockCodeData,
}


export interface BlockQuote {
  readonly type: BlockType.QUOTE,
  data: InlineTextWithWhitespace,
}

export interface BlockEmpty {
  readonly type: BlockType.EMPTY,
  data: {
    whitespace: string,
  },
}

export type Block = (
  BlockParagraph
  | UnorderedListItemBlock
  | OrderedListItemBlock
  | BlockHeading
  | BlockCode
  | BlockQuote
  | BlockKeyValuePair
  | BlockEmpty
);

export type MultiLineBlock = (
  BlockCode
);

