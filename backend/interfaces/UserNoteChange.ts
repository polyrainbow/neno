import EditorData from "./EditorData";
import { NoteId } from "./NoteId.js";
import { UserNoteChangeType } from "./UserNoteChangeType.js";

export default interface UserNoteChange {
    type: UserNoteChangeType,
    noteId: NoteId,
}