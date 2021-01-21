import * as API from "./api.js";
import * as tokenManager from "./tokenManager.js";

export default class ServerDatabaseProvider {
  isAuthorized() {
    return !!tokenManager.get();
  }

  getAuthToken() {
    return tokenManager.get();
  }

  login(username, password) {
    return API.login(username, password);
  }

  getNote(noteId) {
    return API.getNote(noteId);
  }

  getNotes(options) {
    return API.getNotes(options);
  }

  getStats() {
    return API.getStats();
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

  getGraphObject() {
    return API.getGraphObject();
  }

  getReadableDatabaseStream(includingImagesAndFiles) {
    return API.getReadableDatabaseStream(includingImagesAndFiles);
  }

  uploadFile(file) {
    return API.uploadFile(file);
  }

  uploadFileByUrl(data) {
    return API.uploadFileByUrl(data);
  }

  fetchURLMetadata(url) {
    return API.fetchURLMetadata(url);
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
