import NoteListItemFeatures from "./NoteListItemFeatures";

export default interface NoteListItem {
    id: number,
    title: string,
    creationTime: string,
    updateTime: string,
    features: NoteListItemFeatures,
    numberOfLinkedNotes?: number,
    
}
