import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import DatabaseQuery from "../../../lib/notes/interfaces/DatabaseQuery";
import GraphStatsRetrievalOptions
  from "../../../lib/notes/interfaces/GraphStatsRetrievalOptions";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import NoteListPage from "../../../lib/notes/interfaces/NoteListPage";
import { FileId } from "../../../lib/notes/interfaces/FileId";
import GraphVisualizationFromUser
  from "../../../lib/notes/interfaces/GraphVisualizationFromUser";
import BackendGraphVisualization
  from "../../../lib/notes/interfaces/GraphVisualization";
import {
  FileInfo,
} from "../../../lib/notes/interfaces/FileInfo";
import { NoteSaveRequest } from "../../../lib/notes/interfaces/NoteSaveRequest";

export type SuccessfulAuthenticationResponse
  = { graphIds: GraphId[] };

export type RegisterRequestOptions = {
  type: "REQUEST_CHALLENGE",
  signUpToken: string,
} | {
  type: "SUBMIT_PUBLIC_KEY",
  attestationObject: string,
  clientDataJSON: string,
  rawId: string,
};

export type RegisterResponse = {
  challenge: string,
  graphIds?: GraphId[],
};

interface DatabaseProvider {
  login: (...args) => Promise<SuccessfulAuthenticationResponse>,
  register?: (options: RegisterRequestOptions) => Promise<RegisterResponse>,
  isAuthenticated: () => Promise<SuccessfulAuthenticationResponse>,
  removeAccess: () => Promise<void>;
  getGraphIds: () => GraphId[] | null;
  getNote: (
    graphId: GraphId,
    noteId: NoteId | "random",
  ) => Promise<NoteToTransmit | null>;
  getRawNote: (graphId: GraphId, noteId: NoteId) => Promise<string | null>;
  getNotes: (graphId: GraphId, options: DatabaseQuery) => Promise<NoteListPage>;
  getStats: (
    graphId: GraphId,
    options: GraphStatsRetrievalOptions,
  ) => Promise<GraphStats>;
  getFiles: (graphId: GraphId) => Promise<FileInfo[]>;
  getFileInfo: (graphId: GraphId, fileId: FileId) => Promise<FileInfo>;
  getDanglingFiles: (graphId: GraphId) => Promise<FileInfo[]>;
  deleteNote: (graphId: GraphId, noteId: NoteId) => Promise<void>;
  putNote: (
    graphId: GraphId,
    noteSaveRequest: NoteSaveRequest,
  ) => Promise<NoteToTransmit>;
  putRawNote: (
    graphId: GraphId,
    rawNote: string,
  ) => Promise<NoteToTransmit>;
  saveGraphVisualization: (
    graphId: GraphId,
    graphVisualization: GraphVisualizationFromUser,
  ) => Promise<void>;
  getGraphVisualization: (
    graphId: GraphId,
  ) => Promise<BackendGraphVisualization>;
  getReadableGraphStream: (
    graphId: GraphId,
    withFiles: boolean,
  ) => Promise<any>;
  uploadFile: (graphId: GraphId, file: File) => Promise<FileInfo>;
  getReadableFileStream: (graphId: GraphId, fileId: FileId) => Promise<any>;
  deleteFile: (graphId: GraphId, fileId: FileId) => Promise<void>;
  pinNote: (graphId: GraphId, noteId: NoteId) => Promise<NoteToTransmit[]>;
  unpinNote: (graphId: GraphId, noteId: NoteId) => Promise<NoteToTransmit[]>;
  getPins: (graphId: GraphId) => Promise<NoteToTransmit[]>;
  getUrlForFileId: (
    graphId: GraphId,
    fileId: FileId,
    publicName?: string,
  ) => Promise<string>;
  getDocumentTitle?: (url: string) => Promise<string>;
}


export default DatabaseProvider;
