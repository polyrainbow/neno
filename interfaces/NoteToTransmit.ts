import EditorData from "./EditorData";
import LinkedNote from "./LinkedNote";
import Note from "./Note";
import { NoteId } from "./NoteId";
import NoteListItemFeatures from "./NoteListItemFeatures";

export default interface NoteToTransmit extends Note {
    id: NoteId,
    title: string,
    creationTime: string,
    updateTime: string,
    linkedNotes: LinkedNote[],
}