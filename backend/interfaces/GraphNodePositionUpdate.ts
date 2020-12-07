import LinkedNote from "./LinkedNote";
import { NoteId } from "./NoteId";

export default interface GraphNodePositionUpdate {
    id: NoteId,
    x: number,
    y: number,
};
