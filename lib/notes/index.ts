import DatabaseIO from "./DatabaseIO.js";
import * as Utils from "../utils.js";
import { v4 as uuidv4 } from "uuid";
import {
  getNoteTitle,
  removeDefaultTextParagraphs,
  removeEmptyLinks,
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
  getURLsOfNote,
  createNoteListItem,
  getNumberOfComponents,
} from "./noteUtils.js";
import cleanUpData from "./cleanUpData.js";
import Database from "./interfaces/DatabaseMainData.js";
import NoteListItem from "./interfaces/NoteListItem.js";
import Graph from "./interfaces/Graph.js";
import { DatabaseId } from "./interfaces/DatabaseId.js";
import { NoteId } from "./interfaces/NoteId.js";
import NoteToTransmit from "./interfaces/NoteToTransmit.js";
import GraphNode from "./interfaces/GraphNode.js";
import DatabaseNote from "./interfaces/DatabaseNote.js";
import NoteFromUser from "./interfaces/NoteFromUser.js";
import Stats from "./interfaces/Stats.js";
import GraphFromUser from "./interfaces/GraphFromUser.js";
import GraphNodePositionUpdate from "./interfaces/GraphNodePositionUpdate.js";
import { FileId } from "./interfaces/FileId.js";
import UrlMetadataResponse from "./interfaces/UrlMetadataResponse.js";
import ImportLinkAsNoteFailure from "./interfaces/ImportLinkAsNoteFailure.js";
import * as config from "./config.js";
import { Readable } from "stream";
import NoteListPage from "./interfaces/NoteListPage.js";
import { NoteListSortMode } from "./interfaces/NoteListSortMode.js";
import ReadableWithType from "./interfaces/ReadableWithMimeType.js";
import StatsExhaustive from "./interfaces/StatsExhaustive.js";

let io;

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


const init = async (storageProvider, _getUrlMetadata):Promise<void> => {
  console.log("Initializing notes module...");

  if (typeof _getUrlMetadata === "function") {
    getUrlMetadata = _getUrlMetadata;
  }

  console.log("Initializing DatabaseIO instance...");
  io = new DatabaseIO({storageProvider});

  console.log("Cleaning data...");
  await cleanUpData(io);
};


const get = async (noteId: NoteId, dbId: DatabaseId):Promise<NoteToTransmit> => {
  const db = await io.getMainData(dbId);
  const noteFromDB:DatabaseNote | null = findNote(db, noteId);
  if (!noteFromDB) {
    throw new Error("NOTE_NOT_FOUND");
  }

  const noteToTransmit:NoteToTransmit = createNoteToTransmit(noteFromDB, db);
  return noteToTransmit;
};


const getNotesList = async (
  dbId: DatabaseId,
  options,
): Promise<NoteListPage> => {
  const query = options.query || "";
  const caseSensitiveQuery = options.caseSensitiveQuery;
  const page = Math.max(options.page, 1) || 1;
  const sortMode
    = options.sortMode || NoteListSortMode.CREATION_DATE_DESCENDING;

  const db: Database = await io.getMainData(dbId);

  let matchingNotes;

  if (query.includes("special:DUPLICATE_URLS")){
    matchingNotes = db.notes
    // filter notes that match the search query
    .filter((n1:DatabaseNote, i:number, notes:DatabaseNote[]) => {
      const n1URLs = getURLsOfNote(n1);


      const duplicate = notes.find((n2:DatabaseNote, n2_i:number):boolean => {
        if (n2_i === i) return false;
        const n2URLs = getURLsOfNote(n2);
        return n1URLs.some((n1Link) => n2URLs.includes(n1Link));
      });
      
      return !!duplicate;
    });
  } else if (query.includes("exact:")) {
    const startOfExactQuery = query.indexOf("exact:") + "exact:".length;
    const exactQuery = query.substr(startOfExactQuery);

    matchingNotes = db.notes
      // filter notes that match the search query
      .filter((note:DatabaseNote) => {
        const title = getNoteTitle(note);
        return title.toLowerCase() === exactQuery.toLowerCase();
      });
  } else {
    matchingNotes = db.notes
      // filter notes that match the search query
      .filter((note:DatabaseNote) => {
        if (query.length === 0) {
          return true;
        }

        if (query.length > 0 && query.length < 3) {
          return false;
        }

        const title = getNoteTitle(note);
        const queryTokens = query.split(" ");

        if (caseSensitiveQuery) {
          return queryTokens.every((queryToken) => {
            return title.includes(queryToken);
          });
        } else {
          return queryTokens.every((queryToken) => {
            return title.toLowerCase().includes(queryToken.toLowerCase());
          });
        }
      });
  }

  // now we need to transform all notes into NoteListItems before we can
  // sort those
  const noteListItems:NoteListItem[] = matchingNotes
    .map((note) => createNoteListItem(note, db))
    .sort(getSortFunction(sortMode));

  const numberOfResults = noteListItems.length;

  // let's extract the list items for the requested page
  const noteListItemsOfPage:NoteListItem[] = Utils.getPagedMatches(
    noteListItems,
    page,
    config.NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE,
  );

  const noteListPage:NoteListPage = {
    results: noteListItemsOfPage,
    numberOfResults,
  }

  return noteListPage;
};


