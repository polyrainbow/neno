import EditorData from "./EditorData";
import Note from "./Note.js";
import { NoteId } from "./NoteId.js";

export default interface DatabaseNote extends Note {
    readonly id: NoteId,
    readonly creationTime: number,
    updateTime: number,
    x: number,
    y: number,
}