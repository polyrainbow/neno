import * as DB from "./database.mjs";
import * as Utils from "./utils.mjs";
import { v4 as uuidv4 } from "uuid";
import {
  getNoteTitle,
  removeDefaultTextParagraphs,
  removeEmptyLinks,
  noteWithSameTitleExists,
  findNote,
  getNewNoteId,
} from "./noteUtils.mjs";
import cleanUpData from "./cleanUpData.mjs";

/**
  PRIVATE
  These private methods manipulate a db object that is passed to them as
  argument.
*/


const updateNotePosition = (db, noteId, x, y) => {
  const note = findNote(db, noteId);
  note.x = x;
  note.y = y;
  return true;
};


const getLinkedNotes = (db, noteId) => {
  return db.links
    .filter((link) => {
      return (link[0] === noteId) || (link[1] === noteId);
    })
    .map((link) => {
      const linkedNoteId = (link[0] === noteId) ? link[1] : link[0];
      return findNote(db, linkedNoteId);
    })
    .filter((linkedNote) => {
      return (typeof linkedNote === "object") && (linkedNote !== null);
    })
    .map((linkedNote) => {
      linkedNote.title = getNoteTitle(linkedNote);
      return linkedNote;
    });
};


const removeLinksOfNote = (db, noteId) => {
  db.links = db.links.filter((link) => {
    return (link[0] !== noteId) && (link[1] !== noteId);
  });
  return true;
};


const getUploadsOfNote = (note) => {
  return note.editorData.blocks
    .filter((block) => {
      const blockHasImage = (
        block.type === "image"
        && (typeof block.data.file.fileId === "string")
      );

      // because of https://github.com/editor-js/attaches/issues/15
      // it is currently not possible to save the fileId as such in the
      // attaches block object. that's why we have to parse it from the url
      const blockHasFile = (
        block.type === "attaches"
        && (typeof block.data.file.url === "string")
      );

      return blockHasImage || blockHasFile;
    })
    .map((block) => {
      let fileId = null;

      if (block.type === "image") {
        fileId = block.data.file.fileId;
      }

      // because of https://github.com/editor-js/attaches/issues/15
      // it is currently not possible to save the fileId as such in the
      // attaches block object. that's why we have to parse it from the url
      if (block.type === "attaches") {
        const url = block.data.file.url;
        fileId = url.substr(url.lastIndexOf("/") + 1);
      }

      return fileId;
    });
};


const removeUploadsOfNote = (note) => {
  getUploadsOfNote(note)
    .forEach((fileId) => {
      DB.deleteBlob(fileId);
    });
};


/**
  EXPORTS
**/


const init = (dataFolderPath) => {
  console.log("Initializing notes module...");

  const newDBTemplate = {
    id: null,
    notes: [],
    links: [],
    idCounter: 0,
    screenPosition: {
      translateX: 0,
      translateY: 0,
      scale: 1,
    },
  };

  DB.init({
    dataFolderPath,
    newDBTemplate,
  });

  console.log("Cleaning data...");
  cleanUpData();
};


const get = (noteId, userId, includeLinkedNotes) => {
  const db = DB.get(userId);
  let note = findNote(db, noteId);
  if (!note) {
    return null;
  }
  if (includeLinkedNotes) {
    note = Utils.cloneObject(note);
    note.linkedNotes = getLinkedNotes(db, noteId);
  }

  return note;
};


const getAll = (userId, {
  includeLinkedNotes,
  query,
  caseSensitiveQuery,
}) => {
  const db = DB.get(userId);
  return db.notes
    .filter((note) => {
      if (typeof query !== "string") {
        return true;
      }
      const title = getNoteTitle(note);
      if (caseSensitiveQuery) {
        return title.includes(query);
      } else {
        return title.toLowerCase().includes(query.toLowerCase());
      }
    })
    .map((note) => {
      if (includeLinkedNotes) {
        note.linkedNotes = getLinkedNotes(db, note.id);
      }
      return note;
    });
};