const getGraph = async (dbId: DatabaseId):Promise<Graph> => {
  const db = await io.getMainData(dbId);

  const graphNodes:GraphNode[] = db.notes.map((note) => {
    const graphNode:GraphNode = {
      id: note.id,
      title: getNoteTitle(note),
      position: note.position,
      linkedNotes: getLinkedNotes(db, note.id),
      creationTime: note.creationTime,
    };
    return graphNode;
  });

  const graph:Graph = {
    nodes: graphNodes,
    links: db.links,
    screenPosition: db.screenPosition,
    initialNodePosition: db.initialNodePosition,
  }

  return graph;
};


const getStats = async (dbId:DatabaseId, exhaustive:boolean):Promise<Stats | StatsExhaustive> => {
  const db = await io.getMainData(dbId);

  const numberOfUnlinkedNotes = db.notes.filter((note) => {
    return getNumberOfLinkedNotes(db, note.id) === 0;
  }).length;
  

  let stats:Stats | StatsExhaustive = {
    numberOfAllNotes: db.notes.length,
    numberOfLinks: db.links.length,
    numberOfUnlinkedNotes,
  };

  if (exhaustive) {
    const numberOfComponents = getNumberOfComponents(db.notes, db.links);

    stats = {
      ...stats,
      numberOfFiles: await io.getNumberOfFiles(dbId),
      numberOfPins: db.pinnedNotes.length,
      numberOfComponents,
      numberOfComponentsWithMoreThanOneNode:
        numberOfComponents - numberOfUnlinkedNotes,
      numberOfHubs: db.notes
        .filter((note) => getNumberOfLinkedNotes(db, note.id) >= 5)
        .length,
      maxNumberOfLinksOnANode: db.notes.reduce((accumulator, note) => {
        const numberOfLinks = getNumberOfLinkedNotes(db, note.id);
        return numberOfLinks > accumulator ? numberOfLinks : accumulator
      }, 0),
      dbCreationTime: db.creationTime,
      dbUpdateTime: db.updateTime,
    }
  }

  return stats;
};


const setGraph = async (
  graphFromUser:GraphFromUser,
  dbId:DatabaseId,
):Promise<void> => {
  const db:Database = await io.getMainData(dbId);
  graphFromUser.nodePositionUpdates.forEach(
    (nodePositionUpdate:GraphNodePositionUpdate):void => {
      updateNotePosition(db, nodePositionUpdate);
    },
  );
  db.links = graphFromUser.links;
  db.screenPosition = graphFromUser.screenPosition;
  db.initialNodePosition = graphFromUser.initialNodePosition;
  await io.flushChanges(db);
};


const put = async (
  noteFromUser:NoteFromUser,
  dbId:DatabaseId,
  options
):Promise<NoteToTransmit> => {
  let ignoreDuplicateTitles = true;
  if (
    (typeof options === "object")
    && (options.ignoreDuplicateTitles === false)
  ) {
    ignoreDuplicateTitles = false;
  }

  const db:Database = await io.getMainData(dbId);

  if (!ignoreDuplicateTitles && noteWithSameTitleExists(noteFromUser, db)) {
    throw new Error("NOTE_WITH_SAME_TITLE_EXISTS");
  }

  let databaseNote:DatabaseNote | null = null;

  if (
    typeof noteFromUser.id === "number"
  ) {
    databaseNote = await findNote(db, noteFromUser.id);
  }

  if (databaseNote === null) {
    const noteId:NoteId = getNewNoteId(db);
    databaseNote = {
      id: noteId,
      position: db.initialNodePosition,
      editorData: noteFromUser.editorData,
      creationTime: Date.now(),
      updateTime: Date.now(),
    };
    db.notes.push(databaseNote);
  } else {
    databaseNote.editorData = noteFromUser.editorData;
    databaseNote.updateTime = Date.now();
  }

  removeDefaultTextParagraphs(databaseNote);
  removeEmptyLinks(databaseNote);
  incorporateUserChangesIntoNote(noteFromUser.changes, databaseNote, db);

  await io.flushChanges(db);

  const noteToTransmit:NoteToTransmit
    = createNoteToTransmit(databaseNote, db);
  return noteToTransmit;
};


