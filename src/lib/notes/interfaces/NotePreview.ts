import SparseNoteInfo from "./SparseNoteInfo.js";

export default interface NotePreview extends SparseNoteInfo {
  readonly content: string,
}
