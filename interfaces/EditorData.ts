import EditorDataBlock from "./EditorDataBlock";

export default interface EditorData {
    time: number,
    blocks: EditorDataBlock[],
    version: string,
};