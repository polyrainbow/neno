const fs = require("fs");
const path = require("path");

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
  const notes = [];
  fs.readdirSync(DATA_FOLDER).forEach((filename) => {
    if (!filename.endsWith(".json")) {
      return;
    }
    const string = fs.readFileSync(path.join(DATA_FOLDER, filename), "utf8");
    const note = JSON.parse(string);
    notes.push(note);
  });
  return notes;
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
  return id;
};


const update = (note) => {
  const filename = path.join(DATA_FOLDER, note.id + ".json");
  let noteFromDB = JSON.parse(fs.readFileSync(filename));
  noteFromDB = {
    ...noteFromDB,
    ...note,
  };
  fs.writeFileSync(filename, JSON.stringify(noteFromDB), "utf8");
};


const remove = (noteId) => {
  const filename = path.join(DATA_FOLDER, noteId + ".json");
  fs.deleteFileSync(filename);
  return true;
};

module.exports = {
  get,
  getAll,
  create,
  update,
  remove,
};
