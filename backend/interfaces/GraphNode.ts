import LinkedNote from "./LinkedNote";
import NodePosition from "./NodePosition";
import { NoteId } from "./NoteId";

export default interface GraphNode {
    id: NoteId,
    title: string,
    position: NodePosition,
    linkedNotes: LinkedNote[],
    creationTime: number,
};
