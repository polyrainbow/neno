import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import { cloneObject } from "./utils.js";
import Database from "../interfaces/Database.js";
import * as url from "url";
import { FileDescriptor } from "../interfaces/FileDescriptor.js";
import { FileId } from "../interfaces/FileId.js";
import { UserId } from "../interfaces/UserId.js";
import { DatabaseId } from "../interfaces/DatabaseId.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const DB_FILE_SUFFIX = ".db.json";
let DATA_FOLDER = path.join(__dirname, "..", "..", "..", "network-notes-data");
let UPLOAD_PATH = path.join(DATA_FOLDER, "uploads");
const loadedDBs:Database[] = [];


const readJSONFileInDataFolder = (filename:FileDescriptor) => {
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

const writeJSONFileInDataFolder = (filename:FileDescriptor, value) => {
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
  UPLOAD_PATH = path.join(DATA_FOLDER, "uploads");
  mkdirp.sync(DATA_FOLDER);
};


const get = (id: DatabaseId):Database => {
  const dbFromLoadedDBs:Database | undefined = loadedDBs.find(
    (db) => db.id === id,
  );
  if (dbFromLoadedDBs) {
    return dbFromLoadedDBs;
  }

  const dbFromFile:Database | null
    = readJSONFileInDataFolder(id + DB_FILE_SUFFIX);
  if (dbFromFile) {
    loadedDBs.push(dbFromFile);
    return dbFromFile;
  }

  const newDB:Database = {
    timestamp: Date.now(),
    id: id,
    notes: [],
    links: [],
    idCounter: 0,
    screenPosition: {
      translateX: 0,
      translateY: 0,
      scale: 1,
    },
    initialNodePosition: {
      x: 0,
      y: 0,
    }
  };
  writeJSONFileInDataFolder(id + DB_FILE_SUFFIX, newDB);
  return newDB;
};

// flushChanges makes sure that the changes applied to the db object are
// written to the disk and thus are persistent. it should always be called
// after any operations on the db object have been performed.
const flushChanges = (db:Database):boolean => {
  db.timestamp = Date.now();

  const dbFromLoadedDBsIndex = loadedDBs.findIndex((loadedDB) => {
    return loadedDB.id === db.id;
  });

  if (dbFromLoadedDBsIndex > -1) {
    loadedDBs[dbFromLoadedDBsIndex] = db;
  } else {
    loadedDBs.push(db);
  }

  writeJSONFileInDataFolder(db.id + DB_FILE_SUFFIX, db);
  return true;
};


const forEach = (handler:Function) => {
  return fs.readdirSync(DATA_FOLDER)
    .filter((filename) => {
      return filename.endsWith(DB_FILE_SUFFIX);
    })
    .forEach((filename) => {
      const id = filename.substr(0, filename.indexOf(DB_FILE_SUFFIX));
      const db = get(id);
      const dbCopy = cloneObject(db);
      handler(dbCopy);
      flushChanges(dbCopy);
    });
};


const addBlob = (fileId:FileId, sourcePath:FileDescriptor):boolean => {
  mkdirp.sync(UPLOAD_PATH);
  const newpath = path.join(UPLOAD_PATH, fileId);
  fs.renameSync(sourcePath, newpath);
  return true;
};


const deleteBlob = (fileId:FileId):boolean => {
  fs.unlinkSync(path.join(UPLOAD_PATH, fileId));
  return true;
};


const getBlob = (fileId:FileId):FileDescriptor => {
  return path.join(UPLOAD_PATH, fileId);
};


const getDBFile = (userId:UserId):FileDescriptor => {
  return path.join(DATA_FOLDER, userId + DB_FILE_SUFFIX);
};


export {
  init,
  get,
  flushChanges,
  forEach,
  addBlob,
  deleteBlob,
  getBlob,
  getDBFile,
};
