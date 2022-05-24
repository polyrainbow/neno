import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import { GraphId } from "../../../backend/interfaces/GraphId";
import DatabaseQuery from "../../../lib/notes/interfaces/DatabaseQuery";
import GraphStatsRetrievalOptions
  from "../../../lib/notes/interfaces/GraphStatsRetrievalOptions";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import NoteListPage from "../../../lib/notes/interfaces/NoteListPage";
import { FileId } from "../../../lib/notes/interfaces/FileId";
import NotePutOptions from "../../../lib/notes/interfaces/NotePutOptions";
import ImportLinkAsNoteFailure
  from "../../../lib/notes/interfaces/ImportLinkAsNoteFailure";
import GraphVisualizationFromUser
  from "../../../lib/notes/interfaces/GraphVisualizationFromUser";
import GraphVisualization from "../lib/GraphVisualization";
import UrlMetadataResponse
  from "../../../lib/notes/interfaces/UrlMetadataResponse";

interface DatabaseProvider {
  removeAccess: () => Promise<void>;
  getActiveGraphId: () => GraphId | null;
  // getGraphIds and setGraphId is currently only enabled on DatabaseProviders
  // with MULTIPLE_GRAPHS feature
  getGraphIds?: () => GraphId[] | null;
  setGraphId?: (graphId: GraphId) => void;
  getNote: (noteId: NoteId) => Promise<NoteToTransmit | null>;
  getNotes: (options:DatabaseQuery) => Promise<NoteListPage>;
  getStats: (options: GraphStatsRetrievalOptions) => Promise<GraphStats>;
  getFiles: (graphId: GraphId) => Promise<FileId[]>
  getDanglingFiles: (graphId: GraphId) => Promise<FileId[]>;
  deleteNote: (noteId:NoteId) => Promise<void>;
  putNote: (
    noteToTransmit:NoteToTransmit,
    options:NotePutOptions,
  ) => Promise<NoteToTransmit>;
  importLinksAsNotes: (links: string[]) => Promise<{
    notesToTransmit: NoteToTransmit[];
    failures: ImportLinkAsNoteFailure[];
  }>;
  saveGraphVisualization: (
    graphVisualization:GraphVisualizationFromUser,
  ) => Promise<void>;
  getGraphVisualization: () => Promise<GraphVisualization>;
  getReadableGraphStream: (withFiles:boolean) => Promise<any>;
  uploadFile: (file: File) => Promise<{
    fileId: string;
    size: number;
  }>;
  getReadableFileStream: (fileId: FileId) => Promise<any>;
  deleteFile: (fileId:FileId) => Promise<void>;
  getUrlMetadata: (url:string) => Promise<UrlMetadataResponse>;
  pinNote: (noteId: NoteId) => Promise<NoteToTransmit[]>;
  unpinNote: (noteId: NoteId) => Promise<NoteToTransmit[]>;
  getPins: () => Promise<NoteToTransmit[]>;
  getUrlForFileId: (fileId: FileId, publicName?:string) => Promise<string>;
}


export default DatabaseProvider;
