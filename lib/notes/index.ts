import DatabaseIO from "./DatabaseIO.js";
import * as Utils from "../utils.js";
import {
  getDisplayNoteTitle,
  normalizeNoteTitle,
  removeDefaultTextParagraphs,
  removeEmptyLinkBlocks,
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
  getNotesWithDuplicateUrls,
  getNotesThatContainTokens,
  getNotesByTitle,
  getNotesWithUrl,
  getNotesWithTitleContainingTokens,
  getNotesWithBlocksOfTypes,
  getNotesWithDuplicateTitles,
} from "./noteUtils.js";
import Graph from "./interfaces/Graph.js";
import NoteListItem from "./interfaces/NoteListItem.js";
import GraphVisualization from "./interfaces/GraphVisualization.js";
import { GraphId } from "./interfaces/GraphId.js";
import { NoteId } from "./interfaces/NoteId.js";
import NoteToTransmit from "./interfaces/NoteToTransmit.js";
import GraphNode from "./interfaces/GraphVisualizationNode.js";
import SavedNote from "./interfaces/SavedNote.js";
import NoteFromUser from "./interfaces/NoteFromUser.js";
import GraphStats from "./interfaces/GraphStats.js";
import GraphVisualizationFromUser
  from "./interfaces/GraphVisualizationFromUser.js";
import GraphNodePositionUpdate from "./interfaces/NodePositionUpdate.js";
import { FileId } from "./interfaces/FileId.js";
import UrlMetadataResponse from "./interfaces/UrlMetadataResponse.js";
import ImportLinkAsNoteFailure from "./interfaces/ImportLinkAsNoteFailure.js";
import * as config from "./config.js";
import { Readable } from "stream";
import NoteListPage from "./interfaces/NoteListPage.js";
import { NoteListSortMode } from "./interfaces/NoteListSortMode.js";
import ReadableWithType from "./interfaces/ReadableWithMimeType.js";
import GraphObject from "./interfaces/Graph.js";
import { NoteContentBlockType } from "./interfaces/NoteContentBlock.js";
import { ErrorMessage } from "./interfaces/ErrorMessage.js";
import DatabaseQuery from "./interfaces/DatabaseQuery.js";

let io;
let randomUUID;

/* this is the fallback getUrlMetadata function that is used if the initializer
does not provide a better one */
let getUrlMetadata = (url) => {
  return Promise.resolve({
    "url": url,
    "title": url,
    "description": "",
    "image": "",
  });
};

/**
  EXPORTS
**/


const init = async (
  storageProvider,
  _getUrlMetadata,
  _randomUUID,
):Promise<void> => {
  if (typeof _getUrlMetadata === "function") {
    getUrlMetadata = _getUrlMetadata;
  }

  randomUUID = _randomUUID;

  io = new DatabaseIO({storageProvider});
};


const get = async (
  noteId: NoteId,
  graphId: GraphId,
):Promise<NoteToTransmit> => {
  const graph = await io.getGraph(graphId);
  const noteFromDB:SavedNote | null = findNote(graph, noteId);
  if (!noteFromDB) {
    throw new Error(ErrorMessage.NOTE_NOT_FOUND);
  }

  const noteToTransmit:NoteToTransmit = createNoteToTransmit(noteFromDB, graph);
  return noteToTransmit;
};