const remove = async (noteId, dbId):Promise<void> => {
  const db = await io.getMainData(dbId);
  const noteIndex = Utils.binaryArrayFindIndex(db.notes, "id", noteId);
  if ((noteIndex === -1) || (noteIndex === null)) {
    throw new Error("Note not found");
  }

  db.notes.splice(noteIndex, 1);
  removeLinksOfNote(db, noteId);
  db.pinnedNotes = db.pinnedNotes.filter((nId) => nId !== noteId);

  /*
    we do not remove files used in this note, because they could be used in
    other notes. unused files should be deleted in the clean up process.
  */

  await io.flushChanges(db);
};


const importDB = (db, dbId) => {
  if (db.id !== dbId) {
    throw new Error("UNAUTHORIZED: You are not allowed to update another DB");
  }
  return io.flushChanges(db);
};


const addFile = async (
  dbId:DatabaseId,
  readable:Readable,
  mimeType: string,
):Promise<FileId> => {
  const fileType = config.ALLOWED_FILE_TYPES
    .find((filetype) => {
      return filetype.mimeType === mimeType;
    });

  if (!fileType) {
    throw new Error("Invalid MIME type: " + mimeType);
  }

  const fileId:FileId = uuidv4() + "." + fileType.ending;
  await io.addFile(dbId, fileId, readable);
  return fileId;
};


const getReadableFileStream = (
  dbId: DatabaseId,
  fileId:FileId,
  range?,
):Promise<ReadableWithType> => {
  return io.getReadableFileStream(dbId, fileId, range);
};


const getFileSize = (
  dbId: DatabaseId,
  fileId:FileId,
):Promise<number> => {
  return io.getFileSize(dbId, fileId);
};


const getReadableDatabaseStream = async (dbId, withUploads) => {
  return await io.getReadableDatabaseStream(dbId, withUploads);
};


const importLinksAsNotes = async (dbId, links) => {
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
      editorData: {
        "time": Date.now(),
        "blocks": [
          {
            "type": "header",
            "data": {
              "text": urlMetadataObject.title,
              "level": 1,
            },
          },
          {
            "type": "linkTool",
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
        "version": "2.16.1",
      },
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
        dbId,
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
  dbId:DatabaseId,
  noteId:NoteId,
):Promise<NoteToTransmit[]> => {
  const db = await io.getMainData(dbId);
  const noteIndex = Utils.binaryArrayFindIndex(db.notes, "id", noteId);
  if (noteIndex === -1) {
    throw new Error("Note not found");
  }

  db.pinnedNotes = Array.from(
    new Set([...db.pinnedNotes, noteId]),
  );

  await io.flushChanges(db);

  const pinnedNotes:NoteToTransmit[] = await Promise.all(
    db.pinnedNotes
      .map((noteId) => {
        return get(noteId, dbId);
      })
  );

  return pinnedNotes;
};


const unpin = async (
  dbId:DatabaseId,
  noteId:NoteId,
):Promise<NoteToTransmit[]> => {
  const db = await io.getMainData(dbId);

  db.pinnedNotes = db.pinnedNotes.filter((nId) => nId !== noteId);

  await io.flushChanges(db);

  const pinnedNotes:NoteToTransmit[] = await Promise.all(
    db.pinnedNotes
      .map((noteId) => {
        return get(noteId, dbId);
      })
  );

  return pinnedNotes;
};


const getPins = async (dbId:DatabaseId):Promise<NoteToTransmit[]> => {
  const db = await io.getMainData(dbId);

  const pinnedNotes:NoteToTransmit[] = await Promise.all(
    db.pinnedNotes
      .map((noteId) => {
        return get(noteId, dbId);
      })
  );

  return pinnedNotes;
};


export {
  init,
  get,
  getNotesList,
  getGraph,
  setGraph,
  getStats,
  put,
  remove,
  importDB,
  addFile,
  getReadableFileStream,
  getFileSize,
  getReadableDatabaseStream,
  importLinksAsNotes,
  getUrlMetadata,
  pin,
  unpin,
  getPins,
};
