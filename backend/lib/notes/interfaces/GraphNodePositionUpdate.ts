import NodePosition from "./NodePosition.js";
import { NoteId } from "./NoteId.js";

export default interface GraphNodePositionUpdate {
    id: NoteId,
    position: NodePosition,
}
