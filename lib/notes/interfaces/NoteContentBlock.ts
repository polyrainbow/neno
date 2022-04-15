import { FileId } from "./FileId";

export enum NoteContentBlockType {
  PARAGRAPH = "paragraph",
  LINK = "link",
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
  meta: {
    title: string,
    image: {
      url: string | null,
    },
    description: string,
  },
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


interface NoteContentBlockFileMetadata {
  extension: string,
  fileId: FileId,
  name: string,
  size: number,
}


interface NoteContentBlockImageData {
  file: NoteContentBlockFileMetadata,
  caption: string,
  withBackground: boolean,
}

export interface NoteContentBlockImage {
  readonly type: NoteContentBlockType.IMAGE,
  data: NoteContentBlockImageData,
}


interface NoteContentBlockDocumentData {
  file: NoteContentBlockFileMetadata,
}

export interface NoteContentBlockDocument {
  readonly type: NoteContentBlockType.DOCUMENT,
  data: NoteContentBlockDocumentData,
}


interface NoteContentBlockAudioData {
  file: NoteContentBlockFileMetadata,
}

export interface NoteContentBlockAudio {
  readonly type: NoteContentBlockType.AUDIO,
  data: NoteContentBlockAudioData,
}


interface NoteContentBlockVideoData {
  file: NoteContentBlockFileMetadata,
}

export interface NoteContentBlockVideo {
  readonly type: NoteContentBlockType.VIDEO,
  data: NoteContentBlockVideoData,
}


export type NoteContentBlockWithFile = (
  NoteContentBlockImage
  | NoteContentBlockDocument
  | NoteContentBlockAudio
  | NoteContentBlockVideo
);


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
