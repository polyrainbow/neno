import * as DB from "./io.js";
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
  getFilesOfNote,
  incorporateUserChangesIntoNote,
  createNoteToTransmit,
  getNoteFeatures,
  getSortFunction,
  getNumberOfLinkedNotes,
  getNumberOfCharacters,
  getURLsOfNote,
} from "./noteUtils.js";
import cleanUpData from "./cleanUpData.js";
import Database from "../../interfaces/DatabaseMainData.js";
import NoteListItem from "../../interfaces/NoteListItem.js";
import Graph from "../../interfaces/Graph.js";
import { UserId } from "../../interfaces/UserId.js";
import { NoteId } from "../../interfaces/NoteId.js";
import NoteToTransmit from "../../interfaces/NoteToTransmit.js";
import GraphNode from "../../interfaces/GraphNode.js";
import DatabaseNote from "../../interfaces/DatabaseNote.js";
import NoteFromUser from "../../interfaces/NoteFromUser.js";
import Stats from "../../interfaces/Stats.js";
import GraphFromUser from "../../interfaces/GraphFromUser.js";
import GraphNodePositionUpdate from "../../interfaces/GraphNodePositionUpdate.js";
import { FileId } from "../../interfaces/FileId.js";
import UrlMetadataResponse from "../../interfaces/UrlMetadataResponse.js";
import ImportLinkAsNoteFailure from "../../interfaces/ImportLinkAsNoteFailure.js";
import getUrlMetadata from "./getUrlMetadata.js";
import * as config from "./config.js";
import { Readable } from "stream";
import NoteListPage from "../../interfaces/NoteListPage.js";
import { NoteListSortMode } from "../../interfaces/NoteListSortMode.js";


/**
  EXPORTS
**/


const init = async (storageProvider):Promise<void> => {
  console.log("Initializing notes module...");

  DB.init({
    storageProvider,
  });

  console.log("Cleaning data...");
  await cleanUpData();
};


const get = async (noteId: NoteId, userId: UserId):Promise<NoteToTransmit> => {
  const db = await DB.getMainData(userId);
  const noteFromDB:DatabaseNote | null = findNote(db, noteId);
  if (!noteFromDB) {
    throw new Error("NOTE_NOT_FOUND");
  }

  const noteToTransmit:NoteToTransmit = createNoteToTransmit(noteFromDB, db);
  return noteToTransmit;
};


const getNotesList = async (
  userId: UserId,
  options,
): Promise<NoteListPage> => {
  const query = options.query;
  const caseSensitiveQuery = options.caseSensitiveQuery;
  const page = Math.max(options.page, 1) || 1;
  const sortMode
    = options.sortMode || NoteListSortMode.CREATION_DATE_DESCENDING;

  const db: Database = await DB.getMainData(userId);

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
    .map((note:DatabaseNote):NoteListItem => {
      const noteListItem:NoteListItem = {
        id: note.id,
        title: getNoteTitle(note),
        creationTime: note.creationTime,
        updateTime: note.updateTime,
        features: getNoteFeatures(note),
        numberOfLinkedNotes: getNumberOfLinkedNotes(db, note.id),
        numberOfCharacters: getNumberOfCharacters(note),
      };

      return noteListItem;
    })
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


const getGraph = async (userId: UserId):Promise<Graph> => {
  const db = await DB.getMainData(userId);

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


const getStats = async (userId:UserId):Promise<Stats> => {
  const db = await DB.getMainData(userId);

  const numberOfUnlinkedNotes = db.notes.filter((note) => {
    return getNumberOfLinkedNotes(db, note.id) === 0;
  }).length;

  const stats:Stats = {
    numberOfAllNotes: db.notes.length,
    numberOfLinks: db.links.length,
    numberOfUnlinkedNotes,
  };

  return stats;
};


const setGraph = async (
  graphFromUser:GraphFromUser,
  userId:UserId,
):Promise<void> => {
  const db:Database = await DB.getMainData(userId);
  graphFromUser.nodePositionUpdates.forEach(
    (nodePositionUpdate:GraphNodePositionUpdate):void => {
      updateNotePosition(db, nodePositionUpdate);
    },
  );
  db.links = graphFromUser.links;
  db.screenPosition = graphFromUser.screenPosition;
  db.initialNodePosition = graphFromUser.initialNodePosition;
  await DB.flushChanges(db);
};


const put = async (
  noteFromUser:NoteFromUser,
  userId:UserId,
  options
):Promise<NoteToTransmit> => {
  let ignoreDuplicateTitles = true;
  if (
    (typeof options === "object")
    && (options.ignoreDuplicateTitles === false)
  ) {
    ignoreDuplicateTitles = false;
  }

  const db:Database = await DB.getMainData(userId);

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

  await DB.flushChanges(db);

  const noteToTransmit:NoteToTransmit
    = createNoteToTransmit(databaseNote, db);
  return noteToTransmit;
};


const remove = async (noteId, userId):Promise<void> => {
  const db = await DB.getMainData(userId);
  const noteIndex = Utils.binaryArrayFindIndex(db.notes, "id", noteId);
  if (noteIndex === -1) {
    throw new Error("Note not found");
  }
  const note = db.notes[noteIndex];
  if (noteIndex === null) {
    throw new Error("Note not found");
  }
  db.notes.splice(noteIndex, 1);
  removeLinksOfNote(db, noteId);

  // remove files used in this note
  getFilesOfNote(note)
    .forEach((fileId) => {
      DB.deleteFile(userId, fileId);
    });

  await DB.flushChanges(db);
};


const importDB = (db, userId) => {
  if (db.id !== userId) {
    throw new Error("UNAUTHORIZED: You are not allowed to update another DB");
  }
  return DB.flushChanges(db);
};


const addFile = async (
  userId:UserId,
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
  await DB.addFile(userId, fileId, readable);
  return fileId;
};


const getReadableFileStream = (userId: UserId, fileId:FileId):Readable => {
  return DB.getReadableFileStream(userId, fileId);
};


const getReadableDatabaseStream = async (userId, withUploads) => {
  return await DB.getReadableDatabaseStream(userId, withUploads);
};


const importLinksAsNotes = async (userId, links) => {
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
        userId,
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
  getReadableDatabaseStream,
  importLinksAsNotes,
  getUrlMetadata,
};
