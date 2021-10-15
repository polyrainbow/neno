import NoteListItem from "./NoteListItem";
import Stats from "./Stats";

export default interface StatsExhaustive extends Stats{
    readonly numberOfFiles: number,
    readonly numberOfPins: number,
    readonly numberOfComponents: number,
    readonly numberOfComponentsWithMoreThanOneNode: number,
    readonly numberOfHubs: number,
    readonly nodesWithHighestNumberOfLinks: NoteListItem[],
    readonly dbCreationTime: number,
    readonly dbUpdateTime: number,
    readonly dbId: string,
}
