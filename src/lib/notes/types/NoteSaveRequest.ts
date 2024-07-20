import ExistingNote from "./ExistingNote.js";
import NewNote from "./NewNote.js";
import { Slug } from "./Slug.js";

interface BaseNoteSaveRequest {
  aliases?: Set<Slug>,
  changeSlugTo?: Slug,
}

export interface NewNoteSaveRequest extends BaseNoteSaveRequest {
  note: NewNote,
}

export interface ExistingNoteSaveRequest extends BaseNoteSaveRequest {
  note: ExistingNote,
  updateReferences?: boolean,
  disableTimestampUpdate?: boolean,
}

export type NoteSaveRequest = NewNoteSaveRequest | ExistingNoteSaveRequest;
