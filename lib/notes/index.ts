import DatabaseIO from "./DatabaseIO.js";
import {
  getNoteTitlePreview,
  normalizeNoteTitle,
  noteWithSameTitleExists,
  findNote,
  getNewNoteId,
  updateNotePosition,
  getLinkedNotes,
  removeLinksOfNote,
  incorporateUserChangesIntoNote,
  createNoteToTransmit,
  getSortFunction,
  getNumberOfLinkedNotes,
  createNoteListItems,
  getNumberOfComponents,
  getNumberOfUnlinkedNotes,
  parseFileIds,
  findNoteIndex,
  getExtensionFromFilename,
  findRawNote,
  parseSerializedNewNote,
  serializeNewNote,
  removeCustomMetadataWithEmptyKeys,
} from "./noteUtils.js";
import Graph from "./interfaces/Graph.js";
import GraphVisualization from "./interfaces/GraphVisualization.js";
import { GraphId } from "./interfaces/GraphId.js";
import { NoteId } from "./interfaces/NoteId.js";
import NoteToTransmit from "./interfaces/NoteToTransmit.js";
import GraphNode from "./interfaces/GraphVisualizationNode.js";
import GraphStats from "./interfaces/GraphStats.js";
import GraphVisualizationFromUser
  from "./interfaces/GraphVisualizationFromUser.js";
import GraphNodePositionUpdate from "./interfaces/NodePositionUpdate.js";
import { FileId } from "./interfaces/FileId.js";
import * as config from "./config.js";
import { NoteListSortMode } from "./interfaces/NoteListSortMode.js";
import GraphObject from "./interfaces/Graph.js";
import { ErrorMessage } from "./interfaces/ErrorMessage.js";
import GraphStatsRetrievalOptions
  from "./interfaces/GraphStatsRetrievalOptions.js";
import StorageProvider from "./interfaces/StorageProvider.js";
import { FileInfo } from "./interfaces/FileInfo.js";
import ExistingNote from "./interfaces/ExistingNote.js";
import { NoteSaveRequest } from "./interfaces/NoteSaveRequest.js";
import { Readable } from "./interfaces/Readable.js";
import subwaytext from "../subwaytext/index.js";
import { search } from "./search.js";
import DatabaseQuery from "./interfaces/DatabaseQuery.js";
import NoteListPage from "./interfaces/NoteListPage.js";
import ByteRange from "./interfaces/ByteRange.js";

let io: DatabaseIO<any>;
let randomUUID: () => string;


/**
  EXPORTS
**/


const init = async <ReadableStreamImplementation>(
  storageProvider: StorageProvider<ReadableStreamImplementation>,
  _randomUUID: () => string,
): Promise<void> => {
  randomUUID = _randomUUID;

  io = new DatabaseIO<ReadableStreamImplementation>({storageProvider});
};


const get = async (
  noteId: NoteId | "random",
  graphId: GraphId,
): Promise<NoteToTransmit> => {
  const graph = await io.getGraph(graphId);

  const noteFromDB: ExistingNote | null = (noteId === "random")
    ? (
      graph.notes.length > 0
        ? graph.notes[Math.floor(Math.random() * graph.notes.length)]
        : null
    )
    : findNote(graph, noteId);

  if (!noteFromDB) {
    throw new Error(ErrorMessage.NOTE_NOT_FOUND);
  }

  const noteToTransmit: NoteToTransmit
    = await createNoteToTransmit(noteFromDB, graph);
  return noteToTransmit;
};


const getRawNote = async (
  noteId: NoteId,
  graphId: GraphId,
): Promise<string> => {
  const graph = await io.getRawGraph(graphId);
  const rawNote: string | null = findRawNote(graph, noteId);
  if (!rawNote) {
    throw new Error(ErrorMessage.NOTE_NOT_FOUND);
  }

  return rawNote;
};


const getNotesList = async (
  graphId: GraphId,
  query: DatabaseQuery,
): Promise<NoteListPage> => {
  const graph: GraphObject = await io.getGraph(graphId);
  return search(graph, query);
};


