import ExistingNote from "./ExistingNote.js";
import NewNote from "./NewNote.js";
import UserNoteChange from "./UserNoteChange.js";

interface BaseNoteSaveRequest {
  changes?: UserNoteChange[],
  ignoreDuplicateTitles: boolean,
}

export interface NewNoteSaveRequest extends BaseNoteSaveRequest {
  note: NewNote,

}

export interface ExistingNoteSaveRequest extends BaseNoteSaveRequest {
  note: ExistingNote,
}

export type NoteSaveRequest = NewNoteSaveRequest | ExistingNoteSaveRequest;