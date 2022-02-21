import NoteContentBlock from "./NoteContentBlock.js";

export default interface Note {
  blocks: NoteContentBlock[],
  title: string,
}