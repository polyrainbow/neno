import NodePosition from "./NodePosition";
import { NoteId } from "./NoteId";

export default interface GraphNodePositionUpdate {
    id: NoteId,
    position: NodePosition,
}