const getGraphVisualization = async (
  graphId: GraphId,
): Promise<GraphVisualization> => {
  const graph = await io.getGraph(graphId);

  const graphNodes: GraphNode[] = graph.notes.map((note) => {
    const graphNode: GraphNode = {
      id: note.meta.id,
      title: getNoteTitlePreview(note),
      position: note.meta.position,
      linkedNotes: getLinkedNotes(graph, note.meta.id),
      createdAt: note.meta.createdAt,
    };
    return graphNode;
  });

  const graphVisualization: GraphVisualization = {
    nodes: graphNodes,
    links: graph.links,
    screenPosition: graph.screenPosition,
    initialNodePosition: graph.initialNodePosition,
  };

  return graphVisualization;
};


const getStats = async (
  graphId: GraphId,
  options: GraphStatsRetrievalOptions,
): Promise<GraphStats> => {
  const graph: GraphObject = await io.getGraph(graphId);

  const numberOfUnlinkedNotes = getNumberOfUnlinkedNotes(graph);  

  let stats: GraphStats = {
    numberOfAllNotes: graph.notes.length,
    numberOfLinks: graph.links.length,
    numberOfFiles: graph.files.length,
    numberOfPins: graph.pinnedNotes.length,
    numberOfUnlinkedNotes,
  };

  if (options.includeMetadata) {
    stats = {
      ...stats,
      createdAt: graph.createdAt,
      updatedAt: graph.updatedAt,
      id: graphId,
      size: {
        graph: await io.getSizeOfGraph(graphId),
        files: await io.getSizeOfGraphFiles(graphId),
      },
    };
  }

  /*
    including a graph analysis is quite CPU-heavy, that's why we include it
    only if explicitly asked for
  */
  if (options.includeAnalysis) {
    const numberOfComponents = getNumberOfComponents(graph.notes, graph.links);

    stats = {
      ...stats,
      numberOfComponents,
      numberOfComponentsWithMoreThanOneNode:
        numberOfComponents - numberOfUnlinkedNotes,
      numberOfHubs: graph.notes
        .filter((note) => {
          const numberOfLinkedNotes = getNumberOfLinkedNotes(
            graph,
            note.meta.id,
          );
          return numberOfLinkedNotes >= config.MIN_NUMBER_OF_LINKS_FOR_HUB;
        })
        .length,
      nodesWithHighestNumberOfLinks: createNoteListItems(graph.notes, graph)
        .sort(getSortFunction(NoteListSortMode.NUMBER_OF_LINKS_DESCENDING))
        .slice(0, 3),
    };
  }

  return stats;
};


const setGraphVisualization = async (
  graphVisualizationFromUser: GraphVisualizationFromUser,
  graphId: GraphId,
): Promise<void> => {
  const graph: Graph = await io.getGraph(graphId);
  graphVisualizationFromUser.nodePositionUpdates.forEach(
    (nodePositionUpdate: GraphNodePositionUpdate): void => {
      updateNotePosition(graph, nodePositionUpdate);
    },
  );
  graph.links = graphVisualizationFromUser.links;
  graph.screenPosition = graphVisualizationFromUser.screenPosition;
  graph.initialNodePosition = graphVisualizationFromUser.initialNodePosition;
  await io.flushChanges(graphId, graph);
};


