import { NoteId } from "./NoteId";
import NoteListItemFeatures from "./NoteListItemFeatures";

export default interface GraphNode {
    id: NoteId,
    title: string,
    x: number,
    y: number,
}
