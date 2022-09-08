import { FileInfo } from "./FileInfo.js";
import LinkedNote from "./LinkedNote.js";
import ExistingNote from "./ExistingNote.js";

export default interface NoteToTransmit extends ExistingNote {
  readonly linkedNotes: LinkedNote[],
  readonly files: FileInfo[],
  readonly numberOfCharacters: number,
}