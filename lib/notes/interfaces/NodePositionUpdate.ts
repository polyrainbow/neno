import NodePosition from "./NodePosition.js";
import { NoteId } from "./NoteId.js";

export default interface NodePositionUpdate {
    id: NoteId,
    position: NodePosition,
}