const getGraph = (userId) => {
  const db = DB.get(userId);
  const notes = Utils.cloneObject(db.notes);

  notes.forEach((note) => {
    note.title = getNoteTitle(note);
    note.linkedNotes = getLinkedNotes(db, note.id);

    // we don't need the editorData for the graph after we've taken the title
    // from it
    delete note.editorData;
  });

  return {
    nodes: notes,
    links: db.links,
    screenPosition: db.screenPosition,
  };
};


const setGraph = (graph, userId) => {
  const db = DB.get(userId);
  graph.nodes.forEach((node) => {
    updateNotePosition(db, node.id, node.x, node.y);
  });
  db.links = graph.links;
  db.screenPosition = graph.screenPosition;
  DB.set(db);
};

/*
  noteFromUser must contain
  * changes: Array
  * id: number or null
  * editorData: object
*/
const put = (noteFromUser, userId, options) => {
  let ignoreDuplicateTitles = true;
  if (
    (typeof options === "object")
    && (options.ignoreDuplicateTitles === false)
  ) {
    ignoreDuplicateTitles = false;
  }

  const db = DB.get(userId);

  if (!ignoreDuplicateTitles && noteWithSameTitleExists(noteFromUser, db)) {
    throw new Error("NOTE_WITH_SAME_TITLE_EXISTS");
  }

  let note = null;

  if (
    typeof noteFromUser.id === "number"
  ) {
    note = findNote(db, noteFromUser.id);
  }

  if (note === null) {
    const noteId = getNewNoteId(db);
    note = {
      id: noteId,
      x: 0,
      y: 0,
      editorData: noteFromUser.editorData,
      creationTime: Date.now(),
    };
    db.notes.push(note);
  }

  note.editorData = noteFromUser.editorData;
  note.updateTime = Date.now();
  removeDefaultTextParagraphs(note);
  removeEmptyLinks(note);

  if (Array.isArray(noteFromUser.changes)) {
    noteFromUser.changes.forEach((change) => {
      if (change.type === "LINKED_NOTE_ADDED") {
        db.links.push([note.id, change.noteId]);
      }

      if (change.type === "LINKED_NOTE_DELETED") {
        db.links = db.links.filter((link) => {
          return !(
            link.includes(note.id) && link.includes(change.noteId)
          );
        });
      }
    });
  }

  DB.set(db);

  const noteWithLinkedNotes = Utils.cloneObject(note);
  noteWithLinkedNotes.linkedNotes = getLinkedNotes(db, note.id);

  return noteWithLinkedNotes;
};


const remove = (noteId, userId) => {
  const db = DB.get(userId);
  const noteIndex = Utils.binaryArrayFindIndex(db.notes, "id", noteId);
  const note = db.notes[noteIndex];
  if (noteIndex === null) {
    return false;
  }
  db.notes.splice(noteIndex, 1);
  removeLinksOfNote(db, noteId);
  removeUploadsOfNote(note);
  DB.set(db);
  return true;
};


const exportDB = (userId) => {
  return DB.get(userId);
};


const importDB = (db) => {
  return DB.set(db);
};


const getFilesForDBExport = (userId) => {
  const jsonFile = DB.getDBFile(userId);
  const uploadedFiles = getAll(userId, {
    includeLinkedNotes: false,
  })
    .map(getUploadsOfNote)
    .flat()
    .map(DB.getBlob);
  const files = [jsonFile, ...uploadedFiles];
  return files;
};


const addFile = (sourcePath, fileType) => {
  const newFilename = uuidv4() + "." + fileType.ending;
  DB.addBlob(newFilename, sourcePath);
  return newFilename;
};


const getFile = (fileId) => {
  return DB.getBlob(fileId);
};

export {
  init,
  get,
  getAll,
  getGraph,
  setGraph,
  put,
  remove,
  exportDB,
  importDB,
  addFile,
  getFile,
  getFilesForDBExport,
};
