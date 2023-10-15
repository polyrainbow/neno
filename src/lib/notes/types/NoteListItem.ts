import LinkCount from "./LinkCount.js";
import NoteListItemFeatures from "./NoteListItemFeatures.js";
import SparseNoteInfo from "./SparseNoteInfo.js";

export default interface NoteListItem extends SparseNoteInfo {
  readonly features: NoteListItemFeatures,
  readonly linkCount: LinkCount,
  readonly numberOfCharacters: number,
  readonly numberOfFiles: number,
}
