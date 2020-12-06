import EditorData from "./EditorData";
import { NoteId } from "./NoteId";

export default interface LinkedNote {
    id: NoteId,
    title: string,
    creationTime: string,
    updateTime: string
};
