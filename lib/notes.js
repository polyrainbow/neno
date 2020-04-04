const DB = require("./database.js");
const Utils = require("./utils.js");
const { v4: uuidv4 } = require("uuid");

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
  db.idCounter = db.idCounter + 1;
  return db.idCounter;
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
    });
};


const cleanUpLinks = (db) => {
  db.links = db.links.filter((link) => {
    const note0 = findNote(db, link[0]);
    const note1 = findNote(db, link[1]);
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
    return (link[0] !== noteId) && (link[1] !== noteId);
  });
  return true;
};


const convertLinksFromLegacyFormat = (db) => {
  db.links = db.links.map((link) => {
    if ("id0" in link) {
      return [link.id0, link.id1];
    } else {
      return link;
    }
  });
  return true;
};


const getUploadsOfNote = (note) => {
  return note.editorData.blocks
    .filter((block) => {
      return block.type === "image";
    })
    .map((imageBlock) => {
      return imageBlock.data.file.imageId;
    });
};


const removeUploadsOfNote = (note) => {
  getUploadsOfNote(note)
    .forEach((imageId) => {
      DB.deleteBlob(imageId);
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
  DB.forEach((db) => {
    convertLinksFromLegacyFormat(db);

    // remove invalid links
    cleanUpLinks(db);

    const ids = [];

    db.notes.forEach((note) => {
      // assign id to id-less notes
      if (typeof note.id !== "number" || ids.includes(note.id)) {
        note.id = getNewNoteId(db);
      }
      ids.push(note.id);

      // remove unnecessary linkedNotes object if it exists
      if (note.linkedNotes) {
        delete note.linkedNotes;
      }
    });
  });
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
  db.links = graph.links;
  db.screenPosition = graph.screenPosition;
  DB.set(db);
};


const put = (noteFromUser, userId) => {
  const db = DB.get(userId);

  let note = null;

  if (
    typeof noteFromUser.id === "number"
  ) {
    note = findNote(db, noteFromUser.id);
  }

  if (note !== null) {
    // overwrite note from db
    for (const key in noteFromUser) {
      if (Object.prototype.hasOwnProperty.call(noteFromUser, key)) {
        note[key] = noteFromUser[key];
      }
    }
  } else {
    const noteId = getNewNoteId(db);
    note = {
      id: noteId,
      x: 0,
      y: 0,
      ...noteFromUser,
    };
    db.notes.push(note);
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
  const uploadedFiles = getAll(userId, false)
    .map(getUploadsOfNote)
    .flat()
    .map(DB.getBlob);
  const files = [jsonFile, ...uploadedFiles];
  return files;
};


const addImage = (sourcePath, fileType) => {
  const newFilename = uuidv4() + "." + fileType.ending;
  DB.addBlob(newFilename, sourcePath);
  return newFilename;
};


const getImage = (imageId) => {
  return DB.getBlob(imageId);
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
  addImage,
  getImage,
  getFilesForDBExport,
};
