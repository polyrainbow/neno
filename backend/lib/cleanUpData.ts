import {
  findNote,
  getNewNoteId,
  removeDefaultTextParagraphs,
  removeEmptyLinks,
} from "./noteUtils.js";
import * as DB from "./database.js";

const convertLinksFromLegacyFormat = (db) => {
  db.links = db.links.map((link) => {
    if ("id0" in link) {
      return [link.id0, link.id1];
    } else {
      return link;
    }
  });
  return true;
};


const cleanUpLinks = (db) => {
  db.links = db.links.filter((link) => {
    const note0 = findNote(db, link[0]);
    const note1 = findNote(db, link[1]);
    return (
      (typeof note0 === "object")
      && (note0 !== null)
      && (typeof note1 === "object")
      && (note1 !== null)
    );
  });
  return true;
};

// this function must always be indempotent, so that there is only one
// canonical data structure
const cleanUpData = () => {
  DB.forEach((db) => {
    convertLinksFromLegacyFormat(db);

    // remove invalid links
    cleanUpLinks(db);

    const ids = [];

    db.notes.forEach((note) => {
      // assign id to id-less notes
      if (typeof note.id !== "number" || ids.includes(note.id)) {
        note.id = getNewNoteId(db);
      }
      ids.push(note.id);

      // remove unnecessary linkedNotes object if it exists
      if (note.linkedNotes) {
        delete note.linkedNotes;
      }

      // convert to new timestamps
      if (typeof note.time === "number") {
        note.creationTime = note.time;
        note.updateTime = note.time;
        delete note.time;
      }

      removeDefaultTextParagraphs(note);
      removeEmptyLinks(note);

      // remove old title property, title is nowadays obtained by editor data
      if (note.title) {
        delete note.title;
      }

      // remove isUnsaved property set by client
      if (typeof note.isUnsaved === "boolean") {
        delete note.isUnsaved;
      }

      // remove changes property set by client
      if (Array.isArray(note.changes)) {
        delete note.changes;
      }

      // rename old "imageId" keys in image blocks to "fileId"
      note.editorData.blocks
        .filter((block) => {
          const blockHasOldImageId = (
            block.type === "image"
            && (typeof block.data.file.imageId === "string")
          );

          return blockHasOldImageId;
        })
        .forEach((block) => {
          block.data.file.fileId = block.data.file.imageId;
          delete block.data.file.imageId;
        });

      // update image api url endpoint
      note.editorData.blocks
        .forEach((block) => {
          if (
            block.type === "image"
            && (block?.data?.file?.url?.startsWith("/api/image/"))
          ) {
            block.data.file.url
              = block.data.file.url.replace(/\/api\/image\//, "/api/file/");
          }
        });

      // because of https://github.com/editor-js/attaches/issues/15
      // it is currently not possible to save the fileId as such in the
      // attaches block object. that's why we have to manually add it afterwards
      note.editorData.blocks
        .forEach((block) => {
          if (
            block.type === "attaches"
            && (typeof block?.data?.file?.url === "string")
            && (!block?.data?.file?.fileId)
          ) {
            const url = block.data.file.url;
            block.data.file.fileId
              = url.substr(url.lastIndexOf("/") + 1);
          }
        });
    });
  });
};

export default cleanUpData;
