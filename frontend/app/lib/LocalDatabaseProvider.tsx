import * as IDB from "idb-keyval";
import DatabaseQuery from "../../../lib/notes/interfaces/DatabaseQuery.js";
import { FileId } from "../../../lib/notes/interfaces/FileId.js";
import { GraphId } from "../../../lib/notes/interfaces/GraphId.js";
import GraphStats from "../../../lib/notes/interfaces/GraphStats.js";
import GraphStatsRetrievalOptions
  from "../../../lib/notes/interfaces/GraphStatsRetrievalOptions.js";
import { NoteId } from "../../../lib/notes/interfaces/NoteId.js";
import NoteListPage from "../../../lib/notes/interfaces/NoteListPage.js";
import NotePutOptions from "../../../lib/notes/interfaces/NotePutOptions.js";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit.js";
import UrlMetadataResponse
  from "../../../lib/notes/interfaces/UrlMetadataResponse.js";
import DatabaseProvider from "../interfaces/DatabaseProvider.js";
import FileSystemAccessAPIStorageProvider
  from "./FileSystemAccessAPIStorageProvider.js";
import { streamToBlob } from "./utils.js";


async function verifyPermission(fileHandle, readWrite) {
  const options = {};
  if (readWrite) {
    // @ts-ignore
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


export default class LocalDatabaseProvider implements DatabaseProvider {
  static #handleStorageKey = "LOCAL_DB_FOLDER_HANDLE";
  #isDatabaseInitialized = false;
  #folderHandle:FileSystemDirectoryHandle | null = null;
  #notesModule: typeof import("../../../lib/notes/index");

  /* PUBLIC */

  static features = ["DATABASE_FOLDER"];
  static type = "LOCAL";
  /* when using a local graph folder, we'll always call this graph the same */
  static graphId:GraphId = "local-graph";


  // when we return that we have an access token, the app switches to editor
  // mode and the editor will start fetching data, so we need to be prepared
  // and initialize the database
  async getFolderHandleName():Promise<string | null> {
    if (this.#folderHandle) {
      return this.#folderHandle.name;
    }

    const folderHandle = await IDB.get(LocalDatabaseProvider.#handleStorageKey);
    if (typeof folderHandle === "undefined") {
      return null;
    }

    this.#folderHandle = folderHandle as FileSystemDirectoryHandle;
    return this.#folderHandle.name;
  }


  async login(folderHandle:FileSystemDirectoryHandle):Promise<void> {
    await IDB.set(
      LocalDatabaseProvider.#handleStorageKey,
      folderHandle,
    );

    this.#folderHandle = folderHandle;

    await this.initializeDatabase();
  }


  getActiveGraphId():GraphId {
    return LocalDatabaseProvider.graphId;
  }


  async removeAccess():Promise<void> {
    this.#folderHandle = null;
    await IDB.del(LocalDatabaseProvider.#handleStorageKey);

    /*
      When we initialize a local db a 2nd time during runtime, it could be
      another db in another directory. It is important that we then also
      reinitialize the Notes module with an up-to-date storageProvider.
      On removing access, we make sure that we forget about the 1st db
      initialization.
    */
    this.#isDatabaseInitialized = false;
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

    this.#notesModule = await import("../../../lib/notes/index");

    const storageProvider
      = new FileSystemAccessAPIStorageProvider(this.#folderHandle);

    try {
      await this.#notesModule.init(
        storageProvider,
        () => crypto.randomUUID(),
      );
    } catch (e) {
      console.error(
        "Initializing notes module not possible. "
        + "Removing folder handle because it could be outdated",
      );
      await this.removeAccess();
      throw new Error(e);
    }

    this.#isDatabaseInitialized = true;
  }


  getNote(noteId:NoteId):Promise<NoteToTransmit | null> {
    return this.#notesModule.get(noteId, LocalDatabaseProvider.graphId);
  }

  getNotes(options:DatabaseQuery):Promise<NoteListPage> {
    return this.#notesModule.getNotesList(
      LocalDatabaseProvider.graphId,
      options,
    );
  }

  getStats(options:GraphStatsRetrievalOptions):Promise<GraphStats> {
    return this.#notesModule.getStats(LocalDatabaseProvider.graphId, options);
  }

  deleteNote(noteId:NoteId): Promise<void> {
    return this.#notesModule.remove(noteId, LocalDatabaseProvider.graphId);
  }

  putNote(noteToTransmit:NoteToTransmit, options:NotePutOptions) {
    return this.#notesModule.put(
      noteToTransmit,
      LocalDatabaseProvider.graphId,
      options,
    );
  }

  importLinksAsNotes(links) {
    return this.#notesModule.importLinksAsNotes(
      LocalDatabaseProvider.graphId,
      links,
    );
  }

  saveGraphVisualization(graphVisualization) {
    return this.#notesModule.setGraphVisualization(
      graphVisualization,
      LocalDatabaseProvider.graphId,
    );
  }

  async getGraphVisualization() {
    const graphVisualization = await this.#notesModule.getGraphVisualization(
      LocalDatabaseProvider.graphId,
    );

    /*
      It's necessary to make the returned object from the notes module
      mutation-resistant, because the graph module would not work correctly
      otherwise: Node dragging would do weird things with INPI.
      So let's serialize and re-parse
    */
    return JSON.parse(JSON.stringify(graphVisualization));
  }

  getReadableGraphStream(withFiles) {
    return this.#notesModule.getReadableGraphStream(
      LocalDatabaseProvider.graphId,
      withFiles,
    );
  }


  uploadFile(file:File) {
    return this.#notesModule.addFile(
      LocalDatabaseProvider.graphId,
      // @ts-ignore
      file.stream(),
      file.type,
    );
  }


  deleteFile(fileId:FileId) {
    return this.#notesModule.deleteFile(
      LocalDatabaseProvider.graphId,
      fileId,
    );
  }


  getUrlMetadata(url:string):Promise<UrlMetadataResponse> {
    return this.#notesModule.getUrlMetadata(url);
  }


  getFiles() {
    return this.#notesModule.getFiles(LocalDatabaseProvider.graphId);
  }


  getDanglingFiles() {
    return this.#notesModule.getDanglingFiles(LocalDatabaseProvider.graphId);
  }


  getReadableFileStream(fileId) {
    return this.#notesModule.getReadableFileStream(
      LocalDatabaseProvider.graphId,
      fileId,
    );
  }


  pinNote(noteId) {
    return this.#notesModule.pin(LocalDatabaseProvider.graphId, noteId);
  }

  unpinNote(noteId) {
    return this.#notesModule.unpin(LocalDatabaseProvider.graphId, noteId);
  }

  getPins() {
    return this.#notesModule.getPins(LocalDatabaseProvider.graphId);
  }

  /**
   * Obtains a URL for a file.
   * @param {string} fileId
   * @param {string?} publicName This optional file name is appended at the url
   * so that if the user decides to download the file, it is saved with this
   * public name instead of the more technical fileId.
   * @return {string} url
  */
  async getUrlForFileId(fileId) {
    const { readable, mimeType }
      = await this.getReadableFileStream(
        fileId,
      );
    const blob = await streamToBlob(readable, mimeType);
    const url = URL.createObjectURL(blob);
    return url;
  }
}
