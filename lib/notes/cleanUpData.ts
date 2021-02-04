// @ts-nocheck

import {
  findNote,
  getNewNoteId,
  removeDefaultTextParagraphs,
  removeEmptyLinks,
} from "./noteUtils.js";
import * as DB from "./io.js";

const convertLinksFromLegacyFormat = (db) => {
  db.links = db.links.map((link) => {
    if ("id0" in link) {
      return [link.id0, link.id1];
    } else {
      return link;
    }
  });
};


const removeLinksOfNonExistingNotes = (db) => {
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
};


const linkExists = (linkToTest, links) => {
  return links
    .filter(
      (linkOfArray) => {
        return (
          (
            linkOfArray[0] === linkToTest[0]
            && linkOfArray[1] === linkToTest[1]
          )
          || (
            linkOfArray[0] === linkToTest[1]
            && linkOfArray[1] === linkToTest[0]
          )
        );
      },
    )
    .length > 0;
};


const removeDuplicateLinks = (db) => {
  const oldLinks = db.links;
  const newLinks = [];

  for (let i = 0; i < oldLinks.length; i++) {
    const link = oldLinks[i];

    if (!linkExists(link, newLinks)) {
      newLinks.push(link);
    }
  }

  db.links = newLinks;
};


const cleanUpLinks = (db) => {
  removeLinksOfNonExistingNotes(db);
  removeDuplicateLinks(db);
};


// this function must always be indempotent, so that there is only one
// canonical data structure
const cleanUpData = async () => {
  await DB.forEach((db) => {
    console.log("Cleaning db " + db.id + " ...");

    // each database should have an initialNodePosition
    if (!db.initialNodePosition) {
      db.initialNodePosition = {
        x: 0,
        y: 0,
      };
    }

    // add array for pinned notes if not existent
    if (!db.pinnedNotes) {
      db.pinnedNotes = [];
    }

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

      
      // a bug lead to a corrupt attaches block
      note.editorData.blocks
        .forEach((block) => {
          if (
            block.type === "attaches"
            && block.data.file.url?.includes("[object Object]")
          ) {
            const fileId = block.data.file.fileId.id;
            block.data.file.url = block.data.file.url
              .replace("[object Object]", fileId);
            block.data.file.fileId = fileId;
          }
        });


      // because of https://github.com/editor-js/attaches/issues/15
      // it was not possible to save the fileId as such in the
      // attaches block object. that's why we have to make sure that it is
      // available in every attaches block because the app depends on it.
      // nowadays, the fileId is added correctly.
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


      // trim heading if present
      if (note.editorData.blocks[0]?.type === "header") {
        note.editorData.blocks[0].data.text
          = note.editorData.blocks[0].data.text.trim();
      }


      // new NodePosition format
      if (typeof note.x === "number") {
        note.position = {
          x: note.x,
          y: note.y,
        };

        delete note.x;
        delete note.y;
      }
    });

    // remove invalid note ids from pins
    db.pinnedNotes = db.pinnedNotes.filter((pinnedNoteId) => {
      return ids.includes(pinnedNoteId);
    });
  });
};

export default cleanUpData;
