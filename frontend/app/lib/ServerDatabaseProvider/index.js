import * as API from "./api.js";
import * as tokenManager from "./tokenManager.js";

export default class ServerDatabaseProvider {
  static features = [
    "EXPORT_DATABASE",
    "AUTHENTICATION",
    "GET_URL_METADATA",
  ];

  static type = "SERVER";

  #MAX_SESSION_AGE = null;

  constructor(API_URL, MAX_SESSION_AGE) {
    this.#MAX_SESSION_AGE = MAX_SESSION_AGE;
    API.setAPIUrl(API_URL);
  }

  async hasAccessToken() {
    return !!tokenManager.get().token;
  }

  getAuthToken() {
    return tokenManager.get().token;
  }

  async getDbId() {
    return tokenManager.get().dbId;
  }

  async login(username, password) {
    const response = await API.login(username, password);
    tokenManager.set({
      token: response.token,
      dbId: response.dbId,
      maxSessionAge: this.#MAX_SESSION_AGE,
    });
    return response;
  }

  async removeAccess() {
    return tokenManager.remove();
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
