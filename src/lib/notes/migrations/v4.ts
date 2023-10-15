import { FileInfo } from "../types/FileInfo";
import { Slug } from "../types/Slug";
import { GraphMetadata as GraphMetadataV4 } from "../types/Graph";
import StorageProvider from "../types/StorageProvider";

export interface GraphMetadataV3 {
  readonly createdAt: number,
  updatedAt: number,
  screenPosition: {
    translateX: number,
    translateY: number,
    scale: number,
  },
  initialNodePosition: {
    x: number,
    y: number,
  },
  pinnedNotes: Slug[],
  files: FileInfo[],
  version: "3",
}

export const migrateToV4 = async (
  metadata: GraphMetadataV3,
  storageProvider: StorageProvider,
): Promise<{
  metadata: GraphMetadataV4,
}> => {
  const initialNodePosition = metadata.initialNodePosition;
  const screenPosition = metadata.screenPosition;

  const newMetadata: GraphMetadataV4 = {
    createdAt: metadata.createdAt,
    updatedAt: metadata.updatedAt,
    pinnedNotes: metadata.pinnedNotes,
    files: metadata.files,
    version: "4",
  };

  const visualMetadata = {
    version: "1",
    initialNodePosition,
    screenPosition,
  };

  await storageProvider.writeObject(
    ".neno-visual.json",
    JSON.stringify(visualMetadata, null, "  "),
  );

  return {
    metadata: newMetadata,
  };
};
