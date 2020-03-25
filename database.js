const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

const DB_FILE_SUFFIX = ".db.json";
let DATA_FOLDER = null;
const loadedDBs = [];

const init = (dataFolderPath) => {
  DATA_FOLDER = dataFolderPath;
  mkdirp(DATA_FOLDER);
};


const readJSONFileInDataFolder = (filename) => {
  try {
    const json = fs.readFileSync(path.join(DATA_FOLDER, filename), "utf8");
    const object = JSON.parse(json);
    return object;
  } catch (e) {
    console.log(e);
    console.error("Could not find or parse file " + filename);
    return null;
  }
};

const writeJSONFileInDataFolder = (filename, value) => {
  fs.writeFileSync(
    path.join(DATA_FOLDER, filename),
    JSON.stringify(value),
    "utf8",
  );
};


const get = (id) => {
  const dbFromLoadedDBs = loadedDBs.find((db) => db.id === id);
  if (dbFromLoadedDBs) {
    return dbFromLoadedDBs;
  }

  const dbFromFile = readJSONFileInDataFolder(id + DB_FILE_SUFFIX);
  if (dbFromFile) {
    return dbFromFile;
  }

  const newDB = {
    id,
    notes: [],
    links: [],
    idCounter: 0,
    screenPosition: {
      translateX: 0,
      translateY: 0,
      scale: 1,
    },
  };

  writeJSONFileInDataFolder(id + DB_FILE_SUFFIX);
  return newDB;
};


const set = (db) => {
  writeJSONFileInDataFolder(db.id + DB_FILE_SUFFIX);
};

export {
  init,
  get,
  set,
};
