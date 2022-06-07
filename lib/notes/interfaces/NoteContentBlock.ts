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


export interface NoteContentBlockFileMetadata {
  extension: string,
  fileId: FileId,
  name: string,
  size: number,
}


interface NoteContentBlockImageData<FileObjectType> {
  file: FileObjectType,
  caption?: string,
  withBackground?: boolean,
}

export interface NoteContentBlockImage<FileObjectType> {
  readonly type: NoteContentBlockType.IMAGE,
  data: NoteContentBlockImageData<FileObjectType>,
}


interface NoteContentBlockDocumentData<FileObjectType> {
  file: FileObjectType,
}

export interface NoteContentBlockDocument<FileObjectType> {
  readonly type: NoteContentBlockType.DOCUMENT,
  data: NoteContentBlockDocumentData<FileObjectType>,
}


interface NoteContentBlockAudioData<FileObjectType> {
  file: FileObjectType,
}

export interface NoteContentBlockAudio<FileObjectType> {
  readonly type: NoteContentBlockType.AUDIO,
  data: NoteContentBlockAudioData<FileObjectType>,
}


interface NoteContentBlockVideoData<FileObjectType> {
  file: FileObjectType,
}

export interface NoteContentBlockVideo<FileObjectType> {
  readonly type: NoteContentBlockType.VIDEO,
  data: NoteContentBlockVideoData<FileObjectType>,
}


/*
  NoteContentBlockWithFile = a block that may or may not contain file metadata 
  NoteContentBlockWithFileLoaded = a NoteContentBlockWithFile that definitely
  contains valid file metadata
*/
export type NoteContentBlockWithFile = (
  NoteContentBlockImage<NoteContentBlockFileMetadata | undefined>
  | NoteContentBlockDocument<NoteContentBlockFileMetadata | undefined>
  | NoteContentBlockAudio<NoteContentBlockFileMetadata | undefined>
  | NoteContentBlockVideo<NoteContentBlockFileMetadata | undefined>
);

export type NoteContentBlockWithFileLoaded = (
  NoteContentBlockImage<NoteContentBlockFileMetadata>
  | NoteContentBlockDocument<NoteContentBlockFileMetadata>
  | NoteContentBlockAudio<NoteContentBlockFileMetadata>
  | NoteContentBlockVideo<NoteContentBlockFileMetadata>
);


type NoteContentBlock = (
  NoteContentBlockParagraph
  | NoteContentBlockLink
  | NoteContentBlockList
  | NoteContentBlockHeading
  | NoteContentBlockCode
  | NoteContentBlockWithFile
);


export default NoteContentBlock;
