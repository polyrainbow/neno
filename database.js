const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const cloneObject = require("./utils.js").cloneObject;

const DB_FILE_SUFFIX = ".db.json";
let DATA_FOLDER = null;
let newDBTemplate = null;
const loadedDBs = [];


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


/**
  EXPORTS
**/

const init = (config) => {
  console.log("Initializing DB module...");
  DATA_FOLDER = config.dataFolderPath;
  newDBTemplate = config.newDBTemplate;
  mkdirp(DATA_FOLDER);
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

  const newDB = cloneObject(newDBTemplate);
  newDB.id = id;
  writeJSONFileInDataFolder(id + DB_FILE_SUFFIX, newDB);
  return newDB;
};


const set = (db) => {
  db.timestamp = Date.now();
  writeJSONFileInDataFolder(db.id + DB_FILE_SUFFIX, db);
};


const forEach = (handler) => {
  return fs.readdirSync(DATA_FOLDER)
    .filter((filename) => {
      return filename.endsWith(DB_FILE_SUFFIX);
    })
    .forEach((filename) => {
      const id = filename.substr(0, filename.indexOf(DB_FILE_SUFFIX));
      const db = get(id);
      handler(db);
      set(db);
    });
};

module.exports = {
  init,
  get,
  set,
  forEach,
};
