import DatabaseMainData from "../../interfaces/DatabaseMainData.js";
import DatabaseNote from "../../interfaces/DatabaseNote.js";
import { FileId } from "../../interfaces/FileId.js";
import GraphNodePositionUpdate from "../../interfaces/GraphNodePositionUpdate.js";
import { Link } from "../../interfaces/Link.js";
import LinkedNote from "../../interfaces/LinkedNote.js";
import Note from "../../interfaces/Note.js";
import NoteFromUser from "../../interfaces/NoteFromUser.js";
import { NoteId } from "../../interfaces/NoteId.js";
import NoteListItemFeatures from "../../interfaces/NoteListItemFeatures.js";
import NoteToTransmit from "../../interfaces/NoteToTransmit.js";
import UserNoteChange from "../../interfaces/UserNoteChange.js";
import { UserNoteChangeType } from "../../interfaces/UserNoteChangeType.js";
import * as Utils from "../utils.js";

const getNoteTitle = (note:Note):string => {
  if (typeof note?.editorData?.blocks?.[0]?.data?.text === "string") {
    let title
      = Utils.unescapeHTML(note.editorData.blocks[0].data.text);

    if (title.length > 800) {
      title = title.substr(0, 800) + " ...";
    }

    return title;
  } else {
    return "⁉️ Note without title";
  }
};


const removeDefaultTextParagraphs = (note:Note):void => {
  note.editorData.blocks = note.editorData.blocks.filter((block) => {
    const isDefaultTextParagraph = (
      block.type === "paragraph"
      && block.data.text === "Note text"
    );

    return !isDefaultTextParagraph;
  });
};

const removeEmptyLinks = (note:Note):void => {
  note.editorData.blocks = note.editorData.blocks.filter((block) => {
    const isEmptyLink = (
      block.type === "linkTool"
      && block.data.link === ""
    );

    return !isEmptyLink;
  });
};


const noteWithSameTitleExists = (
  note:NoteFromUser,
  db:DatabaseMainData,
):boolean => {
  const noteTitle = getNoteTitle(note);

  return db.notes.some((noteFromDB:DatabaseNote):boolean => {
    const noteFromDBTitle = getNoteTitle(noteFromDB);
    return (
      (noteFromDBTitle === noteTitle)
      && (note.id !== noteFromDB.id)
    );
  });
};


const findNote = (db:DatabaseMainData, noteId:NoteId):DatabaseNote | null => {
  return Utils.binaryArrayFind(db.notes, "id", noteId);
};


const getNewNoteId = (db:DatabaseMainData):NoteId => {
  db.idCounter = db.idCounter + 1;
  return db.idCounter;
};


const updateNotePosition = (
  db:DatabaseMainData,
  nodePositionUpdate: GraphNodePositionUpdate,
): boolean => {
  const note:DatabaseNote | null = findNote(db, nodePositionUpdate.id);
  if (note === null) {
    return false;
  }
  note.position = nodePositionUpdate.position;
  return true;
};


const getLinkedNotes = (db:DatabaseMainData, noteId:NoteId):LinkedNote[] => {
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


const removeLinksOfNote = (db: DatabaseMainData, noteId: NoteId):true => {
  db.links = db.links.filter((link) => {
    return (link[0] !== noteId) && (link[1] !== noteId);
  });
  return true;
};


const getFilesOfNote = (note:DatabaseNote):FileId[] => {
  return note.editorData.blocks
    .filter((block) => {
      const blockHasFileOrImage = (
        ((block.type === "image") || (block.type === "attaches"))
        && (typeof block.data.file.fileId === "string")
      );

      return blockHasFileOrImage;
    })
    .map((block) => {
      return block.data.file.fileId;
    });
};


const incorporateUserChangesIntoNote = (
  changes:UserNoteChange[] | undefined,
  note:DatabaseNote,
  db:DatabaseMainData,
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
  db: NonNullable<DatabaseMainData>,
):NoteToTransmit => {
  const noteToTransmit:NoteToTransmit = {
    id: databaseNote.id,
    editorData: databaseNote.editorData,
    title: getNoteTitle(databaseNote),
    creationTime: databaseNote.creationTime,
    updateTime: databaseNote.updateTime,
    linkedNotes: getLinkedNotes(db, databaseNote.id),
    position: databaseNote.position,
  };

  return noteToTransmit;
}


const getNoteFeatures = (note:DatabaseNote):NoteListItemFeatures => {
  let containsText = false;
  let containsWeblink = false;
  let containsCode = false;
  let containsImages = false;
  let containsAttachements = false;

  note.editorData.blocks.forEach((block) => {
    if (block.type === "paragraph") containsText = true;
    if (block.type === "linkTool") containsWeblink = true;
    if (block.type === "code") containsCode = true;
    if (block.type === "image") containsImages = true;
    if (block.type === "attaches") containsAttachements = true;
  });

  const features:NoteListItemFeatures = {
    containsText,
    containsWeblink,
    containsCode,
    containsImages,
    containsAttachements,
  };

  return features;
};


export {
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
};
