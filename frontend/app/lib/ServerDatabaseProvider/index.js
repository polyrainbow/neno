import * as API from "./api.js";

export default class ServerDatabaseProvider {
  static features = [
    "EXPORT_DATABASE",
    "AUTHENTICATION",
    "GET_URL_METADATA",
    "UPLOAD_BY_URL",
  ];

  static type = "SERVER";

  #graphIds = null;

  constructor(API_URL) {
    API.init(API_URL);
  }

  async getGraphId() {
    return this.#graphIds?.[0];
  }

  async login(username, password, mfaToken) {
    const response = await API.login(username, password, mfaToken);
    this.#graphIds = response.graphIds;
    API.setGraphId(this.#graphIds?.[0]);
    return response;
  }

  async isAuthenticated() {
    try {
      const response = await API.isAuthenticated();
      this.#graphIds = response.graphIds;
      API.setGraphId(this.#graphIds?.[0]);
      return true;
    } catch (e) {
      return false;
    }
  }

  async removeAccess() {
    this.#graphIds = null;
    API.setGraphId(null);

    // we try to logout from the server but if the server fails to do this and
    // throws an INVALID_CREDENTIALS error, we assume we are already logged out
    try {
      await API.logout();
    } catch (e) {
      if (e.message !== "INVALID_CREDENTIALS") {
        throw new Error(e);
      }
    }
  }

  getNote(noteId) {
    return API.getNote(noteId);
  }

  getNotes(options) {
    return API.getNotes(options);
  }

  getStats(options) {
    return API.getStats(options);
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

  saveGraphVisualization(graphVisualization) {
    return API.saveGraphVisualization(graphVisualization);
  }

  getGraphVisualization() {
    return API.getGraphVisualization();
  }

  getReadableGraphStream(withFiles) {
    return API.getReadableGraphStream(withFiles);
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
