import { unescapeHTML } from "./utils.mjs";

const getNoteTitle = (note) => {
  return note.editorData && unescapeHTML(note.editorData.blocks[0].data.text);
};

export {
  getNoteTitle,
};
