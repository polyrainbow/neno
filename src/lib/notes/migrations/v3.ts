import ExistingNote from "../interfaces/ExistingNote";
import { FileInfo } from "../interfaces/FileInfo";
import NodePosition from "../interfaces/NodePosition";
import ScreenPosition from "../interfaces/ScreenPosition";
import { Slug } from "../interfaces/Slug";

export interface GraphMetadataV2 {
  readonly createdAt: number,
  updatedAt: number,
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
  pinnedNotes: Slug[],
  files: FileInfo[],
  version: "2",
}

export interface GraphMetadataV3 {
  readonly createdAt: number,
  updatedAt: number,
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
  pinnedNotes: Slug[],
  files: FileInfo[],
  version: "3",
}

export const migrateToV3 = async (
  metadata: GraphMetadataV2,
  notes: Map<Slug, ExistingNote>,
): Promise<{
  metadata: GraphMetadataV3,
  notes: Map<Slug, ExistingNote>,
}> => {
  const newMetadata: GraphMetadataV3 = {
    ...metadata,
    version: "3",
  };

  for (const note of notes.values()) {
    delete note.meta.custom.slug;
  }

  return {
    metadata: newMetadata,
    notes,
  };
};
