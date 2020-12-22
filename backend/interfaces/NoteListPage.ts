import NoteListItem from "./NoteListItem.js";

export default interface NoteListPage {
  readonly results: NoteListItem[],
  readonly numberOfResults: number,
}
