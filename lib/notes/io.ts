import { cloneObject, stringContainsUUID } from "../utils.js";
import { FileId } from "./interfaces/FileId.js";
import { DatabaseId } from "./interfaces/DatabaseId.js";
import { Readable } from "stream";
import DatabaseMainData from "./interfaces/DatabaseMainData.js";

let storageProvider;

const MAIN_DATA_FILE_NAME = "main.db.json";
const NAME_OF_FILE_FOLDERS = "files";

const getFileFolderPath = (databaseId: DatabaseId) => {
  const USER_DB_FOLDER = databaseId;
  const fileFolderPath = storageProvider.joinPath(
    USER_DB_FOLDER,
    NAME_OF_FILE_FOLDERS,
  );
  return fileFolderPath;
}

const loadedMainDataObjects:DatabaseMainData[] = [];


const readMainDataFile = async (
  databaseId: DatabaseId,
):Promise<DatabaseMainData | null> => {
  const filename = storageProvider.joinPath(
    databaseId,
    MAIN_DATA_FILE_NAME,
  );

  try {
    const json = await storageProvider.readObjectAsString(filename);
    const object:DatabaseMainData = JSON.parse(json);
    return object;
  } catch (e) {
    console.log(e);
    console.error("Could not find or parse file " + filename);
    return null;
  }
};


const writeMainDataFile = async (databaseId: DatabaseId, value) => {
  await storageProvider.writeObject(
    storageProvider.joinPath(databaseId, MAIN_DATA_FILE_NAME),
    JSON.stringify(value),
  );
};


const createDatabase = async (
  databaseId: DatabaseId,
): Promise<DatabaseMainData> => {
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
    },
    pinnedNotes: [],
  };
  await writeMainDataFile(databaseId, newMainData);

  return newMainData;
};


/**
  EXPORTS
**/

const init = (config):void => {
  console.log("Initializing Notes IO module...");
  storageProvider = config.storageProvider;
};


const getMainData = async (dbId: DatabaseId):Promise<DatabaseMainData> => {
  // 1. try to get from loaded objects
  const mainDataFromLoadedObjects:DatabaseMainData | undefined
    = loadedMainDataObjects.find(
      (db) => db.id === dbId,
    );

  if (mainDataFromLoadedObjects) {
    return mainDataFromLoadedObjects;
  }

  // 2. try to get from file
  const mainDataFromFile:DatabaseMainData | null
    = await readMainDataFile(dbId);
  if (mainDataFromFile) {
    loadedMainDataObjects.push(mainDataFromFile);
    return mainDataFromFile;
  }

  // 3. create new database and return main data
  const mainDataFromNewDB:DatabaseMainData = await createDatabase(dbId);
  return mainDataFromNewDB;
};

// flushChanges makes sure that the changes applied to the main data object are
// written to the disk and thus are persistent. it should always be called
// after any operations on the main data object have been performed.
const flushChanges = async (db:DatabaseMainData):Promise<boolean> => {
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

  await writeMainDataFile(db.id, db);
  return true;
};


const forEach = async (
  handler:(DatabaseMainData) => any,
):Promise<void> => {
  const databases = await storageProvider.listSubDirectories("")
  
  for (let i = 0; i < databases.length; i++) {
    const dbId:DatabaseId = databases[i];
    const mainData:DatabaseMainData = await getMainData(dbId);
    const mainDataCopy:DatabaseMainData = cloneObject(mainData);
    handler(mainDataCopy);
    await flushChanges(mainDataCopy);
  }
};


const addFile = async (
  databaseId: DatabaseId,
  fileId:FileId,
  source:Readable,
):Promise<void> => {
  const fileFolderPath = getFileFolderPath(databaseId);
  const filepath = storageProvider.joinPath(fileFolderPath, fileId);
  await storageProvider.writeObjectFromReadable(filepath, source);
};


const deleteFile = async (
  databaseId: DatabaseId,
  fileId:FileId,
):Promise<void> => {
  const fileFolderPath = getFileFolderPath(databaseId);
  await storageProvider.removeObject(
    storageProvider.joinPath(fileFolderPath, fileId),
  );
};


const getReadableMainDataStream = async (
  databaseId:DatabaseId,
):Promise<Readable> => {
  const filename = storageProvider.joinPath(
    databaseId,
    MAIN_DATA_FILE_NAME,
  );
  const stream = await storageProvider.getReadableStream(filename);
  return stream;
};


const getReadableFileStream = async (
  databaseId: DatabaseId,
  fileId:FileId,
):Promise<Readable> => {
  const fileFolderPath = getFileFolderPath(databaseId);
  const filepath = storageProvider.joinPath(fileFolderPath, fileId);
  const stream = await storageProvider.getReadableStream(filepath);
  return stream;
};



const getReadableDatabaseStream = async (
  databaseId: DatabaseId,
  withUploads: boolean,
) => {
  if (!withUploads) {
    return await getReadableMainDataStream(databaseId);
  }

  return storageProvider.getArchiveStreamOfFolder(databaseId);
};


const getNumberOfFiles = async (
  databaseId: DatabaseId,
) => {
  const fileFolderPath = getFileFolderPath(databaseId);
  const files = (await storageProvider.listDirectory(fileFolderPath))
    .filter(stringContainsUUID);

  return files.length;
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
  getNumberOfFiles,
};
