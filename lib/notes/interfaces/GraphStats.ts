import NoteListItem from "./NoteListItem";

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
    readonly creationTime?: number,
    readonly updateTime?: number,
    readonly id?: string,
    readonly size?: {
        graph: number,
        files: number,
    },
}
