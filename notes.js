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


const get = (noteId, userId) => {
  const filename = path.join(
    DATA_FOLDER,
    userId + "." + noteId + NOTE_FILE_SUFFIX,
  );
  const note = JSON.parse(fs.readFileSync(filename));
  return note;
};


const getAll = (userId) => {
  return fs.readdirSync(DATA_FOLDER)
    .filter((filename) => {
      return (
        filename.startsWith(userId + ".")
        && filename.endsWith(NOTE_FILE_SUFFIX)
      );
    })
    .map((filename) => {
      const string = fs.readFileSync(path.join(DATA_FOLDER, filename), "utf8");
      return JSON.parse(string);
    })
    .sort(getKeySortFunction("id"));
};


const getGraph = (userId) => {
  const nodes = getAll(userId);
  const filename = path.join(DATA_FOLDER, userId + ".links.json");

  let links;
  if (fs.existsSync(filename)) {
    links = JSON.parse(
      fs.readFileSync(filename, "utf8"),
    );
  } else {
    links = [];
  }

  nodes.forEach((node) => {
    node.title = node.editorData.blocks[0].data.text;
  });

  return {
    nodes,
    links,
  };
};


const setGraph = (graph, userId) => {
  graph.nodes.forEach((node) => {
    update(node, userId);
  });
  const filename = path.join(DATA_FOLDER, userId + ".links.json");
  fs.writeFileSync(filename, JSON.stringify(graph.links), "utf8");
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


const remove = (noteId, userId) => {
  const filename = path.join(
    DATA_FOLDER, userId + "." + noteId + NOTE_FILE_SUFFIX,
  );
  fs.unlinkSync(filename);
  return true;
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
};
