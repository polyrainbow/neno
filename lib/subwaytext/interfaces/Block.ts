import { SpanType } from "./SpanType";

export enum BlockType {
  PARAGRAPH = "paragraph",
  URL = "url",
  SLASHLINK = "slashlink",
  HEADING = "heading",
  LIST = "list",
  CODE = "code",
}


export interface Span {
  type: SpanType,
  text: string,
}

export type RunningText = Span[];

interface BlockParagraphData {
  text: RunningText,
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
  items: RunningText[],
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

export type Block = (
  BlockParagraph
  | BlockUrl
  | ListBlock
  | BlockHeading
  | BlockCode
  | BlockSlashlink
);

export type MultiLineBlock = (
  BlockParagraph
  | ListBlock
  | BlockCode
);

