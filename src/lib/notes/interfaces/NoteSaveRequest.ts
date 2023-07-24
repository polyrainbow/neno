import ExistingNote from "./ExistingNote.js";
import NewNote from "./NewNote.js";

interface BaseNoteSaveRequest {
  ignoreDuplicateTitles: boolean,
}

export interface NewNoteSaveRequest extends BaseNoteSaveRequest {
  note: NewNote,
}

export interface ExistingNoteSaveRequest extends BaseNoteSaveRequest {
  note: ExistingNote,
  changeSlugTo?: string,
}

export type NoteSaveRequest = NewNoteSaveRequest | ExistingNoteSaveRequest;
