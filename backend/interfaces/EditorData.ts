import EditorDataBlock from "./EditorDataBlock.js";

export default interface EditorData {
    time: number,
    blocks: EditorDataBlock[],
    readonly version: string,
};