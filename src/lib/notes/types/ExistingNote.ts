import { Block } from "../../subwaytext/types/Block";
import { NoteContent } from "./NoteContent";
import { ExistingNoteMetadata } from "./NoteMetadata";

export default interface ExistingNote {
  content: NoteContent,
  parsedContent?: Block[],
  meta: ExistingNoteMetadata,
}
