import LinkedNote from "./LinkedNote.js";
import Note from "./Note.js";
import { NoteId } from "./NoteId.js";

export default interface NoteToTransmit extends Note {
    id: NoteId,
    title: string,
    creationTime: string,
    updateTime: string,
    linkedNotes: LinkedNote[],
}