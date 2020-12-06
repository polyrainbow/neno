import { NoteId } from "./NoteId.js";

export default interface LinkedNote {
    readonly id: NoteId,
    readonly title: string,
    readonly creationTime: string,
    readonly updateTime: string
};
