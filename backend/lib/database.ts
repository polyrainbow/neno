import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import { cloneObject } from "./utils.js";
import * as url from "url";
import { Filepath } from "../interfaces/Filepath.js";
import { FileId } from "../interfaces/FileId.js";
import { DatabaseId } from "../interfaces/DatabaseId.js";
import { Readable } from "stream";
import DatabaseMainData from "../interfaces/DatabaseMainData.js";
import FileReadableWithName from "../interfaces/FileReadableWithName.js";
import archiver from "archiver";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const MAIN_DATA_FILE_NAME = "main.db.json";
const NAME_OF_FILE_FOLDERS = "files";
let DATA_FOLDER = path.join(__dirname, "..", "..", "..", "network-notes-data");

const getFileFolderPath = (databaseId: DatabaseId) => {
  const USER_DB_FOLDER = path.join(DATA_FOLDER, databaseId);
  const fileFolderPath = path.join(USER_DB_FOLDER, NAME_OF_FILE_FOLDERS);
  return fileFolderPath;
}

const loadedMainDataObjects:DatabaseMainData[] = [];


const readMainDataFile = (databaseId: DatabaseId) => {
  const filename = path.join(DATA_FOLDER, databaseId, MAIN_DATA_FILE_NAME);

  try {
    const json
      = fs.readFileSync(
        filename,
        "utf8",
      );
    const object = JSON.parse(json);
    return object;
  } catch (e) {
    console.log(e);
    console.error("Could not find or parse file " + filename);
    return null;
  }
};


const writeMainDataFile = (databaseId: DatabaseId, value) => {
  fs.writeFileSync(
    path.join(DATA_FOLDER, databaseId, MAIN_DATA_FILE_NAME),
    JSON.stringify(value),
    "utf8",
  );
};


const createDatabase = (databaseId: DatabaseId): DatabaseMainData => {
  mkdirp.sync(path.join(DATA_FOLDER, databaseId));
  mkdirp.sync(getFileFolderPath(databaseId));

  const newMainData:DatabaseMainData = {
    timestamp: Date.now(),
    id: databaseId,
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
  writeMainDataFile(databaseId, newMainData);

  return newMainData;
};


/**
  EXPORTS
**/

const init = (config) => {
  console.log("Initializing DB module...");
  DATA_FOLDER = config.dataFolderPath;
  mkdirp.sync(DATA_FOLDER);
};


const getMainData = (id: DatabaseId):DatabaseMainData => {
  // 1. try to get from loaded objects
  const mainDataFromLoadedObjects:DatabaseMainData | undefined
    = loadedMainDataObjects.find(
      (db) => db.id === id,
    );

  if (mainDataFromLoadedObjects) {
    return mainDataFromLoadedObjects;
  }

  // 2. try to get from file
  const mainDataFromFile:DatabaseMainData | null
    = readMainDataFile(id);
  if (mainDataFromFile) {
    loadedMainDataObjects.push(mainDataFromFile);
    return mainDataFromFile;
  }

  // 3. create new database and return main data
  const mainDataFromNewDB:DatabaseMainData = createDatabase(id);
  return mainDataFromNewDB;
};

// flushChanges makes sure that the changes applied to the main data object are
// written to the disk and thus are persistent. it should always be called
// after any operations on the main data object have been performed.
const flushChanges = (db:DatabaseMainData):boolean => {
  db.timestamp = Date.now();

  const mdFromLoadedMDOsIndex:number
    = loadedMainDataObjects.findIndex((loadedDB) => {
      return loadedDB.id === db.id;
    });

  if (mdFromLoadedMDOsIndex > -1) {
    loadedMainDataObjects[mdFromLoadedMDOsIndex] = db;
  } else {
    loadedMainDataObjects.push(db);
  }

  writeMainDataFile(db.id, db);
  return true;
};


const forEach = (handler:Function) => {
  return fs.readdirSync(DATA_FOLDER)
    .filter((objectName:string) => {
      const stat = fs.statSync(path.join(DATA_FOLDER, objectName));
      return stat.isDirectory();
    })
    .forEach((databaseId:DatabaseId) => {
      const mainData = getMainData(databaseId);
      const mainDataCopy = cloneObject(mainData);
      handler(mainDataCopy);
      flushChanges(mainDataCopy);
    });
};


const addFile = (
  databaseId: DatabaseId,
  fileId:FileId,
  sourcePath:Filepath,
):boolean => {
  const fileFolderPath = getFileFolderPath(databaseId);
  const newPath = path.join(fileFolderPath, fileId);
  fs.renameSync(sourcePath, newPath);
  return true;
};


const deleteFile = (databaseId: DatabaseId, fileId:FileId):boolean => {
  const fileFolderPath = getFileFolderPath(databaseId);
  fs.unlinkSync(path.join(fileFolderPath, fileId));
  return true;
};


const getReadableMainDataStream = (id:DatabaseId):Readable => {
  const db = getMainData(id);
  const s = new Readable();
  s.push(JSON.stringify(db))    // the string you want
  s.push(null)      // indicates end-of-file basically - the end of the stream
  return s;
};


const getReadableFileStream = (
  databaseId: DatabaseId,
  fileId:FileId,
):Readable => {
  const fileFolderPath = getFileFolderPath(databaseId);
  const filepath = path.join(fileFolderPath, fileId);
  return fs.createReadStream(filepath);
};



const getReadableDatabaseStream = (
  databaseId: DatabaseId,
  withUploads: boolean,
) => {
  if (!withUploads) {
    return getReadableMainDataStream(databaseId);
  }

  const archive = archiver("zip");

  archive.on("error", function(err) {
    throw new Error(err);
  });

  // on stream closed we can end the request
  archive.on("end", function() {
    const size = archive.pointer();
    console.log(`Archive for ${databaseId} created. Size: ${size} bytes`);
  });

  const fileFolderPath = getFileFolderPath(databaseId);
  archive.directory(fileFolderPath, "files");

  const mainDataStream = getReadableMainDataStream(databaseId);
  archive.append(
    mainDataStream,
    {
      name: MAIN_DATA_FILE_NAME,
    },
  );

  archive.finalize();

  return archive;
};


export {
  init,
  getMainData,
  flushChanges,
  forEach,
  addFile,
  deleteFile,
  getReadableMainDataStream,
  getReadableFileStream,
  getReadableDatabaseStream,
};
