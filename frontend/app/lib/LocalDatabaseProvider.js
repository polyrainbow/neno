import * as IDB from "idb-keyval";
import FileSystemAccessAPIStorageProvider
  from "./FileSystemAccessAPIStorageProvider.js";


async function verifyPermission(fileHandle, readWrite) {
  const options = {};
  if (readWrite) {
    options.mode = "readwrite";
  }
  // Check if permission was already granted. If so, return true.
  if ((await fileHandle.queryPermission(options)) === "granted") {
    return true;
  }
  // Request permission. If the user grants permission, return true.
  if ((await fileHandle.requestPermission(options)) === "granted") {
    return true;
  }
  // The user didn't grant permission, so return false.
  return false;
}


export default class LocalDatabaseProvider {
  static #handleStorageKey = "LOCAL_DB_FOLDER_HANDLE";
  #isDatabaseInitialized = false;
  #folderHandle = null;

  /* PUBLIC */

  static features = ["DATABASE_FOLDER"];
  static type = "LOCAL";

  // when we return that we have an access token, the app switches to editor
  // mode and the editor will start fetching data, so we need to be prepared
  // and initialize the database
  async hasFolderHandle() {
    if (this.#folderHandle) {
      return true;
    }

    const folderHandle = await IDB.get(LocalDatabaseProvider.#handleStorageKey);
    if (typeof folderHandle === "undefined") {
      return false;
    }

    this.#folderHandle = folderHandle;
    return true;
  }


  /* when using a local db folder, we'll always call this db the same */
  static dbId = "local";

  #notesModule;

  async login(folderHandle) {
    await IDB.set(
      LocalDatabaseProvider.#handleStorageKey,
      folderHandle,
    );

    this.#folderHandle = folderHandle;

    await this.initializeDatabase();
  }


  async removeAccess() {
    await IDB.del(LocalDatabaseProvider.#handleStorageKey);
  }


  async initializeDatabase() {
    if (this.#isDatabaseInitialized) {
      return;
    }

    if (!this.#folderHandle) {
      throw new Error(
        "Initializing local DB not possible because folder handle is missing",
      );
    }

    const readWriteAllowed = await verifyPermission(this.#folderHandle, true);

    if (!readWriteAllowed) {
      return false;
    }

    this.#notesModule = await import("../../../lib/notes/index.ts");

    const storageProvider
      = new FileSystemAccessAPIStorageProvider(this.#folderHandle);

    await this.#notesModule.init(storageProvider);

    this.#isDatabaseInitialized = true;
  }


  getNote(noteId) {
    return this.#notesModule.get(noteId, LocalDatabaseProvider.dbId);
  }

  getNotes(options) {
    return this.#notesModule.getNotesList(LocalDatabaseProvider.dbId, options);
  }

  getStats() {
    return this.#notesModule.getStats(LocalDatabaseProvider.dbId);
  }

  deleteNote(noteId) {
    return this.#notesModule.remove(noteId, LocalDatabaseProvider.dbId);
  }

  putNote(noteToTransmit, options) {
    return this.#notesModule.put(
      noteToTransmit,
      LocalDatabaseProvider.dbId,
      options,
    );
  }

  importLinksAsNotes(links) {
    return this.#notesModule.importLinksAsNotes(
      LocalDatabaseProvider.dbId,
      links,
    );
  }

  saveGraph(graphObject) {
    return this.#notesModule.setGraph(
      graphObject,
      LocalDatabaseProvider.dbId,
    );
  }

  getGraphObject() {
    return this.#notesModule.getGraph(
      LocalDatabaseProvider.dbId,
    );
  }

  getReadableDatabaseStream(includingImagesAndFiles) {
    return this.#notesModule.getReadableDatabaseStream(
      LocalDatabaseProvider.dbId,
      includingImagesAndFiles,
    );
  }

  uploadFile(file) {
    return this.#notesModule.addFile(
      LocalDatabaseProvider.dbId,
      file.stream(),
      file.type,
    );
  }


  pinNote(noteId) {
    return this.#notesModule.pin(LocalDatabaseProvider.dbId, noteId);
  }

  unpinNote(noteId) {
    return this.#notesModule.unpin(LocalDatabaseProvider.dbId, noteId);
  }

  getPins() {
    return this.#notesModule.getPins(LocalDatabaseProvider.dbId);
  }
}
