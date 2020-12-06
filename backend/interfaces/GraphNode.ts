import { NoteId } from "./NoteId";
export default interface GraphNode {
    id: NoteId,
    title: string,
    x: number,
    y: number,
}
