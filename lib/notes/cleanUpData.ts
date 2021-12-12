/*
  This module is to clean up the database.
  It is not used to modify the data structure/the database schema from
  legacy schemas.
*/

import DatabaseMainData from "./interfaces/DatabaseMainData.js";
import { Link } from "./interfaces/Link.js";
import { NoteId } from "./interfaces/NoteId.js";
import {
  findNote,
  getNewNoteId,
  removeDefaultTextParagraphs,
  removeEmptyLinkBlocks,
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


const removeDuplicateLinks = (db:DatabaseMainData) => {
  const oldLinks = db.links;
  const newLinks:Link[] = [];

  for (let i = 0; i < oldLinks.length; i++) {
    const link:Link = oldLinks[i];

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


const cleanUpNotes = (db) => {
  const existingNoteIds:NoteId[] = [];

  db.notes.forEach((note) => {
    // assign id to id-less notes
    if (typeof note.id !== "number" || existingNoteIds.includes(note.id)) {
      note.id = getNewNoteId(db);
    }
    existingNoteIds.push(note.id);

    // trim heading if present
    if (note.blocks[0]?.type === "header") {
      note.blocks[0].data.text
        = note.blocks[0].data.text.trim();
    }

    removeDefaultTextParagraphs(note);
    removeEmptyLinkBlocks(note);
  });

  // remove invalid note ids from pins
  db.pinnedNotes = db.pinnedNotes.filter((pinnedNoteId) => {
    return existingNoteIds.includes(pinnedNoteId);
  });
}


const cleanUpDatabase = (db) => {
  cleanUpLinks(db);
  cleanUpNotes(db);
}


// this function must be indempotent, so that there is only one
// canonical data structure
const cleanUpData = async (io) => {
  await io.forEach(cleanUpDatabase);
};

export default cleanUpData;
