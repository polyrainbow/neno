/*
  This module is to clean up a graph.
  It is not used to modify the data structure/the database schema from
  legacy schemas.
*/

import GraphObject from "./interfaces/Graph.js";
import DatabaseMainData from "./interfaces/Graph.js";
import { Link } from "./interfaces/Link.js";
import { NoteId } from "./interfaces/NoteId.js";
import {
  findNote,
  getNewNoteId,
  normalizeNoteTitle,
} from "./noteUtils.js";


const removeLinksOfNonExistingNotes = (graph) => {
  graph.links = graph.links.filter((link) => {
    const note0 = findNote(graph, link[0]);
    const note1 = findNote(graph, link[1]);
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


const removeDuplicateLinks = (graph: DatabaseMainData) => {
  const oldLinks = graph.links;
  const newLinks: Link[] = [];

  for (let i = 0; i < oldLinks.length; i++) {
    const link: Link = oldLinks[i];

    if (!linkExists(link, newLinks)) {
      newLinks.push(link);
    }
  }

  graph.links = newLinks;
};


const cleanUpLinks = (graph) => {
  removeLinksOfNonExistingNotes(graph);
  removeDuplicateLinks(graph);
};


const cleanUpNotes = (graph: GraphObject) => {
  const existingNoteIds: NoteId[] = [];

  graph.notes.forEach((note) => {
    // assign id to id-less notes
    if (
      typeof note.meta.id !== "number"
      || existingNoteIds.includes(note.meta.id)
    ) {
      note.meta.id = getNewNoteId(graph);
    }
    existingNoteIds.push(note.meta.id);

    note.meta.title = normalizeNoteTitle(note.meta.title);
  });

  // remove invalid note ids from pins
  graph.pinnedNotes = graph.pinnedNotes.filter((pinnedNoteId) => {
    return existingNoteIds.includes(pinnedNoteId);
  });
};



// this function must be indempotent, since there is only one
// ideal cleaned-up state
const cleanUpGraph = (graph) => {
  cleanUpLinks(graph);
  cleanUpNotes(graph);
};

export default cleanUpGraph;
