import { unescapeHTML } from "./utils.mjs";

const getNoteTitle = (note) => {
  return note.editorData && unescapeHTML(note.editorData.blocks[0].data.text);
};


const removeDefaultTextParagraphs = (note) => {
  note.editorData.blocks = note.editorData.blocks.filter((block) => {
    const isDefaultTextParagraph = (
      block.type === "paragraph"
      && block.data.text === "Note text"
    );

    return !isDefaultTextParagraph;
  });
};

const removeEmptyLinks = (note) => {
  note.editorData.blocks = note.editorData.blocks.filter((block) => {
    const isEmptyLink = (
      block.type === "linkTool"
      && block.data.link === ""
    );

    return !isEmptyLink;
  });
};

export {
  getNoteTitle,
  removeDefaultTextParagraphs,
  removeEmptyLinks,
};
