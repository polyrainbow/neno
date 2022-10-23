import { GraphId } from "../../../../lib/notes/interfaces/GraphId";
import { FileId } from "../../../../lib/notes/interfaces/FileId.js";
import { FileInfo } from "../../../../lib/notes/interfaces/FileInfo.js";
import GraphStatsRetrievalOptions
  from "../../../../lib/notes/interfaces/GraphStatsRetrievalOptions.js";
import { NoteId } from "../../../../lib/notes/interfaces/NoteId.js";
import { NoteSaveRequest }
  from "../../../../lib/notes/interfaces/NoteSaveRequest.js";
import NoteToTransmit from "../../../../lib/notes/interfaces/NoteToTransmit.js";
import DatabaseProvider, {
  SuccessfulAuthenticationResponse,
} from "../../types/DatabaseProvider.js";
import * as API from "./api.js";

export default class ServerDatabaseProvider implements DatabaseProvider {
  static features = [
    "EXPORT_DATABASE",
    "AUTHENTICATION",
    "GET_DOCUMENT_TITLE",
    "MULTIPLE_GRAPHS",
  ];

  static type = "SERVER";

  #graphIds = null;
  #apiUrl = null;

  constructor(API_URL) {
    this.#apiUrl = API_URL;
    API.init(API_URL);
  }

  getGraphIds(): GraphId[] | null {
    return this.#graphIds;
  }


  async login(
    username: string,
    password: string,
    mfaToken: string,
  ): Promise<SuccessfulAuthenticationResponse> {
    const response = await API.login(username, password, mfaToken);
    return response;
  }

  async isAuthenticated(): Promise<SuccessfulAuthenticationResponse> {
    const response = await API.isAuthenticated();
    this.#graphIds = response.graphIds;
    return {
      graphIds: response.graphIds,
    };
  }

  async removeAccess() {
    this.#graphIds = null;

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

  getRawNote(graphId: GraphId, noteId: NoteId): Promise<string | null> {
    return API.getRawNote(graphId, noteId);
  }

  getNote(graphId: GraphId, noteId: NoteId): Promise<NoteToTransmit | null> {
    return API.getNote(graphId, noteId);
  }

  getNotes(graphId: GraphId, options) {
    return API.getNotes(graphId, options);
  }

  getStats(graphId: GraphId, options: GraphStatsRetrievalOptions) {
    return API.getStats(graphId, options);
  }

  getFiles(graphId: GraphId) {
    return API.getFiles(graphId);
  }

  getFileInfo(graphId: GraphId, fileId: FileId): Promise<FileInfo> {
    return API.getFileInfo(graphId, fileId);
  }

  getDanglingFiles(graphId: GraphId) {
    return API.getDanglingFiles(graphId);
  }

  deleteNote(graphId: GraphId, noteId: NoteId): Promise<void> {
    return API.deleteNote(graphId, noteId);
  }

  putNote(
    graphId: GraphId,
    noteSaveRequest: NoteSaveRequest,
  ): Promise<NoteToTransmit> {
    return API.putNote(graphId, noteSaveRequest);
  }

  putRawNote(graphId: GraphId, rawNote: string): Promise<NoteToTransmit> {
    return API.putRawNote(graphId, rawNote);
  }

  saveGraphVisualization(graphId: GraphId, graphVisualization) {
    return API.saveGraphVisualization(graphId, graphVisualization);
  }

  getGraphVisualization(graphId: GraphId) {
    return API.getGraphVisualization(graphId);
  }

  getReadableGraphStream(graphId: GraphId, withFiles: boolean) {
    return API.getReadableGraphStream(graphId, withFiles);
  }

  uploadFile(graphId: GraphId, file: File): Promise<FileInfo> {
    return API.uploadFile(graphId, file);
  }

  getReadableFileStream(graphId: GraphId, fileId: FileId) {
    return API.getReadableFileStream(graphId, fileId);
  }

  deleteFile(graphId: GraphId, fileId: FileId) {
    return API.deleteFile(graphId, fileId);
  }

  pinNote(graphId: GraphId, noteId: NoteId) {
    return API.pinNote(graphId, noteId);
  }

  unpinNote(graphId: GraphId, noteId: NoteId) {
    return API.unpinNote(graphId, noteId);
  }

  getPins(graphId: GraphId) {
    return API.getPins(graphId);
  }

  getDocumentTitle(url: string) {
    return API.getDocumentTitle(url);
  }

  /**
   * Obtains a URL for an uploaded file.
   * @param {string} graphId
   * @param {string} fileId
   * @param {string?} publicName This optional file name is appended at the url
   * so that if the user decides to download the file, it is saved with this
   * public name instead of the more technical fileId.
   * @return {string} url
  */
  async getUrlForFileId(
    graphId: GraphId,
    fileId: FileId,
    publicName?: string,
  ): Promise<string> {
    let url = this.#apiUrl + "graph/" + graphId + "/file/" + fileId;

    if (typeof publicName === "string") {
      url += `/${encodeURIComponent(publicName)}`;
    }

    return url;
  }
}
