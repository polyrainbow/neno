import { NoteListSortMode } from "./NoteListSortMode";

export default interface DatabaseQuery {
  searchString?: string,
  caseSensitive?: boolean,
  page?: number,
  sortMode?: NoteListSortMode,
  limit?: number,
}
