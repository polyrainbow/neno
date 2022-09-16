import * as IDB from "idb-keyval";
import DatabaseQuery from "../../../lib/notes/interfaces/DatabaseQuery";
import { FileId } from "../../../lib/notes/interfaces/FileId";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import GraphStatsRetrievalOptions
  from "../../../lib/notes/interfaces/GraphStatsRetrievalOptions";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import NoteListPage from "../../../lib/notes/interfaces/NoteListPage";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import FileSystemAccessAPIStorageProvider
  from "./FileSystemAccessAPIStorageProvider";
import { streamToBlob } from "./utils";
import BackendGraphVisualization
  from "../../../lib/notes/interfaces/GraphVisualization";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { NoteSaveRequest } from "../../../lib/notes/interfaces/NoteSaveRequest";
import MimeTypes from "../../../lib/MimeTypes";


async function verifyPermission(
  fileSystemHandle: FileSystemHandle,
  readWrite: boolean,
): Promise<void> {
  const options: FileSystemHandlePermissionDescriptor = {};
  if (readWrite) {
    options.mode = "readwrite";
  }
  // Check if permission was already granted. If so, return true.
  if ((await fileSystemHandle.queryPermission(options)) === "granted") {
    return;
  }
  // Request permission. If the user grants permission, return true.
  if ((await fileSystemHandle.requestPermission(options)) === "granted") {
    return;
  }
  // The user didn't grant permission
  throw new Error("User did not grant permission to " + fileSystemHandle.name);
}


export default class LocalDatabaseProvider implements DatabaseProvider {
  /* PRIVATE */

  static #handleStorageKey = "LOCAL_DB_FOLDER_HANDLE";
  /* when using a local graph folder, we'll always call this graph the same */
  static #defaultFirstGraphId: GraphId = "graph-1";
  static #graphIndexFileName = "graphs.json";
  #isDatabaseInitialized = false;
  #folderHandle: FileSystemDirectoryHandle | null = null;
  #notesModule: typeof import("../../../lib/notes/index") | null = null;
  #graphIds: GraphId[] | null = null;
  #activeGraphId: string | null = null;
  #storageProvider: FileSystemAccessAPIStorageProvider | null = null;

  /* PUBLIC */

  static features = [
    "DATABASE_FOLDER",
    "MULTIPLE_GRAPHS",
  ];

  static type = "LOCAL";

  getActiveGraphId(): GraphId | null {
    return this.#activeGraphId;
  }

  getGraphIds(): GraphId[] | null {
    return this.#graphIds;
  }

  setActiveGraph(graphId) {
    this.#activeGraphId = graphId;
  }


  // when we return that we have an access token, the app switches to editor
  // mode and the editor will start fetching data, so we need to be prepared
  // and initialize the database
  async getFolderHandleName(): Promise<string | null> {
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


  async login(folderHandle: FileSystemDirectoryHandle): Promise<void> {
    await IDB.set(
      LocalDatabaseProvider.#handleStorageKey,
      folderHandle,
    );

    this.#folderHandle = folderHandle;

    await this.initializeDatabase();
  }


  async removeAccess(): Promise<void> {
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

    await verifyPermission(this.#folderHandle, true);

    this.#notesModule = await import("../../../lib/notes/index");

    this.#storageProvider
      = new FileSystemAccessAPIStorageProvider(this.#folderHandle);

    try {
      await this.#notesModule.init(
        this.#storageProvider,
        () => crypto.randomUUID(),
      );
    } catch (e) {
      console.error(
        "Initializing notes module not possible. "
        + "Removing folder handle because it could be outdated",
      );
      await this.removeAccess();
      throw e;
    }

    // try to get index file
    try {
      const graphsJson = await this.#storageProvider.readObjectAsString(
        "",
        LocalDatabaseProvider.#graphIndexFileName,
      );

      this.#graphIds = JSON.parse(graphsJson).graphIds as GraphId[];
    } catch (e) {
      // create new index file instead
      this.#graphIds = [LocalDatabaseProvider.#defaultFirstGraphId];

      const graphsFileContent = {
        graphIds: this.#graphIds,
      };
      const graphsFileContentString = JSON.stringify(graphsFileContent);
      await this.#storageProvider.writeObject(
        "",
        LocalDatabaseProvider.#graphIndexFileName,
        graphsFileContentString,
      );
    }

    this.#activeGraphId = this.#graphIds[0];

    this.#isDatabaseInitialized = true;
  }


  getRawNote(noteId: NoteId): Promise<string | null> {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.getRawNote(noteId, this.#activeGraphId);
  }


  getNote(noteId: NoteId): Promise<NoteToTransmit | null> {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.get(noteId, this.#activeGraphId);
  }


  getNotes(options: DatabaseQuery): Promise<NoteListPage> {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.getNotesList(
      this.#activeGraphId,
      options,
    );
  }

  getStats(options: GraphStatsRetrievalOptions): Promise<GraphStats> {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.getStats(this.#activeGraphId, options);
  }

  deleteNote(noteId: NoteId): Promise<void> {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.remove(noteId, this.#activeGraphId);
  }

  putNote(noteSaveRequest: NoteSaveRequest) {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.put(
      noteSaveRequest,
      this.#activeGraphId,
    );
  }


  saveGraphVisualization(graphVisualization) {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.setGraphVisualization(
      graphVisualization,
      this.#activeGraphId,
    );
  }

  async getGraphVisualization(): Promise<BackendGraphVisualization> {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    const graphVisualization = await this.#notesModule.getGraphVisualization(
      this.#activeGraphId,
    );

    /*
      It's necessary to make the returned object from the notes module
      mutation-resistant, because the graph module would not work correctly
      otherwise: Node dragging would do weird things with INPI.
      So let's create a clone.
    */
    return structuredClone(graphVisualization);
  }

  getReadableGraphStream(withFiles) {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.getReadableGraphStream(
      this.#activeGraphId,
      withFiles,
    );
  }


  uploadFile(file: File): Promise<FileInfo> {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.addFile(
      this.#activeGraphId,
      file.stream(),
      file.name,
    );
  }


  deleteFile(fileId: FileId) {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.deleteFile(
      this.#activeGraphId,
      fileId,
    );
  }


  getFiles() {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.getFiles(this.#activeGraphId);
  }


  getFileInfo(fileId: FileId): Promise<FileInfo> {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.getFileInfo(this.#activeGraphId, fileId);
  }


  getDanglingFiles() {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.getDanglingFiles(this.#activeGraphId);
  }


  getReadableFileStream(fileId) {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.getReadableFileStream(
      this.#activeGraphId,
      fileId,
    );
  }


  pinNote(noteId) {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.pin(this.#activeGraphId, noteId);
  }

  unpinNote(noteId) {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.unpin(this.#activeGraphId, noteId);
  }

  getPins() {
    if (!(this.#notesModule && this.#activeGraphId)) {
      throw new Error(
        "Database Provider has not been properly initialized yet.",
      );
    }
    return this.#notesModule.getPins(this.#activeGraphId);
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
    const readable
      = await this.getReadableFileStream(
        fileId,
      );
    const extension = this.#notesModule?.utils.getExtensionFromFilename(fileId);
    const mimeType = extension && MimeTypes.has(extension)
      ? MimeTypes.get(extension) as string
      : "application/neno-filestream";
    const blob = await streamToBlob(readable, mimeType);
    const url = URL.createObjectURL(blob);
    return url;
  }
}
