import * as DB from "./database.js";
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
import { File } from "../../interfaces/File.js";
import { Readable } from "stream";


/**
  EXPORTS
**/


const init = (dataFolderPath:string):void => {
  console.log("Initializing notes module...");

  DB.init({
    dataFolderPath,
  });

  console.log("Cleaning data...");
  cleanUpData();
};


const get = (noteId: NoteId, userId: UserId):NoteToTransmit | null => {
  const db = DB.getMainData(userId);
  const noteFromDB:DatabaseNote | null = findNote(db, noteId);
  if (!noteFromDB) {
    return null;
  }

  const noteToTransmit:NoteToTransmit = createNoteToTransmit(noteFromDB, db);
  return noteToTransmit;
};


const getNotesList = (userId: UserId, options): NoteListItem[] => {
  const query = options.query;
  const caseSensitiveQuery = options.caseSensitiveQuery;

  const db: Database = DB.getMainData(userId);
  const filteredNotes = db.notes
    .filter((note) => {
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


  const items:NoteListItem[] = filteredNotes
    .map((note:DatabaseNote):NoteListItem => {
      const noteListItem:NoteListItem = {
        id: note.id,
        title: getNoteTitle(note),
        creationTime: note.creationTime,
        updateTime: note.updateTime,
        features: getNoteFeatures(note),
        numberOfLinkedNotes: getLinkedNotes(db, note.id).length,
      };

      return noteListItem;
    });

  return items;
};


const getGraph = (userId: UserId):Graph => {
  const db = DB.getMainData(userId);

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


const getStats = (userId:UserId):Stats => {
  const db = DB.getMainData(userId);

  const numberOfUnlinkedNotes = db.notes.filter((note) => {
    return getLinkedNotes(db, note.id).length === 0;
  }).length;

  const stats:Stats = {
    numberOfAllNotes: db.notes.length,
    numberOfLinks: db.links.length,
    numberOfUnlinkedNotes,
  };

  return stats;
};


const setGraph = (graphFromUser:GraphFromUser, userId:UserId):boolean => {
  const db:Database = DB.getMainData(userId);
  graphFromUser.nodePositionUpdates.forEach(
    (nodePositionUpdate:GraphNodePositionUpdate):void => {
      updateNotePosition(db, nodePositionUpdate);
    },
  );
  db.links = graphFromUser.links;
  db.screenPosition = graphFromUser.screenPosition;
  db.initialNodePosition = graphFromUser.initialNodePosition;
  DB.flushChanges(db);
  return true;
};


const put = (
  noteFromUser:NoteFromUser,
  userId:UserId,
  options
):NoteToTransmit => {
  let ignoreDuplicateTitles = true;
  if (
    (typeof options === "object")
    && (options.ignoreDuplicateTitles === false)
  ) {
    ignoreDuplicateTitles = false;
  }

  const db:Database = DB.getMainData(userId);

  if (!ignoreDuplicateTitles && noteWithSameTitleExists(noteFromUser, db)) {
    throw new Error("NOTE_WITH_SAME_TITLE_EXISTS");
  }

  let databaseNote:DatabaseNote | null = null;

  if (
    typeof noteFromUser.id === "number"
  ) {
    databaseNote = findNote(db, noteFromUser.id);
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

  DB.flushChanges(db);

  const noteToTransmit:NoteToTransmit
    = createNoteToTransmit(databaseNote, db);
  return noteToTransmit;
};


const remove = (noteId, userId) => {
  const db = DB.getMainData(userId);
  const noteIndex = Utils.binaryArrayFindIndex(db.notes, "id", noteId);
  if (noteIndex === -1) {
    return false;
  }
  const note = db.notes[noteIndex];
  if (noteIndex === null) {
    return false;
  }
  db.notes.splice(noteIndex, 1);
  removeLinksOfNote(db, noteId);

  // remove files used in this note
  getFilesOfNote(note)
    .forEach((fileId) => {
      DB.deleteFile(userId, fileId);
    });

  DB.flushChanges(db);
  return true;
};


const importDB = (db, userId) => {
  if (db.id !== userId) {
    throw new Error("UNAUTHORIZED: You are not allowed to update another DB");
  }
  return DB.flushChanges(db);
};


const addFile = (userId:UserId, file:File):FileId => {
  const fileType = config.ALLOWED_FILE_TYPES
    .find((filetype) => {
      return filetype.mimeType === file.type;
    });

  if (!fileType) {
    throw new Error("Invalid MIME type: " + file.type);
  }

  const sourcePath = file.path;

  const fileId:FileId = uuidv4() + "." + fileType.ending;
  DB.addFile(userId, fileId, sourcePath);
  return fileId;
};


const getReadableFileStream = (userId: UserId, fileId:FileId):Readable => {
  return DB.getReadableFileStream(userId, fileId);
};


const getReadableDatabaseStream = (userId, withUploads) => {
  return DB.getReadableDatabaseStream(userId, withUploads);
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
              "text": urlMetadataObject.meta.title,
              "level": 1,
            },
          },
          {
            "type": "linkTool",
            "data": {
              "link": urlMetadataObject.url,
              "meta": urlMetadataObject.meta,
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

  notesFromUser.forEach((noteFromUser:NoteFromUser) => {
    try {
      const noteToTransmit:NoteToTransmit = put(
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
  });

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
