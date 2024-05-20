import { Slug } from "./Slug";

interface BaseNoteMetadata {
  flags: string[],
  custom: {
    [key: string]: string,
  }
}

export type NewNoteMetadata = BaseNoteMetadata;

export interface ExistingNoteMetadata extends BaseNoteMetadata {
  slug: Slug,
  createdAt?: number,
  updatedAt?: number,
}

export type NoteMetadata = NewNoteMetadata | ExistingNoteMetadata;
