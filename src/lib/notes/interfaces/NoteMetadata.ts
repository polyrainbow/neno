import NodePosition from "./NodePosition";
import { Slug } from "./Slug";

interface BaseNoteMetadata {
  flags: string[],
  contentType: string,
  custom: {
    [key: string]: string,
  }
}

export interface NewNoteMetadata extends BaseNoteMetadata {
  position?: NodePosition,
}

export interface ExistingNoteMetadata extends BaseNoteMetadata {
  slug: Slug,
  createdAt?: number,
  updatedAt?: number,
  position: NodePosition,
}

export type NoteMetadata = NewNoteMetadata | ExistingNoteMetadata;
