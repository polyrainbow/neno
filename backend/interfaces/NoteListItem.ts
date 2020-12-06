import NoteListItemFeatures from "./NoteListItemFeatures.js";

export default interface NoteListItem {
    id: number,
    title: string,
    creationTime: string,
    updateTime: string,
    features: NoteListItemFeatures,
    numberOfLinkedNotes?: number,
    
}
