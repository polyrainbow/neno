import { SpanType } from "./SpanType";

export enum BlockType {
  PARAGRAPH = "paragraph",
  URL = "url",
  SLASHLINK = "slashlink",
  HEADING = "heading",
  LIST = "list",
  CODE = "code",
  QUOTE = "quote",
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


export interface BlockLinkData {
  url: string,
  text: string,
}

export interface BlockUrl {
  readonly type: BlockType.URL,
  data: BlockLinkData,
}

interface BlockSlashlinkData {
  link: string,
  text: string,
}

export interface BlockSlashlink {
  readonly type: BlockType.SLASHLINK,
  data: BlockSlashlinkData,
}

interface BlockHeadingData {
  text: string,
}

export interface BlockHeading {
  readonly type: BlockType.HEADING,
  data: BlockHeadingData,
}

export enum ListBlockStyle {
  UNORDERED = "unordered",
  ORDERED = "ordered",
}

interface BlockListData {
  items: InlineText[],
  type: ListBlockStyle,
}

export interface ListBlock {
  readonly type: BlockType.LIST,
  data: BlockListData,
}

interface BlockCodeData {
  code: string,
  contentType: string,
}

export interface BlockCode {
  readonly type: BlockType.CODE,
  data: BlockCodeData,
}

interface BlockQuoteData {
  text: InlineText,
}

export interface BlockQuote {
  readonly type: BlockType.QUOTE,
  data: BlockQuoteData,
}

export type Block = (
  BlockParagraph
  | BlockUrl
  | ListBlock
  | BlockHeading
  | BlockCode
  | BlockSlashlink
  | BlockQuote
);

export type MultiLineBlock = (
  BlockParagraph
  | ListBlock
  | BlockCode
  | BlockQuote
);