const getNotesList = async (
  graphId: GraphId,
  query: DatabaseQuery,
): Promise<NoteListPage> => {
  const searchString = query.searchString || "";
  const caseSensitive = query.caseSensitive || false;
  const page = query.page ? Math.max(query.page, 1) : 1;
  const sortMode
    = query.sortMode || NoteListSortMode.CREATION_DATE_DESCENDING;
  const limit = query.limit || 0;

  const graph: Graph = await io.getGraph(graphId);

  let matchingNotes;

  // search for note pairs containing identical urls
  if (searchString.includes("duplicates:")){
    const startOfDuplicateType
      = searchString.indexOf("duplicates:") + "duplicates:".length;
    const duplicateType = searchString.substring(startOfDuplicateType);
    if (duplicateType === "url") {
      matchingNotes = getNotesWithDuplicateUrls(graph.notes);
    } else if (duplicateType === "title"){
      matchingNotes = getNotesWithDuplicateTitles(graph.notes);
    } else {
      matchingNotes = [];
    }

  // search for exact title
  } else if (searchString.includes("exact:")) {
    const startOfExactQuery = searchString.indexOf("exact:") + "exact:".length;
    const exactQuery = searchString.substring(startOfExactQuery);
    matchingNotes = getNotesByTitle(graph.notes, exactQuery, false);

  // search for notes with specific urls
  } else if (searchString.includes("has-url:")) {
    const startOfExactQuery = searchString.indexOf("has-url:") + "has-url:".length;
    const url = searchString.substring(startOfExactQuery);
    matchingNotes = getNotesWithUrl(graph.notes, url);

  // search for notes with specific block types
  } else if (searchString.includes("has:")) {
    const startOfExactQuery = searchString.indexOf("has:") + "has:".length;
    const typesString = searchString.substring(startOfExactQuery);
    /*
      has:audio+video - show all notes that contain audio as well as video
      has:audio|video - show all notes that contain audio or video
    */
    if (typesString.includes("+")) {
      const types = typesString.split("+") as NoteContentBlockType[];
      matchingNotes = getNotesWithBlocksOfTypes(graph.notes, types, true);
    } else {
      const types = typesString.split("|") as NoteContentBlockType[];
      matchingNotes = getNotesWithBlocksOfTypes(graph.notes, types, false);
    }


  // full-text search
  } else if (searchString.includes("ft:")) {
    const startOfFtQuery = searchString.indexOf("ft:") + "ft:".length;
    const ftQuery = searchString.substring(startOfFtQuery);
    matchingNotes = getNotesThatContainTokens(
      graph.notes,
      ftQuery,
      caseSensitive,
    );

  // default mode: check if all query tokens are included in note title
  } else {
    matchingNotes = getNotesWithTitleContainingTokens(
      graph.notes,
      searchString,
      caseSensitive,
    );
  }

  // now we need to transform all notes into NoteListItems before we can
  // sort those
  let noteListItems:NoteListItem[] = createNoteListItems(matchingNotes, graph)
    .sort(getSortFunction(sortMode));

  // let's only slice the array if it makes sense to do so
  if (limit > 0 && limit < noteListItems.length) {
    noteListItems = noteListItems.slice(0, limit);
  }

  // let's extract the list items for the requested page
  const noteListItemsOfPage:NoteListItem[] = Utils.getPagedMatches(
    noteListItems,
    page,
    config.NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE,
  );

  const noteListPage:NoteListPage = {
    results: noteListItemsOfPage,
    numberOfResults: noteListItems.length,
  }

  return noteListPage;
};


const getGraphVisualization = async (graphId: GraphId):Promise<GraphVisualization> => {
  const graph = await io.getGraph(graphId);

  const graphNodes:GraphNode[] = graph.notes.map((note) => {
    const graphNode:GraphNode = {
      id: note.id,
      title: getDisplayNoteTitle(note),
      position: note.position,
      linkedNotes: getLinkedNotes(graph, note.id),
      creationTime: note.creationTime,
    };
    return graphNode;
  });

  const graphVisualization:GraphVisualization = {
    nodes: graphNodes,
    links: graph.links,
    screenPosition: graph.screenPosition,
    initialNodePosition: graph.initialNodePosition,
  }

  return graphVisualization;
};


const getStats = async (
  graphId:GraphId,
  /*
    including a graph analysis is quite CPU-heavy, that's why we include it
    only if explicitly asked for
  */
  options:{
    includeMetadata: boolean,
    includeAnalysis: boolean,
  },
):Promise<GraphStats> => {
  const graph:GraphObject = await io.getGraph(graphId);

  const numberOfUnlinkedNotes = getNumberOfUnlinkedNotes(graph);  

  let stats:GraphStats = {
    numberOfAllNotes: graph.notes.length,
    numberOfLinks: graph.links.length,
    numberOfFiles: await io.getNumberOfFiles(graphId),
    numberOfPins: graph.pinnedNotes.length,
    numberOfUnlinkedNotes,
  };

  if (options.includeMetadata) {
    stats = {
      ...stats,
      creationTime: graph.creationTime,
      updateTime: graph.updateTime,
      id: graphId,
      size: {
        graph: await io.getSizeOfGraph(graphId),
        files: await io.getSizeOfGraphFiles(graphId),
      },
    };
  }

  if (options.includeAnalysis) {
    const numberOfComponents = getNumberOfComponents(graph.notes, graph.links);

    stats = {
      ...stats,
      numberOfComponents,
      numberOfComponentsWithMoreThanOneNode:
        numberOfComponents - numberOfUnlinkedNotes,
      numberOfHubs: graph.notes
        .filter((note) => {
          const numberOfLinkedNotes = getNumberOfLinkedNotes(graph, note.id);
          return numberOfLinkedNotes >= config.MIN_NUMBER_OF_LINKS_FOR_HUB;
        })
        .length,
      nodesWithHighestNumberOfLinks: createNoteListItems(graph.notes, graph)
        .sort(getSortFunction(NoteListSortMode.NUMBER_OF_LINKS_DESCENDING))
        .slice(0, 3),
    }
  }

  return stats;
};


