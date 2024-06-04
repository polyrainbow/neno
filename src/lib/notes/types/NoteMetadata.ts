import { Slug } from "./Slug";

interface BaseNoteMetadata {
  flags: string[],
  additionalHeaders: {
    [key: string]: string,
  }
}

export type NewNoteMetadata = BaseNoteMetadata;

export interface ExistingNoteMetadata extends BaseNoteMetadata {
  slug: Slug,
  createdAt?: string,
  updatedAt?: string,
}

export type NoteMetadata = NewNoteMetadata | ExistingNoteMetadata;
