import NoteListItemFeatures from "./NoteListItemFeatures.js";

export default interface NoteListItem {
    readonly id: number,
    readonly title: string,
    readonly creationTime: string,
    readonly updateTime: string,
    readonly features: NoteListItemFeatures,
    readonly numberOfLinkedNotes?: number,
}
