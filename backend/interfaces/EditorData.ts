import EditorDataBlock from "./EditorDataBlock.js";

export default interface EditorData {
    time: number,
    blocks: EditorDataBlock[],
    version: string,
};