import * as DB from "./database.js";
import * as Utils from "./utils.js";
import { v4 as uuidv4 } from "uuid";
import {
  getNoteTitle,
  removeDefaultTextParagraphs,
  removeEmptyLinks,
  noteWithSameTitleExists,
  findNote,
  getNewNoteId,
} from "./noteUtils.js";
import cleanUpData from "./cleanUpData.js";
import Database from "../interfaces/Database.js";
import NoteListItem from "../interfaces/NoteListItem.js";
import Graph from "../interfaces/Graph.js";
import { UserId } from "../interfaces/UserId.js";
import { NoteId } from "../interfaces/NoteId.js";
import NoteToTransmit from "../interfaces/NoteToTransmit.js";
import GraphNode from "../interfaces/GraphNode.js";
import DatabaseNote from "../interfaces/DatabaseNote.js";
import NoteFromUser from "../interfaces/NoteFromUser.js";
import { UserNoteChangeType } from "../interfaces/UserNoteChangeType.js";
import { Link } from "../interfaces/Link.js";
import NoteListItemFeatures from "../interfaces/NoteListItemFeatures.js";
import Stats from "../interfaces/Stats.js";
import LinkedNote from "../interfaces/LinkedNote.js";
import UserNoteChange from "../interfaces/UserNoteChange.js";

/**
  PRIVATE
  These private methods manipulate a db object that is passed to them as
  argument.
*/


const updateNotePosition = (
  db:Database,
  noteId: NoteId,
  x: number,
  y: number
): boolean => {
  const note:DatabaseNote | null = findNote(db, noteId);
  if (note === null) {
    return false;
  }
  note.x = x;
  note.y = y;
  return true;
};


const getLinkedNotes = (db:Database, noteId:NoteId):LinkedNote[] => {
  const notes:DatabaseNote[] | null = db.links
    .filter((link:Link):boolean => {
      return (link[0] === noteId) || (link[1] === noteId);
    })
    .map((link:Link):DatabaseNote | null => {
      const linkedNoteId = (link[0] === noteId) ? link[1] : link[0];
      return findNote(db, linkedNoteId);
    })
    .filter(Utils.isNotEmpty);

  const linkedNotes:LinkedNote[] = notes
    .map((note:DatabaseNote) => {
      const linkedNote:LinkedNote = {
        id: note.id,
        title: getNoteTitle(note),
        creationTime: note.creationTime,
        updateTime: note.updateTime,
      }
      return linkedNote;
    });

  return linkedNotes;
};


const removeLinksOfNote = (db, noteId) => {
  db.links = db.links.filter((link) => {
    return (link[0] !== noteId) && (link[1] !== noteId);
  });
  return true;
};


const getUploadsOfNote = (note) => {
  return note.editorData.blocks
    .filter((block) => {
      const blockHasImage = (
        block.type === "image"
        && (typeof block.data.file.fileId === "string")
      );

      // because of https://github.com/editor-js/attaches/issues/15
      // it is currently not possible to save the fileId as such in the
      // attaches block object. that's why we have to parse it from the url
      const blockHasFile = (
        block.type === "attaches"
        && (typeof block.data.file.url === "string")
      );

      return blockHasImage || blockHasFile;
    })
    .map((block) => {
      let fileId = null;

      if (block.type === "image") {
        fileId = block.data.file.fileId;
      }

      // because of https://github.com/editor-js/attaches/issues/15
      // it is currently not possible to save the fileId as such in the
      // attaches block object. that's why we have to parse it from the url
      if (block.type === "attaches") {
        const url = block.data.file.url;
        fileId = url.substr(url.lastIndexOf("/") + 1);
      }

      return fileId;
    });
};


const removeUploadsOfNote = (note) => {
  getUploadsOfNote(note)
    .forEach((fileId) => {
      DB.deleteBlob(fileId);
    });
};


