const fs = require("fs");
const path = require("path");
const getKeySortFunction = require("./utils.js").getKeySortFunction;

const DATA_FOLDER = path.join(__dirname, "data");

const getNewId = () => {
  const idFile = path.join(DATA_FOLDER, "idcounter");
  let id = parseInt(fs.readFileSync(idFile));
  id++;
  fs.writeFileSync(idFile, id.toString(), "utf8");
  return id;
};

const get = (noteId) => {
  const filename = path.join(DATA_FOLDER, noteId + ".json");
  const note = JSON.parse(fs.readFileSync(filename));
  return note;
};


const getAll = () => {
  return fs.readdirSync(DATA_FOLDER)
    .filter((filename) => {
      return filename.endsWith(".json");
    })
    .map((filename) => {
      const string = fs.readFileSync(path.join(DATA_FOLDER, filename), "utf8");
      return JSON.parse(string);
    })
    .sort(getKeySortFunction("id"));
};

const create = (noteFromUser) => {
  console.log(noteFromUser);
  const id = getNewId();
  const note = {
    id,
    ...noteFromUser,
  };
  const filename = path.join(DATA_FOLDER, id + ".json");
  fs.writeFileSync(filename, JSON.stringify(note), "utf8");
  return note;
};


const update = (updatedNote) => {
  const filename = path.join(DATA_FOLDER, updatedNote.id + ".json");
  fs.writeFileSync(filename, JSON.stringify(updatedNote), "utf8");
  return updatedNote;
};


const remove = (noteId) => {
  const filename = path.join(DATA_FOLDER, noteId + ".json");
  fs.unlinkSync(filename);
  return true;
};

module.exports = {
  get,
  getAll,
  create,
  update,
  remove,
};
