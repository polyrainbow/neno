import NoteListItem from "./NoteListItem";

export interface GraphSize {
  graph: number,
  files: number,
}

export default interface GraphStats {
  readonly numberOfAllNotes: number,
  readonly numberOfLinks: number,
  readonly numberOfFiles: number,
  readonly numberOfPins: number,
  readonly numberOfUnlinkedNotes: number,

  readonly numberOfComponents?: number,
  readonly numberOfComponentsWithMoreThanOneNode?: number,
  readonly numberOfHubs?: number,
  readonly nodesWithHighestNumberOfLinks?: NoteListItem[],
  readonly createdAt?: number,
  readonly updatedAt?: number,
  readonly id?: string,
  readonly size?: GraphSize,
}
