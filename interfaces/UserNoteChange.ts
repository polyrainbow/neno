import EditorData from "./EditorData";
import LinkedNote from "./LinkedNote";
import { NoteId } from "./NoteId";
import { UserNoteChangeType } from "./UserNoteChangeType";

export default interface UserNoteChange {
    type: UserNoteChangeType,
    noteId: NoteId,
}