import NoteListItemFeatures from "./NoteListItemFeatures.js";

export default interface NoteListItem {
    readonly id: number,
    readonly title: string,
    readonly creationTime: number,
    readonly updateTime: number,
    readonly features: NoteListItemFeatures,
    readonly numberOfLinkedNotes?: number,
    readonly numberOfCharacters: number,
}
