import EditorData from "./EditorData";
import Note from "./Note";
import { NoteId } from "./NoteId";

export default interface DatabaseNote extends Note {
    id: NoteId,
    creationTime: string,
    updateTime: string,
    x: number,
    y: number,
}