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
  #activeGraphId = null;
  #apiUrl = null;

  constructor(API_URL) {
    this.#apiUrl = API_URL;
    API.init(API_URL);
  }

  getActiveGraphId() {
    return this.#activeGraphId;
  }

  getGraphIds() {
    return this.#graphIds;
  }

  setGraphId(graphId) {
    this.#activeGraphId = graphId;
    API.setGraphId(this.#activeGraphId);
  }

  async login(username, password, mfaToken) {
    const response = await API.login(username, password, mfaToken);
    this.#graphIds = response.graphIds;
    this.#activeGraphId = this.#graphIds?.[0] ?? null;
    API.setGraphId(this.#activeGraphId);
    return response;
  }

  async isAuthenticated() {
    try {
      const response = await API.isAuthenticated();
      this.#graphIds = response.graphIds;
      this.#activeGraphId = this.#graphIds?.[0] ?? null;
      API.setGraphId(this.#activeGraphId);
      return true;
    } catch (e) {
      return false;
    }
  }

  async removeAccess() {
    this.#graphIds = null;
    this.#activeGraphId = null;
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

  getFiles() {
    return API.getFiles();
  }

  getDanglingFiles() {
    return API.getDanglingFiles();
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

  deleteFile(fileId) {
    return API.deleteFile(fileId);
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

  /**
   * Obtains a URL for a file.
   * @param {string} fileId
   * @param {string?} publicName This optional file name is appended at the url
   * so that if the user decides to download the file, it is saved with this
   * public name instead of the more technical fileId.
   * @return {string} url
  */
  async getUrlForFileId(fileId, publicName) {
    if (
      (!Array.isArray(this.#graphIds))) {
      return;
    }

    let url = this.#apiUrl + "graph/" + this.#activeGraphId + "/file/" + fileId;

    if (typeof publicName === "string") {
      url += `/${encodeURIComponent(publicName)}`;
    }

    return url;
  }
}