const setGraphVisualization = async (
  graphVisualizationFromUser:GraphVisualizationFromUser,
  graphId:GraphId,
):Promise<void> => {
  const graph:Graph = await io.getGraph(graphId);
  graphVisualizationFromUser.nodePositionUpdates.forEach(
    (nodePositionUpdate:GraphNodePositionUpdate):void => {
      updateNotePosition(graph, nodePositionUpdate);
    },
  );
  graph.links = graphVisualizationFromUser.links;
  graph.screenPosition = graphVisualizationFromUser.screenPosition;
  graph.initialNodePosition = graphVisualizationFromUser.initialNodePosition;
  await io.flushChanges(graphId, graph);
};


const put = async (
  noteFromUser:NoteFromUser,
  graphId:GraphId,
  options
):Promise<NoteToTransmit> => {
  if (
    (!noteFromUser)
    || (!Array.isArray(noteFromUser.blocks))
    || (typeof noteFromUser.title !== "string")
  ) {
    throw new Error(ErrorMessage.INVALID_NOTE_STRUCTURE);
  }

  let ignoreDuplicateTitles = true;
  if (
    (typeof options === "object")
    && (options.ignoreDuplicateTitles === false)
  ) {
    ignoreDuplicateTitles = false;
  }

  const graph:Graph = await io.getGraph(graphId);

  if (!ignoreDuplicateTitles && noteWithSameTitleExists(noteFromUser, graph)) {
    throw new Error(ErrorMessage.NOTE_WITH_SAME_TITLE_EXISTS);
  }

  let savedNote:SavedNote | null = null;

  if (
    typeof noteFromUser.id === "number"
  ) {
    savedNote = await findNote(graph, noteFromUser.id);
  }

  if (savedNote === null) {
    const noteId:NoteId = getNewNoteId(graph);
    savedNote = {
      id: noteId,
      position: graph.initialNodePosition,
      title: normalizeNoteTitle(noteFromUser.title),
      blocks: noteFromUser.blocks,
      creationTime: Date.now(),
      updateTime: Date.now(),
    };
    graph.notes.push(savedNote);
  } else {
    savedNote.blocks = noteFromUser.blocks;
    savedNote.title = normalizeNoteTitle(noteFromUser.title);
    savedNote.updateTime = Date.now();
  }

  removeDefaultTextParagraphs(savedNote);
  removeEmptyLinkBlocks(savedNote);
  incorporateUserChangesIntoNote(noteFromUser.changes, savedNote, graph);

  await io.flushChanges(graphId, graph);

  const noteToTransmit:NoteToTransmit
    = createNoteToTransmit(savedNote, graph);
  return noteToTransmit;
};


const remove = async (
  noteId:NoteId,
  graphId:GraphId,
):Promise<void> => {
  const graph = await io.getGraph(graphId);
  const noteIndex = Utils.binaryArrayFindIndex(graph.notes, "id", noteId);
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
  graph:GraphObject,
  graphId:GraphId,
):Promise<boolean> => {
  return io.flushChanges(graphId, graph);
};


const addFile = async (
  graphId:GraphId,
  readable:Readable,
  mimeType: string,
):Promise<{
  fileId: FileId,
  size: number,
}> => {
  const fileType = config.ALLOWED_FILE_TYPES
    .find((filetype) => {
      return filetype.mimeType === mimeType;
    });

  if (!fileType) {
    throw new Error(ErrorMessage.INVALID_MIME_TYPE);
  }

  const fileId:FileId = randomUUID() + "." + fileType.ending;
  const size = await io.addFile(graphId, fileId, readable);
  return {
    fileId,
    size,
  };
};


const deleteFile = async (
  graphId: GraphId,
  fileId: FileId,
):Promise<void> => {
  return io.deleteFile(graphId, fileId);
};


