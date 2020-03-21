const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const getKeySortFunction = require("./utils.js").getKeySortFunction;

const NOTE_FILE_SUFFIX = ".note.json";
let DATA_FOLDER = null;


const init = (dataFolderPath) => {
  DATA_FOLDER = dataFolderPath;
  mkdirp(DATA_FOLDER);
};

const readJSONFileInDataFolder = (filename) => {
  const json = fs.readFileSync(path.join(DATA_FOLDER, filename), "utf8");
  let object;
  try {
    object = JSON.parse(json);
    return object;
  } catch (e) {
    console.error("Database corrupted. Could not parse file " + filename);
    console.log("File content: " + json);
  }
};


const getNewNoteId = (userId) => {
  const idFile = path.join(DATA_FOLDER, userId + ".idcounter");

  if (fs.existsSync(idFile)) {
    const idString = fs.readFileSync(idFile);
    let id = parseInt(idString);
    id++;
    fs.writeFileSync(idFile, id.toString(), "utf8");
    return id;
  } else {
    const id = 0;
    fs.writeFileSync(idFile, id.toString(), "utf8");
    return id;
  }
};


const getLinkedNotes = (noteId, userId) => {
  return getLinks(userId)
    .filter((link) => {
      return (link.id0 === noteId) || (link.id1 === noteId);
    })
    .map((link) => {
      return (link.id0 === noteId) ? link.id1 : link.id0;
    })
    .map((linkedNoteId) => {
      return get(linkedNoteId, userId, false);
    });
};


const get = (noteId, userId, includeLinkedNotes) => {
  const filename = userId + "." + noteId + NOTE_FILE_SUFFIX;
  const note = readJSONFileInDataFolder(filename);
  if (includeLinkedNotes) {
    note.linkedNotes = getLinkedNotes(noteId, userId);
  }
  return note;
};


const getAll = (userId, includeLinkedNotes) => {
  return fs.readdirSync(DATA_FOLDER)
    .filter((filename) => {
      return (
        filename.startsWith(userId + ".")
        && filename.endsWith(NOTE_FILE_SUFFIX)
      );
    })
    .map((filename) => {
      const note = readJSONFileInDataFolder(filename);
      if (includeLinkedNotes) {
        note.linkedNotes = getLinkedNotes(note.id, userId);
      }
      return note;
    })
    .sort(getKeySortFunction("id"));
};


const getLinks = (userId) => {
  const linksFilename = path.join(DATA_FOLDER, userId + ".links.json");

  let links;
  if (fs.existsSync(linksFilename)) {
    links = JSON.parse(
      fs.readFileSync(linksFilename, "utf8"),
    );
  } else {
    links = [];
  }

  return links;
};

const getGraphScreenPosition = (userId) => {
  const configFilename = path.join(DATA_FOLDER, userId + ".config.json");
  let screenPosition;
  if (fs.existsSync(configFilename)) {
    screenPosition = JSON.parse(
      fs.readFileSync(configFilename, "utf8"),
    ).screenPosition;
  } else {
    screenPosition = {
      translateX: 0,
      translateY: 0,
      scale: 1,
    };
  }

  return screenPosition;
};


const getGraph = (userId) => {
  const nodes = getAll(userId);
  const links = getLinks(userId);

  nodes.forEach((node) => {
    node.title = node.editorData && node.editorData.blocks[0].data.text;
    // we don't need the editorData for the graph after we've taken the title
    // from it
    delete node.editorData;
  });

  const screenPosition = getGraphScreenPosition(userId);

  return {
    nodes,
    links,
    screenPosition,
  };
};


const setGraph = (graph, userId) => {
  graph.nodes.forEach((node) => {
    updatePosition(node.id, node.x, node.y, userId);
  });
  const linksFilename = path.join(DATA_FOLDER, userId + ".links.json");
  fs.writeFileSync(linksFilename, JSON.stringify(graph.links), "utf8");
  const configFilename = path.join(DATA_FOLDER, userId + ".config.json");
  fs.writeFileSync(configFilename, JSON.stringify({
    screenPosition: graph.screenPosition,
  }), "utf8");
};


const create = (noteFromUser, userId) => {
  const noteId = getNewNoteId(userId);
  const note = {
    id: noteId,
    x: 0,
    y: 0,
    ...noteFromUser,
  };
  const filename = path.join(
    DATA_FOLDER, userId + "." + noteId + NOTE_FILE_SUFFIX,
  );
  fs.writeFileSync(filename, JSON.stringify(note), "utf8");
  return note;
};


const update = (updatedNote, userId) => {
  const filename = path.join(
    DATA_FOLDER, userId + "." + updatedNote.id + NOTE_FILE_SUFFIX,
  );

  // fix broken legacy notes without coordinates
  updatedNote.x = updatedNote.x || 0;
  updatedNote.y = updatedNote.y || 0;

  fs.writeFileSync(filename, JSON.stringify(updatedNote), "utf8");
  return updatedNote;
};


const updatePosition = (noteId, x, y, userId) => {
  const filename = userId + "." + noteId + NOTE_FILE_SUFFIX;
  const note = readJSONFileInDataFolder(filename);

  note.x = x;
  note.y = y;

  fs.writeFileSync(filename, JSON.stringify(note), "utf8");
  return note;
};


const remove = (noteId, userId) => {
  const filename = path.join(
    DATA_FOLDER, userId + "." + noteId + NOTE_FILE_SUFFIX,
  );
  fs.unlinkSync(filename);
  return true;
};

const exportDB = (userId) => {
  const notes = getAll(userId, false);
  const links = getLinks(userId);
  const idCounter = getNewNoteId(userId);
  const screenPosition = getGraphScreenPosition(userId);

  return {
    notes,
    links,
    idCounter,
    screenPosition,
    timestamp: new Date(),
  };
};


const importDB = () => {
  // TO DO
};


module.exports = {
  init,
  get,
  getAll,
  getGraph,
  setGraph,
  create,
  update,
  remove,
  exportDB,
  importDB,
};
