import { FileInfo } from "./FileInfo.js";
import ExistingNote from "./ExistingNote.js";
import SparseNoteInfo from "./SparseNoteInfo.js";
import NotePreview from "./NotePreview.js";

export default interface NoteToTransmit extends ExistingNote {
  readonly backlinks: SparseNoteInfo[],
  readonly outgoingLinks: NotePreview[],
  readonly files: Set<FileInfo>,
  readonly numberOfCharacters: number,
  readonly numberOfBlocks: number,
  readonly aliases: Set<string>,
}
