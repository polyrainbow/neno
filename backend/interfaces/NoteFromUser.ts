import Note from "./Note";
import { NoteId } from "./NoteId";
import UserNoteChange from "./UserNoteChange";

export default interface NoteFromUser extends Note{
    id?: NoteId,
    changes?: UserNoteChange[],
}