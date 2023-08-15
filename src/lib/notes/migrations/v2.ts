import { FILE_SLUG_PREFIX } from "../config";
import ExistingNote from "../interfaces/ExistingNote";
import NodePosition from "../interfaces/NodePosition";
import ScreenPosition from "../interfaces/ScreenPosition";
import { Slug } from "../interfaces/Slug";
import {
  getSlugFromFilename,
  mapInlineSpans,
} from "../noteUtils";
import subwaytext from "../../subwaytext/index";
import { Span } from "../../subwaytext/interfaces/Block";
import { SpanType } from "../../subwaytext/interfaces/SpanType";
import serialize from "../../subwaytext/serialize";
import StorageProvider from "../interfaces/StorageProvider";

export interface FileInfoV1 {
  fileId: string,
  name: string,
  createdAt: number,
  size: number,
}

export interface GraphMetadataV1 {
  readonly createdAt: number,
  updatedAt: number,
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
  pinnedNotes: Slug[],
  files: FileInfoV1[],
}

export interface FileInfoV2 {
  slug: Slug,
  size: number,
  readonly createdAt: number,
}

interface GraphMetadataV2 {
  readonly createdAt: number,
  updatedAt: number,
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
  pinnedNotes: Slug[],
  files: FileInfoV2[],
  version: "2",
}

type FileId = string;


const migrateMetadataToV2 = (metadata: GraphMetadataV1): {
  newMetadata: GraphMetadataV2,
  filesMap: Map<FileId, FileInfoV2>,
} => {
  const existingFiles: Map<FileId, FileInfoV2> = new Map();

  const newMetadata: GraphMetadataV2 = {
    ...metadata,
    files: metadata.files.map((file: FileInfoV1) => {
      const slug = getSlugFromFilename(
        file.name,
        Array.from(existingFiles.values()),
      );
      const newFileInfo: FileInfoV2 = {
        slug,
        size: file.size,
        createdAt: file.createdAt,
      };
      existingFiles.set(file.fileId, newFileInfo);
      return newFileInfo;
    }),
    version: "2",
  };

  return {
    newMetadata,
    filesMap: existingFiles,
  };
};


const renameFiles = async (
  filesMap: Map<FileId, FileInfoV2>,
  storageProvider: StorageProvider,
): Promise<void> => {
  for (const [fileId, fileInfo] of filesMap.entries()) {
    await storageProvider.renameFile(
      "files/" + fileId,
      fileInfo.slug,
    );
  }
};


export const migrateToV2 = async (
  metadata: GraphMetadataV1,
  notes: ExistingNote[],
  storageProvider: StorageProvider,
): Promise<{
  metadata: GraphMetadataV2,
  notes: ExistingNote[],
}> => {
  const { newMetadata, filesMap } = migrateMetadataToV2(metadata);

  await renameFiles(filesMap, storageProvider);

  const newNotes = notes.map((note: ExistingNote): ExistingNote => {
    const blocks = subwaytext(note.content);
    const newBlocks = mapInlineSpans(blocks, (span: Span): Span => {
      if (
        span.type === SpanType.SLASHLINK
        && span.text.substring(1).startsWith(FILE_SLUG_PREFIX)
      ) {
        const fileId = span.text
          .substring(1)
          .substring(FILE_SLUG_PREFIX.length);
        const file = filesMap.get(fileId);
        if (!file) {
          return span;
        }
        const newSlug = file.slug;
        span.text = "/" + newSlug;
      }
      return span;
    });
    const newNoteContent = serialize(newBlocks);
    return {
      ...note,
      content: newNoteContent,
    };
  });

  return {
    metadata: newMetadata,
    notes: newNotes,
  };
};
