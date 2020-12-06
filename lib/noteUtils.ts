import Database from "../interfaces/Database";
import DatabaseNote from "../interfaces/DatabaseNote";
import Note from "../interfaces/Note";
import NoteFromUser from "../interfaces/NoteFromUser";
import { NoteId } from "../interfaces/NoteId";
import * as Utils from "./utils";

const getNoteTitle = (note:Note):string => {
  if (typeof note?.editorData?.blocks?.[0]?.data?.text === "string") {
    let title
      = Utils.unescapeHTML(note.editorData.blocks[0].data.text);

    if (title.length > 800) {
      title = title.substr(0, 800) + " ...";
    }

    return title;
  } else {
    return "⁉️ Note without title";
  }
};


const removeDefaultTextParagraphs = (note:Note):void => {
  note.editorData.blocks = note.editorData.blocks.filter((block) => {
    const isDefaultTextParagraph = (
      block.type === "paragraph"
      && block.data.text === "Note text"
    );

    return !isDefaultTextParagraph;
  });
};

const removeEmptyLinks = (note:Note):void => {
  note.editorData.blocks = note.editorData.blocks.filter((block) => {
    const isEmptyLink = (
      block.type === "linkTool"
      && block.data.link === ""
    );

    return !isEmptyLink;
  });
};


const noteWithSameTitleExists = (note:NoteFromUser, db:Database):boolean => {
  const noteTitle = getNoteTitle(note);

  return db.notes.some((noteFromDB:DatabaseNote):boolean => {
    const noteFromDBTitle = getNoteTitle(noteFromDB);
    return (
      (noteFromDBTitle === noteTitle)
      && (note.id !== noteFromDB.id)
    );
  });
};


const findNote = (db:Database, noteId:NoteId):DatabaseNote | null => {
  return Utils.binaryArrayFind(db.notes, "id", noteId);
};


const getNewNoteId = (db:Database):NoteId => {
  db.idCounter = db.idCounter + 1;
  return db.idCounter;
};


export {
  getNoteTitle,
  removeDefaultTextParagraphs,
  removeEmptyLinks,
  noteWithSameTitleExists,
  findNote,
  getNewNoteId,
};