const incorporateUserChangesIntoNote = (
  changes:UserNoteChange[] | undefined,
  note:DatabaseNote,
  db:Database,
):void => {
  if (Array.isArray(changes)) {
    changes.forEach((change) => {
      if (change.type === UserNoteChangeType.LINKED_NOTE_ADDED) {
        const link:Link = [note.id, change.noteId];
        db.links.push(link);
      }

      if (change.type === UserNoteChangeType.LINKED_NOTE_DELETED) {
        db.links = db.links.filter((link) => {
          return !(
            link.includes(note.id) && link.includes(change.noteId)
          );
        });
      }
    });
  }
};


const createNoteToTransmit = (
  databaseNote:NonNullable<DatabaseNote>,
  db: NonNullable<Database>,
):NoteToTransmit => {
  const noteToTransmit:NoteToTransmit = {
    id: databaseNote.id,
    editorData: databaseNote.editorData,
    title: getNoteTitle(databaseNote),
    creationTime: databaseNote.creationTime,
    updateTime: databaseNote.updateTime,
    linkedNotes: getLinkedNotes(db, databaseNote.id),
  };

  return noteToTransmit;
}


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
  const db = DB.get(userId);
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

  const db: Database = DB.get(userId);
  const filteredNotes = db.notes
    .filter((note) => {
      if (query.length === 0) {
        return true;
      }

      if (query.length > 0 && query.length < 3) {
        return false;
      }

      const title = getNoteTitle(note);
      if (caseSensitiveQuery) {
        return title.includes(query);
      } else {
        return title.toLowerCase().includes(query.toLowerCase());
      }
    });


  const items:NoteListItem[] = filteredNotes
    .map((note:DatabaseNote):NoteListItem => {
      const features:NoteListItemFeatures = {
        containsImages:
          note.editorData.blocks.some((block) => block.type === "image"),
        containsAttachements:
          note.editorData.blocks.some((block) => block.type === "attaches"),
      };

      const noteListItem:NoteListItem = {
        id: note.id,
        title: getNoteTitle(note),
        creationTime: note.creationTime,
        updateTime: note.updateTime,
        features: features,
        numberOfLinkedNotes: getLinkedNotes(db, note.id).length,
      };

      return noteListItem;
    });

  return items;
};


const getGraph = (userId: UserId):Graph => {
  const db = DB.get(userId);

  const graphNodes:GraphNode[] = db.notes.map((note) => {
    const graphNode:GraphNode = {
      id: note.id,
      title: getNoteTitle(note),
      x: note.x,
      y: note.y,
    };
    return graphNode;
  });

  const graph:Graph = {
    nodes: graphNodes,
    links: db.links,
    screenPosition: db.screenPosition,
  }

  return graph;
};


const getStats = (userId:UserId):Stats => {
  const db = DB.get(userId);

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


const setGraph = (graphFromUser:Graph, userId:UserId):boolean => {
  const db = DB.get(userId);
  graphFromUser.nodes.forEach((node) => {
    updateNotePosition(db, node.id, node.x, node.y);
  });
  db.links = graphFromUser.links;
  db.screenPosition = graphFromUser.screenPosition;
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

  const db:Database = DB.get(userId);

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
      x: 0,
      y: 0,
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
  const db = DB.get(userId);
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
  removeUploadsOfNote(note);
  DB.flushChanges(db);
  return true;
};


const exportDB = (userId) => {
  return DB.get(userId);
};


const importDB = (db, userId) => {
  if (db.id !== userId) {
    throw new Error("UNAUTHORIZED: You are not allowed to update another DB");
  }
  return DB.flushChanges(db);
};


const getFilesForDBExport = (userId) => {
  const jsonFile = DB.getDBFile(userId);
  const db = DB.get(userId);
  const uploadedFiles = db.notes
    .map(getUploadsOfNote)
    .flat()
    .map(DB.getBlob);
  const files = [jsonFile, ...uploadedFiles];
  return files;
};


const addFile = (sourcePath, fileType) => {
  const newFilename = uuidv4() + "." + fileType.ending;
  DB.addBlob(newFilename, sourcePath);
  return newFilename;
};


const getFile = (fileId) => {
  return DB.getBlob(fileId);
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
  exportDB,
  importDB,
  addFile,
  getFile,
  getFilesForDBExport,
};
