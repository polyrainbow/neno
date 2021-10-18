export enum NoteContentBlockType {
  PARAGRAPH = "paragraph",
  LINK = "linkTool",
  HEADING = "header",
  IMAGE = "image",
  DOCUMENT = "document",
  AUDIO = "audio",
  VIDEO = "video",
  LIST = "list",
  CODE = "code",
}


interface NoteContentBlockParagraphData {
  text: string,
}

export interface NoteContentBlockParagraph {
  readonly type: NoteContentBlockType.PARAGRAPH,
  data: NoteContentBlockParagraphData,
}


interface NoteContentBlockLinkData {
  link: string,
  meta: any,
}

export interface NoteContentBlockLink {
  readonly type: NoteContentBlockType.LINK,
  data: NoteContentBlockLinkData,
}


interface NoteContentBlockHeadingData {
  text: string,
  level: number,
}

export interface NoteContentBlockHeading {
  readonly type: NoteContentBlockType.HEADING,
  data: NoteContentBlockHeadingData,
}


interface NoteContentBlockListData {
  items: string[],
}

export interface NoteContentBlockList {
  readonly type: NoteContentBlockType.LIST,
  data: NoteContentBlockListData,
}


interface NoteContentBlockCodeData {
  code: string,
}

export interface NoteContentBlockCode {
  readonly type: NoteContentBlockType.CODE,
  data: NoteContentBlockCodeData,
}


interface NoteContentBlockImageData {
  file: any,
  caption: string,
  withBackground: boolean,
}

export interface NoteContentBlockImage {
  readonly type: NoteContentBlockType.IMAGE,
  data: NoteContentBlockImageData,
}


interface NoteContentBlockDocumentData {
  file: any,
}

export interface NoteContentBlockDocument {
  readonly type: NoteContentBlockType.DOCUMENT,
  data: NoteContentBlockDocumentData,
}


interface NoteContentBlockAudioData {
  file: any,
}

export interface NoteContentBlockAudio {
  readonly type: NoteContentBlockType.AUDIO,
  data: NoteContentBlockAudioData,
}


interface NoteContentBlockVideoData {
  file: any,
}

export interface NoteContentBlockVideo {
  readonly type: NoteContentBlockType.VIDEO,
  data: NoteContentBlockVideoData,
}

type NoteContentBlock = (
  NoteContentBlockParagraph
  | NoteContentBlockLink
  | NoteContentBlockList
  | NoteContentBlockHeading
  | NoteContentBlockCode
  | NoteContentBlockImage
  | NoteContentBlockDocument
  | NoteContentBlockAudio
  | NoteContentBlockVideo
);


export default NoteContentBlock;