const put = async (
  noteSaveRequest: NoteSaveRequest,
  graphId: GraphId,
): Promise<NoteToTransmit> => {
  const noteFromUser = noteSaveRequest.note;

  if (
    (!noteFromUser)
    || (typeof noteFromUser.content !== "string")
    || (typeof noteFromUser.meta.title !== "string")
  ) {
    throw new Error(ErrorMessage.INVALID_NOTE_STRUCTURE);
  }

  const graph: Graph = await io.getGraph(graphId);

  if (
    !noteSaveRequest.ignoreDuplicateTitles
    && noteWithSameTitleExists(noteFromUser, graph)
  ) {
    throw new Error(ErrorMessage.NOTE_WITH_SAME_TITLE_EXISTS);
  }

  let existingNote: ExistingNote | null = null;

  if (
    "id" in noteFromUser.meta
  ) {
    existingNote = await findNote(graph, noteFromUser.meta.id);
  }

  if (existingNote === null) {
    const noteId: NoteId = getNewNoteId(graph);
    existingNote = {
      meta: {
        id: noteId,
        // Let's make sure that when manipulating the position object at some
        // point, we don't accidentally manipulate the initialNodePosition
        // object.
        // So let's copy the primitive values one by one. This actually
        // prevents bugs from occuring in local mode, where API output from this
        // module is not consistently serialized and re-parsed. It could also be
        // cloned (e. g. via structuredClone()) without destroying references,
        // which would just defer the issue outside of this module.
        position: noteFromUser.meta.position ?? {
          x: graph.initialNodePosition.x,
          y: graph.initialNodePosition.y,
        },
        title: normalizeNoteTitle(noteFromUser.meta.title),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        custom: removeCustomMetadataWithEmptyKeys(
          noteFromUser.meta.custom,
        ),
        flags: noteFromUser.meta.flags,
        contentType: noteFromUser.meta.contentType,
      },
      content: noteFromUser.content,
    };
    graph.notes.push(existingNote);
  } else {
    existingNote.content = noteFromUser.content;
    graph.blockIndex.set(
      existingNote.meta.id,
      subwaytext(existingNote.content),
    );
    existingNote.meta.title = normalizeNoteTitle(noteFromUser.meta.title);
    existingNote.meta.updatedAt = Date.now();
    existingNote.meta.flags = noteFromUser.meta.flags;
    existingNote.meta.contentType = noteFromUser.meta.contentType;
    existingNote.meta.custom = removeCustomMetadataWithEmptyKeys(
      noteFromUser.meta.custom,
    );
  }

  incorporateUserChangesIntoNote(noteSaveRequest.changes, existingNote, graph);

  await io.flushChanges(graphId, graph);

  const noteToTransmit: NoteToTransmit
    = await createNoteToTransmit(existingNote, graph);
  return noteToTransmit;
};


const putRawNote = (
  rawNote: string,
  graphId: GraphId,
): Promise<NoteToTransmit> => {
  const note = parseSerializedNewNote(rawNote);

  const noteSaveRequest = {
    note,
    changes: [],
    ignoreDuplicateTitles: true,
  };

  return put(noteSaveRequest, graphId);
};


const remove = async (
  noteId: NoteId,
  graphId: GraphId,
): Promise<void> => {
  const graph = await io.getGraph(graphId);
  const noteIndex = findNoteIndex(graph, noteId);
  if ((noteIndex === -1) || (noteIndex === null)) {
    throw new Error(ErrorMessage.NOTE_NOT_FOUND);
  }

  graph.notes.splice(noteIndex, 1);
  removeLinksOfNote(graph, noteId);
  graph.pinnedNotes = graph.pinnedNotes.filter((nId) => nId !== noteId);

  /*
    we do not remove files used in this note, because they could be used in
    other notes. this module considers files to exist independently of notes.
    unused files should be deleted in the clean up process, if at all.
  */

  await io.flushChanges(graphId, graph);
};


const importDB = (
  graph: GraphObject,
  graphId: GraphId,
): Promise<void> => {
  return io.flushChanges(graphId, graph);
};


const addFile = async <ReadableStreamImplementation>(
  graphId: GraphId,
  readable: ReadableStreamImplementation,
  filename: string,
): Promise<FileInfo> => {
  const extension = getExtensionFromFilename(filename);
  const fileId: FileId = randomUUID() + "." + extension;
  const size = await io.addFile(graphId, fileId, readable);

  const graph = await io.getGraph(graphId);
  const fileInfo: FileInfo = {
    fileId,
    name: filename,
    size,
    createdAt: Date.now(),
  };
  graph.files.push(fileInfo);
  await io.flushChanges(graphId, graph);

  return fileInfo;
};


