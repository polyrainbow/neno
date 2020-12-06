import { NoteId } from "./NoteId.js";

export default interface LinkedNote {
    id: NoteId,
    title: string,
    creationTime: string,
    updateTime: string
};
