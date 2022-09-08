import NodePosition from "./NodePosition";
import { NoteId } from "./NoteId";

interface BaseNoteMetadata {
  title: string,
  custom: {
    [key: string]: string,
  }
}

export interface ExistingNoteMetadata extends BaseNoteMetadata {
  id: NoteId,
  createdAt: number,
  updatedAt: number,
  position: NodePosition,
}

export type NewNoteMetadata = BaseNoteMetadata;