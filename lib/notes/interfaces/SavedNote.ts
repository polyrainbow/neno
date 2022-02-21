import NodePosition from "./NodePosition.js";
import Note from "./Note.js";
import { NoteId } from "./NoteId.js";

export default interface SavedNote extends Note {
  readonly id: NoteId,
  readonly creationTime: number,
  updateTime: number,
  position: NodePosition,
}