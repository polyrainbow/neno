import LinkedNote from "./LinkedNote.js";
import NodePosition from "./NodePosition.js";
import { NoteId } from "./NoteId.js";

export default interface GraphNode {
    id: NoteId,
    title: string,
    position: NodePosition,
    linkedNotes: LinkedNote[],
    creationTime: number,
}
