import NodePosition from "./NodePosition";
import { NoteId } from "./NoteId";

interface BaseNoteMetadata {
  title: string,
  custom: {
    [key: string]: string,
  }
}

export interface NewNoteMetadata extends BaseNoteMetadata {
  position?: NodePosition,
}

export interface ExistingNoteMetadata extends BaseNoteMetadata {
  id: NoteId,
  createdAt: number,
  updatedAt: number,
  position: NodePosition,
}

export type NoteMetadata = NewNoteMetadata | ExistingNoteMetadata;
