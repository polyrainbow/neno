import NoteListItem from "./NoteListItem";

export default interface Stats {
    readonly numberOfAllNotes: number,
    readonly numberOfLinks: number,
    readonly numberOfFiles: number,
    readonly numberOfPins: number,
    readonly numberOfUnlinkedNotes: number,

    readonly numberOfComponents?: number,
    readonly numberOfComponentsWithMoreThanOneNode?: number,
    readonly numberOfHubs?: number,
    readonly nodesWithHighestNumberOfLinks?: NoteListItem[],
    readonly dbCreationTime?: number,
    readonly dbUpdateTime?: number,
    readonly dbId?: string,
    readonly dbSize?: {
        mainData: number,
        files: number,
    },
}
