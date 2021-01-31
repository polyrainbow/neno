import { cloneObject, humanFileSize, stringContainsUUID } from "../utils.js";
import { FileId } from "./interfaces/FileId.js";
import { DatabaseId } from "./interfaces/DatabaseId.js";
import { Readable } from "stream";
import DatabaseMainData from "./interfaces/DatabaseMainData.js";
import archiver from "archiver";

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
    const fileBuffer = await storageProvider.readObject(filename);
    const json = fileBuffer.toString();
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


const getMainData = async (id: DatabaseId):Promise<DatabaseMainData> => {
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
    = await readMainDataFile(id);
  if (mainDataFromFile) {
    loadedMainDataObjects.push(mainDataFromFile);
    return mainDataFromFile;
  }

  // 3. create new database and return main data
  const mainDataFromNewDB:DatabaseMainData = await createDatabase(id);
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
    const databaseId:DatabaseId = databases[i];
    const mainData:DatabaseMainData = await getMainData(databaseId);
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


const getReadableMainDataStream = async (id:DatabaseId):Promise<Readable> => {
  const db = await getMainData(id);
  const readable = new Readable();
  readable.push(JSON.stringify(db));    // the string you want
  readable.push(null); // indicates end-of-file - the end of the stream
  return readable;
};


const getReadableFileStream = (
  databaseId: DatabaseId,
  fileId:FileId,
):Readable => {
  const fileFolderPath = getFileFolderPath(databaseId);
  const filepath = storageProvider.joinPath(fileFolderPath, fileId);
  return storageProvider.getReadableStream(filepath);
};



const getReadableDatabaseStream = async (
  databaseId: DatabaseId,
  withUploads: boolean,
) => {
  if (!withUploads) {
    return await getReadableMainDataStream(databaseId);
  }

  const archive = archiver("zip");

  archive.on("error", function(err) {
    throw new Error(err);
  });

  // on stream closed we can end the request
  archive.on("end", function() {
    const size = archive.pointer();
    const humanSize = humanFileSize(size);
    console.log(`Archive for ${databaseId} created. Size: ${humanSize}`);
  });

  const mainDataStream = await getReadableMainDataStream(databaseId);
  archive.append(
    mainDataStream,
    {
      name: MAIN_DATA_FILE_NAME,
    },
  );

  const fileFolderPath = getFileFolderPath(databaseId);
  const files = await storageProvider.listDirectory(fileFolderPath);
  for (let i = 0; i < files.length; i++) {
    const fileId = files[i];

    if (!stringContainsUUID(fileId)) {
      continue;
    }

    const readableStream = getReadableFileStream(databaseId, fileId);
    archive.append(
      readableStream,
      {
        name: NAME_OF_FILE_FOLDERS + "/" + fileId,
      },
    );
  }

  archive.finalize();

  return archive;
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