const deleteFile = async (
  graphId: GraphId,
  fileId: FileId,
): Promise<void> => {
  await io.deleteFile(graphId, fileId);

  const graph = await io.getGraph(graphId);
  graph.files = graph.files.filter((file) => file.fileId !== fileId);
  await io.flushChanges(graphId, graph);
};


const getFiles = async (
  graphId: GraphId,
): Promise<FileInfo[]> => {
  const graph = await io.getGraph(graphId);
  return graph.files;
};

// get files not used in any note
const getDanglingFiles = async (
  graphId: GraphId,
): Promise<FileInfo[]> => {
  const graph = await io.getGraph(graphId);
  const fileIdsInNotes: FileId[] = graph.notes.reduce(
    (accumulator: string[], note) => {
      const fileIdsOfNote = parseFileIds(note.content);
      return [...accumulator, ...fileIdsOfNote];
    },
    [],
  );
  const danglingFiles = graph.files.filter((file) => {
    return !fileIdsInNotes.includes(file.fileId);
  });
  return danglingFiles;
};


const getReadableFileStream = async (
  graphId: GraphId,
  fileId: FileId,
  range?: ByteRange,
): Promise<Readable> => {
  const graph = await io.getGraph(graphId);
  if (!graph.files.map((file) => file.fileId).includes(fileId)) {
    throw new Error(ErrorMessage.FILE_NOT_FOUND);
  }
  const stream = await io.getReadableFileStream(graphId, fileId, range);
  return stream;
};


const getFileInfo = async (
  graphId: GraphId,
  fileId: FileId,
): Promise<FileInfo> => {
  const graph = await io.getGraph(graphId);
  const fileInfo = graph.files.find((file) => file.fileId === fileId);
  if (!fileInfo) {
    throw new Error(ErrorMessage.FILE_NOT_FOUND);
  }
  return fileInfo;
};


const getReadableGraphStream = async (
  graphId: GraphId,
  withFiles: boolean,
) => {
  return await io.getReadableGraphStream(graphId, withFiles);
};


const pin = async (
  graphId: GraphId,
  noteId: NoteId,
): Promise<NoteToTransmit[]> => {
  const graph = await io.getGraph(graphId);
  const noteIndex = findNoteIndex(graph, noteId);
  if (noteIndex === -1) {
    throw new Error(ErrorMessage.NOTE_NOT_FOUND);
  }

  graph.pinnedNotes = Array.from(
    new Set([...graph.pinnedNotes, noteId]),
  );

  await io.flushChanges(graphId, graph);

  const pinnedNotes: NoteToTransmit[] = await Promise.all(
    graph.pinnedNotes
      .map((noteId) => {
        return get(noteId, graphId);
      })
  );

  return pinnedNotes;
};


const unpin = async (
  graphId: GraphId,
  noteId: NoteId,
): Promise<NoteToTransmit[]> => {
  const graph = await io.getGraph(graphId);

  graph.pinnedNotes = graph.pinnedNotes.filter((nId) => nId !== noteId);

  await io.flushChanges(graphId, graph);

  const pinnedNotes: NoteToTransmit[] = await Promise.all(
    graph.pinnedNotes
      .map((noteId) => {
        return get(noteId, graphId);
      })
  );

  return pinnedNotes;
};


const getPins = async (graphId: GraphId): Promise<NoteToTransmit[]> => {
  const graph = await io.getGraph(graphId);

  const pinnedNotes: NoteToTransmit[] = await Promise.all(
    graph.pinnedNotes
      .map((noteId) => {
        return get(noteId, graphId);
      })
  );

  return pinnedNotes;
};


const utils = {
  getExtensionFromFilename,
  parseSerializedNewNote,
  serializeNewNote,
};


export {
  init,
  getRawNote,
  get,
  getNotesList,
  getGraphVisualization,
  setGraphVisualization,
  getStats,
  put,
  putRawNote,
  remove,
  importDB,
  addFile,
  deleteFile,
  getFiles,
  getDanglingFiles,
  getReadableFileStream,
  getFileInfo,
  getReadableGraphStream,
  pin,
  unpin,
  getPins,
  utils,
};
