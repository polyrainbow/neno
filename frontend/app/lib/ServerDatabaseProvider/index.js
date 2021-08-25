import * as API from "./api.js";

export default class ServerDatabaseProvider {
  static features = [
    "EXPORT_DATABASE",
    "AUTHENTICATION",
    "GET_URL_METADATA",
  ];

  static type = "SERVER";

  constructor(API_URL) {
    API.setAPIUrl(API_URL);
  }

  async getDbId() {
    // TODO
  }

  login(username, password, mfaToken) {
    return API.login(username, password, mfaToken);
  }

  async removeAccess() {
    // TODO
  }

  getNote(noteId) {
    return API.getNote(noteId);
  }

  getNotes(options) {
    return API.getNotes(options);
  }

  getStats(exhaustive) {
    return API.getStats(exhaustive);
  }

  deleteNote(noteId) {
    return API.deleteNote(noteId);
  }

  putNote(noteToTransmit, options) {
    return API.putNote(noteToTransmit, options);
  }

  importLinksAsNotes(links) {
    return API.importLinksAsNotes(links);
  }

  saveGraph(graphObject) {
    return API.saveGraph(graphObject);
  }

  getGraph() {
    return API.getGraph();
  }

  getReadableDatabaseStream(includingImagesAndFiles) {
    return API.getReadableDatabaseStream(includingImagesAndFiles);
  }

  uploadFile(file) {
    return API.uploadFile(file);
  }

  getReadableFileStream(fileId) {
    return API.getReadableFileStream(fileId);
  }

  uploadFileByUrl(data) {
    return API.uploadFileByUrl(data);
  }

  getUrlMetadata(url) {
    return API.getUrlMetadata(url);
  }

  pinNote(noteId) {
    return API.pinNote(noteId);
  }

  unpinNote(noteId) {
    return API.unpinNote(noteId);
  }

  getPins() {
    return API.getPins();
  }
}
