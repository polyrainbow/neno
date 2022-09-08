import { NoteContent } from "./NoteContent";
import { NewNoteMetadata } from "./NoteMetadata";

export default interface NewNote {
  content: NoteContent,
  meta: NewNoteMetadata,
}