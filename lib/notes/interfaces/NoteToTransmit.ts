import { FileInfo } from "./FileInfo.js";
import LinkedNote from "./LinkedNote.js";
import NodePosition from "./NodePosition.js";
import Note from "./Note.js";
import { NoteId } from "./NoteId.js";

export default interface NoteToTransmit extends Note {
  readonly id: NoteId,
  readonly title: string,
  readonly creationTime: number,
  readonly updateTime: number,
  readonly linkedNotes: LinkedNote[],
  readonly position: NodePosition,
  readonly numberOfCharacters: number,
  readonly files: FileInfo[],
}