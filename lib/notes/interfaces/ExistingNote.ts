import { NoteContent } from "./NoteContent";
import { ExistingNoteMetadata } from "./NoteMetadata";

export default interface ExistingNote {
  content: NoteContent,
  meta: ExistingNoteMetadata,
}