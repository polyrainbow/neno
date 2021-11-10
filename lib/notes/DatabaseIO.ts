import { cloneObject, stringContainsUUID } from "../utils.js";
import { FileId } from "./interfaces/FileId.js";
import { DatabaseId } from "./interfaces/DatabaseId.js";
import { Readable } from "stream";
import DatabaseMainData from "./interfaces/DatabaseMainData.js";
import ReadableWithMimeType from "./interfaces/ReadableWithMimeType.js";
import * as config from "./config.js";
import { ErrorMessage } from "./interfaces/ErrorMessage.js";


export default class DatabaseIO {
  #storageProvider;
  #loadedMainDataObjects:DatabaseMainData[] = [];

  #MAIN_DATA_FILE_NAME = "main.db.json";
  #NAME_OF_FILE_FOLDERS = "files";



  private getFileFolderPath(databaseId: DatabaseId) {
    const USER_DB_FOLDER = databaseId;
    const fileFolderPath = this.#storageProvider.joinPath(
      USER_DB_FOLDER,
      this.#NAME_OF_FILE_FOLDERS,
    );
    return fileFolderPath;
  }


  private async readMainDataFile(
    databaseId: DatabaseId,
  ):Promise<DatabaseMainData | null> {
    const filename = this.#storageProvider.joinPath(
      databaseId,
      this.#MAIN_DATA_FILE_NAME,
    );

    try {
      const json = await this.#storageProvider.readObjectAsString(filename);
      const object:DatabaseMainData = JSON.parse(json);
      return object;
    } catch (e) {
      console.log(e);
      console.error("Could not find or parse file " + filename);
      return null;
    }
  }


  private async writeMainDataFile (databaseId: DatabaseId, value) {
    await this.#storageProvider.writeObject(
      this.#storageProvider.joinPath(databaseId, this.#MAIN_DATA_FILE_NAME),
      JSON.stringify(value),
    );
  }


  private async createDatabase (
    databaseId: DatabaseId,
  ): Promise<DatabaseMainData> {
    const newMainData:DatabaseMainData = {
      creationTime: Date.now(),
      updateTime: Date.now(),
      id: databaseId,
      notes: [],
      links: [],
      idCounter: 0,
      screenPosition: {
        translateX: 200, // good value to see INPI completely
        translateY: 200, // good value to see INPI completely
        scale: 1,
      },
      initialNodePosition: {
        x: 0,
        y: 0,
      },
      pinnedNotes: [],
    };
    await this.writeMainDataFile(databaseId, newMainData);

    return newMainData;
  }


  /**
    PUBLIC
  **/

  constructor(config) {
    this.#storageProvider = config.storageProvider;
  }


  async getMainData(dbId: DatabaseId):Promise<DatabaseMainData> {
    // 1. try to get from loaded objects
    const mainDataFromLoadedObjects:DatabaseMainData | undefined
      = this.#loadedMainDataObjects.find(
        (db) => db.id === dbId,
      );

    if (mainDataFromLoadedObjects) {
      return mainDataFromLoadedObjects;
    }

    // 2. try to get from file
    const mainDataFromFile:DatabaseMainData | null
      = await this.readMainDataFile(dbId);
    if (mainDataFromFile) {
      this.#loadedMainDataObjects.push(mainDataFromFile);
      return mainDataFromFile;
    }

    // 3. create new database and return main data
    const mainDataFromNewDB:DatabaseMainData = await this.createDatabase(dbId);
    return mainDataFromNewDB;
  }

  // flushChanges makes sure that the changes applied to the main data object are
  // written to the disk and thus are persistent. it should always be called
  // after any operations on the main data object have been performed.
  async flushChanges (db:DatabaseMainData):Promise<boolean> {
    db.updateTime = Date.now();

    const mdFromLoadedMDOsIndex:number
      = this.#loadedMainDataObjects.findIndex((loadedDB) => {
        return loadedDB.id === db.id;
      });

    if (mdFromLoadedMDOsIndex > -1) {
      this.#loadedMainDataObjects[mdFromLoadedMDOsIndex] = db;
    } else {
      this.#loadedMainDataObjects.push(db);
    }

    await this.writeMainDataFile(db.id, db);
    return true;
  }


  async forEach (
    handler:(DatabaseMainData) => any,
  ):Promise<void> {
    const databases = await this.#storageProvider.listSubDirectories("")
    
    for (let i = 0; i < databases.length; i++) {
      const dbId:DatabaseId = databases[i];
      const mainData:DatabaseMainData = await this.getMainData(dbId);
      const mainDataCopy:DatabaseMainData = cloneObject(mainData);
      handler(mainDataCopy);
      await this.flushChanges(mainDataCopy);
    }
  }


  async addFile(
    databaseId: DatabaseId,
    fileId:FileId,
    source:Readable,
  ):Promise<void> {
    const fileFolderPath = this.getFileFolderPath(databaseId);
    const filepath = this.#storageProvider.joinPath(fileFolderPath, fileId);
    await this.#storageProvider.writeObjectFromReadable(filepath, source);
  }


  async deleteFile(
    databaseId: DatabaseId,
    fileId:FileId,
  ):Promise<void> {
    const fileFolderPath = this.getFileFolderPath(databaseId);
    await this.#storageProvider.removeObject(
      this.#storageProvider.joinPath(fileFolderPath, fileId),
    );
  }


  async getReadableMainDataStream(
    databaseId:DatabaseId,
  ):Promise<Readable> {
    const filename = this.#storageProvider.joinPath(
      databaseId,
      this.#MAIN_DATA_FILE_NAME,
    );
    const stream = await this.#storageProvider.getReadableStream(filename);
    return stream;
  }


  async getReadableFileStream(
    databaseId: DatabaseId,
    fileId:FileId,
    range,
  ):Promise<ReadableWithMimeType> {
    const fileFolderPath = this.getFileFolderPath(databaseId);
    const filepath = this.#storageProvider.joinPath(fileFolderPath, fileId);
    const stream
      = await this.#storageProvider.getReadableStream(filepath, range);

    const fileEnding = fileId.substr(fileId.lastIndexOf(".") + 1)
      .toLocaleLowerCase();

    const fileInfo = config.ALLOWED_FILE_TYPES
      .find((filetype) => {
        return filetype.ending === fileEnding;
      });

    if (!fileInfo) {
      throw Error(ErrorMessage.INVALID_FILE_ENDING);
    }

    const mimeType = fileInfo.mimeType;

    return {
      readable: stream,
      mimeType,
    };
  }


  async getFileSize(
    databaseId: DatabaseId,
    fileId:FileId,
  ):Promise<number> {
    const fileFolderPath = this.getFileFolderPath(databaseId);
    const filepath = this.#storageProvider.joinPath(fileFolderPath, fileId);
    const fileSize
      = await this.#storageProvider.getFileSize(filepath);

    return fileSize;
  }


  async getSizeOfDatabaseFiles(
    databaseId: DatabaseId,
  ):Promise<number> {
    const fileFolderPath = this.getFileFolderPath(databaseId);
    // maybe the file folder was not created yet, so let's just try
    try {
      const size = await this.#storageProvider.getFolderSize(fileFolderPath);
      return size;
    } catch (e) {
      return 0;
    }
  }


  async getSizeOfDatabaseMainData(
    databaseId: DatabaseId,
  ):Promise<number> {
    const filepath = this.#storageProvider.joinPath(
      databaseId,
      this.#MAIN_DATA_FILE_NAME,
    );
    const fileSize
      = await this.#storageProvider.getFileSize(filepath);

    return fileSize;
  }


  async getReadableDatabaseStream(
    databaseId: DatabaseId,
    withUploads: boolean,
  ) {
    if (!withUploads) {
      return await this.getReadableMainDataStream(databaseId);
    }

    return this.#storageProvider.getArchiveStreamOfFolder(databaseId);
  }


  async getNumberOfFiles(
    databaseId: DatabaseId,
  ):Promise<number> {
    const fileFolderPath = this.getFileFolderPath(databaseId);

    // it could be that the directory does not exist yet
    try {
      const files = (await this.#storageProvider.listDirectory(fileFolderPath))
        .filter(stringContainsUUID);

      return files.length;
    } catch (e) {
      return 0;
    }
  }
}
