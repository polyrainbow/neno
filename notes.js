const DB = require("./database.js");


const init = (dataFolderPath) => {
  DB.init(dataFolderPath);
};


const getNewNoteId = (userId) => {
  const db = DB.get(userId);
  db.idCounter = db.idCounter++ || 0;
  db.update(userId, db);
  return db.idCounter;
};


const getLinkedNotes = (noteId, userId) => {
  const db = DB.get(userId);

  return db.links
    .filter((link) => {
      return (link.id0 === noteId) || (link.id1 === noteId);
    })
    .map((link) => {
      return (link.id0 === noteId) ? link.id1 : link.id0;
    })
    .map((linkedNoteId) => {
      return get(linkedNoteId, userId, false);
    })
    .filter((linkedNote) => {
      return (typeof linkedNote === "object") && (linkedNote !== null);
    });
};


const get = (noteId, userId, includeLinkedNotes) => {
  const db = DB.get(userId);
  binaryArrayFind();
  const note = db.notes.find((note) => note.id === noteId);
  if (!note) {
    return null;
  }
  if (includeLinkedNotes) {
    note.linkedNotes = getLinkedNotes(noteId, userId);
  }
  return note;
};


const getAll = (userId, includeLinkedNotes) => {
  const db = DB.get(userId);
  return db.notes
    .map((note) => {
      if (includeLinkedNotes) {
        note.linkedNotes = getLinkedNotes(note.id, userId);
      }
      return note;
    });
};


const getLinks = (userId) => {
  const db = DB.get(userId);
  let links = db.links;

  links = links.filter((link) => {
    const note0 = get(link.id0, userId, false);
    const note1 = get(link.id1, userId, false);
    return (
      (typeof note0 === "object")
      && (note0 !== null)
      && (typeof note1 === "object")
      && (note1 !== null)
    );
  });

  return links;
};


const removeLinksOfNote = (noteId, userId) => {
  const db = DB.get(userId);
  db.links = db.links.filter((link) => {
    return (link.id0 !== noteId) && (link.id1 !== noteId);
  });
  DB.set(db);
};


const getGraphScreenPosition = (userId) => {
  const db = DB.get(userId);
  return db.screenPosition;
};


const getGraph = (userId) => {
  const db = DB.get(userId);
  const nodes = db.nodes;

  nodes.forEach((node) => {
    node.title = node.editorData && node.editorData.blocks[0].data.text;
    // we don't need the editorData for the graph after we've taken the title
    // from it
    delete node.editorData;
  });

  return {
    nodes,
    links: db.links,
    screenPosition: db.screenPosition,
  };
};


const setGraph = (graph, userId) => {
  const db = DB.get(userId);
  graph.nodes.forEach((node) => {
    updatePosition(node.id, node.x, node.y, userId);
  });
  const linksFilename = userId + ".links.json";
  writeJSONFileInDataFolder(linksFilename, graph.links);
  const configFilename = userId + ".config.json";
  writeJSONFileInDataFolder(configFilename, {
    screenPosition: graph.screenPosition,
  });
};


const put = (noteFromUser, userId) => {
  const db = DB.get(userId);

  let note;

  if (
    typeof noteFromUser.id === "number"
  ) {
    note = db.notes.find((note) => note.id === noteFromUser.id);
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


const updatePosition = (noteId, x, y, userId) => {
  const filename = userId + "." + noteId + NOTE_FILE_SUFFIX;
  const note = readJSONFileInDataFolder(filename);

  note.x = x;
  note.y = y;

  writeJSONFileInDataFolder(filename, note);
  return note;
};


const remove = (noteId, userId) => {
  const filename = path.join(
    DATA_FOLDER, userId + "." + noteId + NOTE_FILE_SUFFIX,
  );
  fs.unlinkSync(filename);
  removeLinksOfNote(noteId, userId);
  return true;
};

const exportDB = (userId) => {
  return DB.get(userId);
};


const importDB = (db) => {
  // TO DO
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
