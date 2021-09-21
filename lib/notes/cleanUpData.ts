// @ts-nocheck

import {
  findNote,
  getNewNoteId,
  removeDefaultTextParagraphs,
  removeEmptyLinks,
} from "./noteUtils.js";


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
const cleanUpData = async (io) => {
  await io.forEach((db) => {
    console.log("Cleaning db " + db.id + " ...");

    // remove invalid links
    cleanUpLinks(db);

    const ids = [];

    db.notes.forEach((note) => {
      // assign id to id-less notes
      if (typeof note.id !== "number" || ids.includes(note.id)) {
        note.id = getNewNoteId(db);
      }
      ids.push(note.id);

      removeDefaultTextParagraphs(note);
      removeEmptyLinks(note);

      // trim heading if present
      if (note.editorData.blocks[0]?.type === "header") {
        note.editorData.blocks[0].data.text
          = note.editorData.blocks[0].data.text.trim();
      }

    });

    // remove invalid note ids from pins
    db.pinnedNotes = db.pinnedNotes.filter((pinnedNoteId) => {
      return ids.includes(pinnedNoteId);
    });
  });
};

export default cleanUpData;
