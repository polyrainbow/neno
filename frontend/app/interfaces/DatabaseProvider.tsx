import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import { GraphId } from "../../../backend/interfaces/GraphId";
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

interface DatabaseProvider {
  isAuthenticated?: () => Promise<boolean>,
  removeAccess: () => Promise<void>;
  getActiveGraphId: () => GraphId | null;
  // getGraphIds and setActiveGraph is currently only enabled on
  // DatabaseProviders with MULTIPLE_GRAPHS feature
  getGraphIds?: () => GraphId[] | null;
  setActiveGraph?: (graphId: GraphId) => void;
  getNote: (noteId: NoteId) => Promise<NoteToTransmit | null>;
  getRawNote: (noteId: NoteId) => Promise<string | null>;
  getNotes: (options: DatabaseQuery) => Promise<NoteListPage>;
  getStats: (options: GraphStatsRetrievalOptions) => Promise<GraphStats>;
  getFiles: () => Promise<FileInfo[]>;
  getFileInfo: (fileId: FileId) => Promise<FileInfo>;
  getDanglingFiles: () => Promise<FileInfo[]>;
  deleteNote: (noteId: NoteId) => Promise<void>;
  putNote: (
    noteSaveRequest: NoteSaveRequest,
  ) => Promise<NoteToTransmit>;
  putRawNote: (
    rawNote: string,
  ) => Promise<NoteToTransmit>;
  saveGraphVisualization: (
    graphVisualization: GraphVisualizationFromUser,
  ) => Promise<void>;
  getGraphVisualization: () => Promise<BackendGraphVisualization>;
  getReadableGraphStream: (withFiles: boolean) => Promise<any>;
  uploadFile: (file: File) => Promise<FileInfo>;
  getReadableFileStream: (fileId: FileId) => Promise<any>;
  deleteFile: (fileId: FileId) => Promise<void>;
  pinNote: (noteId: NoteId) => Promise<NoteToTransmit[]>;
  unpinNote: (noteId: NoteId) => Promise<NoteToTransmit[]>;
  getPins: () => Promise<NoteToTransmit[]>;
  getUrlForFileId: (fileId: FileId, publicName?: string) => Promise<string>;
  getDocumentTitle?: (url: string) => Promise<string>;
}


export default DatabaseProvider;
