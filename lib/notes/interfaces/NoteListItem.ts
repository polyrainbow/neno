import NoteListItemFeatures from "./NoteListItemFeatures.js";

export default interface NoteListItem {
  readonly id: number,
  readonly title: string,
  readonly createdAt: number,
  readonly updatedAt: number,
  readonly features: NoteListItemFeatures,
  readonly numberOfLinkedNotes: number,
  readonly numberOfCharacters: number,
  readonly numberOfFiles: number,
}
