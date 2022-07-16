import { GraphId } from "../../../../backend/interfaces/GraphId.js";
import { FileId } from "../../../../lib/notes/interfaces/FileId.js";
import GraphStatsRetrievalOptions
  from "../../../../lib/notes/interfaces/GraphStatsRetrievalOptions.js";
import NoteFromUser from "../../../../lib/notes/interfaces/NoteFromUser.js";
import { NoteId } from "../../../../lib/notes/interfaces/NoteId.js";
import NoteToTransmit from "../../../../lib/notes/interfaces/NoteToTransmit.js";
import DatabaseProvider from "../../interfaces/DatabaseProvider.js";
import * as API from "./api.js";

export default class ServerDatabaseProvider implements DatabaseProvider {
  static features = [
    "EXPORT_DATABASE",
    "AUTHENTICATION",
    "GET_URL_METADATA",
    "MULTIPLE_GRAPHS",
  ];

  static type = "SERVER";

  #graphIds = null;
  #activeGraphId;
  #apiUrl = null;

  constructor(API_URL) {
    this.#apiUrl = API_URL;
    API.init(API_URL);
  }

  getActiveGraphId(): GraphId | null {
    return this.#activeGraphId;
  }

  getGraphIds(): GraphId[] | null {
    return this.#graphIds;
  }

  setActiveGraph(graphId: GraphId): void {
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

  async isAuthenticated(): Promise<boolean> {
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
      if (!(e instanceof Error && e.message === "INVALID_CREDENTIALS")) {
        throw e;
      }
    }
  }

  getNote(noteId: NoteId): Promise<NoteToTransmit | null> {
    return API.getNote(noteId);
  }

  getNotes(options) {
    return API.getNotes(options);
  }

  getStats(options: GraphStatsRetrievalOptions) {
    return API.getStats(options);
  }

  getFiles() {
    return API.getFiles();
  }

  getDanglingFiles() {
    return API.getDanglingFiles();
  }

  deleteNote(noteId: NoteId): Promise<void> {
    return API.deleteNote(noteId);
  }

  putNote(noteFromUser: NoteFromUser, options) {
    return API.putNote(noteFromUser, options);
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

  getReadableGraphStream(withFiles: boolean) {
    return API.getReadableGraphStream(withFiles);
  }

  uploadFile(file) {
    return API.uploadFile(file);
  }

  getReadableFileStream(fileId: FileId) {
    return API.getReadableFileStream(fileId);
  }

  deleteFile(fileId: FileId) {
    return API.deleteFile(fileId);
  }

  getUrlMetadata(url: string) {
    return API.getUrlMetadata(url);
  }

  pinNote(noteId: NoteId) {
    return API.pinNote(noteId);
  }

  unpinNote(noteId: NoteId) {
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
  async getUrlForFileId(fileId: FileId, publicName?: string): Promise<string> {
    let url = this.#apiUrl + "graph/" + this.#activeGraphId + "/file/" + fileId;

    if (typeof publicName === "string") {
      url += `/${encodeURIComponent(publicName)}`;
    }

    return url;
  }
}
