import FileSystemAccessAPIStorageProvider
  from "./FileSystemAccessAPIStorageProvider.js";

export default class LocalDatabaseProvider {
  static features = ["DATABASE_FOLDER"];

  /* when using a local db folder, we'll always call this db the same */
  static dbId = "local";

  #notesModule;

  async initDatabase(folderHandle) {
    this.#notesModule = await import("../../../lib/notes/index.ts");

    const storageProvider
      = new FileSystemAccessAPIStorageProvider(folderHandle);

    await this.#notesModule.init(storageProvider);
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

  hasAccess() {
    return false;
  }


  pinNote(noteId) {
    return this.#notesModule.pinNote(noteId);
  }

  unpinNote(noteId) {
    return this.#notesModule.unpinNote(noteId);
  }

  getPins() {
    return this.#notesModule.getPins();
  }
}
