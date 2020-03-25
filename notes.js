const DB = require("./database.js");
const Utils = require("./utils.js");

/**
  PRIVATE
  These private methods manipulate a db object that is passed to them as
  argument.
*/

const findNote = (db, noteId) => {
  return Utils.binaryArrayFind(db.notes, "id", noteId);
};


const updateNotePosition = (db, noteId, x, y) => {
  const note = findNote(db, noteId);
  note.x = x;
  note.y = y;
  return true;
};


const getNewNoteId = (db) => {
  db.idCounter = db.idCounter++;
  return db.idCounter;
};


const getLinkedNotes = (db, noteId) => {
  return db.links
    .filter((link) => {
      return (link.id0 === noteId) || (link.id1 === noteId);
    })
    .map((link) => {
      const linkedNoteId = (link.id0 === noteId) ? link.id1 : link.id0;
      return findNote(db, linkedNoteId);
    })
    .filter((linkedNote) => {
      return (typeof linkedNote === "object") && (linkedNote !== null);
    });
};


const cleanUpLinks = (db) => {
  db.links = db.links.filter((link) => {
    const note0 = findNote(db, link.id0);
    const note1 = findNote(db, link.id1);
    return (
      (typeof note0 === "object")
      && (note0 !== null)
      && (typeof note1 === "object")
      && (note1 !== null)
    );
  });
  return true;
};


const removeLinksOfNote = (db, noteId) => {
  db.links = db.links.filter((link) => {
    return (link.id0 !== noteId) && (link.id1 !== noteId);
  });
  return true;
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
  DB.forEach(cleanUpLinks);
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


const getAll = (userId, includeLinkedNotes) => {
  const db = DB.get(userId);
  return db.notes
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
    note.title = note.editorData && note.editorData.blocks[0].data.text;
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
  DB.set(userId);
};


const put = (noteFromUser, userId) => {
  const db = DB.get(userId);

  let note;

  if (
    typeof noteFromUser.id === "number"
  ) {
    note = findNote(db, noteFromUser.id);
  }

  if (note !== null) {
    note = {
      ...note,
      ...noteFromUser,
    };
  } else {
    const noteId = getNewNoteId(userId);
    note = {
      id: noteId,
      x: 0,
      y: 0,
      ...noteFromUser,
    };
    db.notes.push(note);
  }

  DB.set(db);
  return note;
};


const remove = (noteId, userId) => {
  const db = DB.get(userId);
  const noteIndex = Utils.binaryArrayFindIndex(db.notes, "id", noteId);
  db.notes.splice(noteIndex, 1);
  removeLinksOfNote(db, noteId);
  DB.set(db);
  return true;
};


const exportDB = (userId) => {
  return DB.get(userId);
};


const importDB = (db) => {
  return DB.set(db);
};


module.exports = {
  init,
  get,
  getAll,
  getGraph,
  setGraph,
  put,
  remove,
  exportDB,
  importDB,
};
