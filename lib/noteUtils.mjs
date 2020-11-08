import { unescapeHTML } from "./utils.mjs";

const getNoteTitle = (note) => {
  if (typeof note?.editorData?.blocks?.[0]?.data?.text === "string") {
    let title
      = unescapeHTML(note.editorData.blocks[0].data.text);

    if (title.length > 800) {
      title = title.substr(0, 800) + " ...";
    }

    return title;
  } else {
    return "⁉️ Note without title";
  }
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


const noteWithSameTitleExists = (note, db) => {
  const noteTitle = getNoteTitle(note);

  return db.notes.some((noteFromDB) => {
    const noteFromDBTitle = getNoteTitle(noteFromDB);
    return (noteFromDBTitle === noteTitle) && (note.id !== noteFromDB.id);
  });
};


export {
  getNoteTitle,
  removeDefaultTextParagraphs,
  removeEmptyLinks,
  noteWithSameTitleExists,
};
