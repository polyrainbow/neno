const fs = require("fs");
const path = require("path");
const getKeySortFunction = require("./utils.js").getKeySortFunction;

const NOTE_FILE_SUFFIX = ".note.json";
const DATA_FOLDER = path.join(__dirname, "data");

const getNewId = () => {
  const idFile = path.join(DATA_FOLDER, "idcounter");

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


const get = (noteId) => {
  const filename = path.join(DATA_FOLDER, noteId + NOTE_FILE_SUFFIX);
  const note = JSON.parse(fs.readFileSync(filename));
  return note;
};


const getAll = () => {
  return fs.readdirSync(DATA_FOLDER)
    .filter((filename) => {
      return filename.endsWith(NOTE_FILE_SUFFIX);
    })
    .map((filename) => {
      const string = fs.readFileSync(path.join(DATA_FOLDER, filename), "utf8");
      return JSON.parse(string);
    })
    .sort(getKeySortFunction("id"));
};


const getGraph = () => {
  const nodes = getAll();
  const filename = path.join(DATA_FOLDER, "links.json");

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


const setGraph = (graph) => {
  graph.nodes.forEach(update);
  const filename = path.join(DATA_FOLDER, "links.json");
  fs.writeFileSync(filename, JSON.stringify(graph.links), "utf8");
};


const create = (noteFromUser) => {
  const id = getNewId();
  const note = {
    id,
    x: 0,
    y: 0,
    ...noteFromUser,
  };
  const filename = path.join(DATA_FOLDER, id + NOTE_FILE_SUFFIX);
  fs.writeFileSync(filename, JSON.stringify(note), "utf8");
  return note;
};


const update = (updatedNote) => {
  const filename = path.join(DATA_FOLDER, updatedNote.id + NOTE_FILE_SUFFIX);
  fs.writeFileSync(filename, JSON.stringify(updatedNote), "utf8");
  return updatedNote;
};


const remove = (noteId) => {
  const filename = path.join(DATA_FOLDER, noteId + NOTE_FILE_SUFFIX);
  fs.unlinkSync(filename);
  return true;
};

module.exports = {
  get,
  getAll,
  getGraph,
  setGraph,
  create,
  update,
  remove,
};
