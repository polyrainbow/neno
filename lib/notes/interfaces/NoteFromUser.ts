import Note from "./Note.js";
import { NoteId } from "./NoteId.js";
import UserNoteChange from "./UserNoteChange.js";

export default interface NoteFromUser extends Note{
  id?: NoteId,
  changes?: UserNoteChange[],
}