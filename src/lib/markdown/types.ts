export enum MarkdownSpanType {
  TEXT = "text",
  CODE = "code",
  STRONG = "strong",
  EMPHASIS = "emphasis",
  STRIKETHROUGH = "strikethrough",
  LINK = "link",
  IMAGE = "image",
  LINE_BREAK = "line-break",
}

export interface MarkdownSpanText {
  readonly type: MarkdownSpanType.TEXT,
  text: string,
}

export interface MarkdownSpanCode {
  readonly type: MarkdownSpanType.CODE,
  text: string,
}

export interface MarkdownSpanStrong {
  readonly type: MarkdownSpanType.STRONG,
  children: MarkdownSpan[],
}

export interface MarkdownSpanEmphasis {
  readonly type: MarkdownSpanType.EMPHASIS,
  children: MarkdownSpan[],
}

export interface MarkdownSpanStrikethrough {
  readonly type: MarkdownSpanType.STRIKETHROUGH,
  children: MarkdownSpan[],
}

export interface MarkdownSpanLink {
  readonly type: MarkdownSpanType.LINK,
  url: string,
  title: string | null,
  children: MarkdownSpan[],
}

export interface MarkdownSpanImage {
  readonly type: MarkdownSpanType.IMAGE,
  url: string | null,
  alt: string,
  title: string | null,
}

export interface MarkdownSpanLineBreak {
  readonly type: MarkdownSpanType.LINE_BREAK,
}

export type MarkdownSpan
  = | MarkdownSpanText
  | MarkdownSpanCode
  | MarkdownSpanStrong
  | MarkdownSpanEmphasis
  | MarkdownSpanStrikethrough
  | MarkdownSpanLink
  | MarkdownSpanImage
  | MarkdownSpanLineBreak;


export enum MarkdownBlockType {
  HEADING = "heading",
  PARAGRAPH = "paragraph",
  CODE = "code",
  QUOTE = "quote",
  LIST = "list",
  TABLE = "table",
  HORIZONTAL_RULE = "horizontal-rule",
}

export enum MarkdownColumnAlignment {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export interface MarkdownBlockHeading {
  readonly type: MarkdownBlockType.HEADING,
  level: number,
  text: MarkdownSpan[],
}

export interface MarkdownBlockParagraph {
  readonly type: MarkdownBlockType.PARAGRAPH,
  text: MarkdownSpan[],
}

export interface MarkdownBlockCode {
  readonly type: MarkdownBlockType.CODE,
  language: string | null,
  code: string,
}

export interface MarkdownBlockQuote {
  readonly type: MarkdownBlockType.QUOTE,
  children: MarkdownBlock[],
}

export interface MarkdownListItem {
  checked: boolean | null,
  children: MarkdownBlock[],
}

export interface MarkdownBlockList {
  readonly type: MarkdownBlockType.LIST,
  ordered: boolean,
  start: number,
  items: MarkdownListItem[],
}

export interface MarkdownBlockTable {
  readonly type: MarkdownBlockType.TABLE,
  header: MarkdownSpan[][],
  alignments: (MarkdownColumnAlignment | null)[],
  rows: MarkdownSpan[][][],
}

export interface MarkdownBlockHorizontalRule {
  readonly type: MarkdownBlockType.HORIZONTAL_RULE,
}

export type MarkdownBlock
  = | MarkdownBlockHeading
  | MarkdownBlockParagraph
  | MarkdownBlockCode
  | MarkdownBlockQuote
  | MarkdownBlockList
  | MarkdownBlockTable
  | MarkdownBlockHorizontalRule;