const getReadableFileStream = (
  graphId: GraphId,
  fileId:FileId,
  range?,
):Promise<ReadableWithType> => {
  return io.getReadableFileStream(graphId, fileId, range);
};


const getFileSize = (
  graphId: GraphId,
  fileId:FileId,
):Promise<number> => {
  return io.getFileSize(graphId, fileId);
};


const getReadableGraphStream = async (graphId, withFiles) => {
  return await io.getReadableGraphStream(graphId, withFiles);
};


const importLinksAsNotes = async (graphId, links) => {
  const promises:Promise<UrlMetadataResponse>[]
    = links.map((url:string):Promise<UrlMetadataResponse> => {
      return getUrlMetadata(url);
    });

  const promiseSettledResults = await Promise.allSettled(promises);

  const fulfilledPromises:PromiseSettledResult<UrlMetadataResponse>[]
    = promiseSettledResults.filter((response) => {
      return response.status === "fulfilled";
    });
  
  const urlMetadataResults:UrlMetadataResponse[]
    = fulfilledPromises.map((response) => {
      return (response.status === "fulfilled") && response.value;
    })
    .filter(Utils.isNotFalse);

  const notesFromUser:NoteFromUser[]
    = urlMetadataResults.map((urlMetadataObject) => {
    const noteFromUser:NoteFromUser = {
      title: urlMetadataObject.title,
      blocks: [
        {
          "type": NoteContentBlockType.LINK,
          "data": {
            "link": urlMetadataObject.url,
            "meta": {
              "title": urlMetadataObject.title,
              "description": urlMetadataObject.description,
              "image": {
                "url": urlMetadataObject.image,
              },
            }
          },
        },
      ],
    };

    return noteFromUser;
  });

  const notesToTransmit:NoteToTransmit[] = [];
  const failures:ImportLinkAsNoteFailure[] = [];

  for (let i = 0; i < notesFromUser.length; i++) {
    const noteFromUser:NoteFromUser = notesFromUser[i];

    try {
      const noteToTransmit:NoteToTransmit = await put(
        noteFromUser,
        graphId,
        {
          ignoreDuplicateTitles: true,
        },
      );
      notesToTransmit.push(noteToTransmit);
    } catch (e) {
      const errorMessage:string = e.toString();
      const failure:ImportLinkAsNoteFailure = {
        note: noteFromUser,
        error: errorMessage,
      };
      failures.push(failure);
    }
  }

  return {
    notesToTransmit,
    failures,
  };
};


const pin = async (
  graphId:GraphId,
  noteId:NoteId,
):Promise<NoteToTransmit[]> => {
  const graph = await io.getGraph(graphId);
  const noteIndex = Utils.binaryArrayFindIndex(graph.notes, "id", noteId);
  if (noteIndex === -1) {
    throw new Error(ErrorMessage.NOTE_NOT_FOUND);
  }

  graph.pinnedNotes = Array.from(
    new Set([...graph.pinnedNotes, noteId]),
  );

  await io.flushChanges(graphId, graph);

  const pinnedNotes:NoteToTransmit[] = await Promise.all(
    graph.pinnedNotes
      .map((noteId) => {
        return get(noteId, graphId);
      })
  );

  return pinnedNotes;
};


const unpin = async (
  graphId:GraphId,
  noteId:NoteId,
):Promise<NoteToTransmit[]> => {
  const graph = await io.getGraph(graphId);

  graph.pinnedNotes = graph.pinnedNotes.filter((nId) => nId !== noteId);

  await io.flushChanges(graphId, graph);

  const pinnedNotes:NoteToTransmit[] = await Promise.all(
    graph.pinnedNotes
      .map((noteId) => {
        return get(noteId, graphId);
      })
  );

  return pinnedNotes;
};


const getPins = async (graphId:GraphId):Promise<NoteToTransmit[]> => {
  const graph = await io.getGraph(graphId);

  const pinnedNotes:NoteToTransmit[] = await Promise.all(
    graph.pinnedNotes
      .map((noteId) => {
        return get(noteId, graphId);
      })
  );

  return pinnedNotes;
};


export {
  init,
  get,
  getNotesList,
  getGraphVisualization,
  setGraphVisualization,
  getStats,
  put,
  remove,
  importDB,
  addFile,
  deleteFile,
  getReadableFileStream,
  getFileSize,
  getReadableGraphStream,
  importLinksAsNotes,
  getUrlMetadata,
  pin,
  unpin,
  getPins,
};
