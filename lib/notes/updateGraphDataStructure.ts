
/*
  This module is to modify the data structure/the database schema from
  legacy schemas. As those do not match our types, it does not really make
  sense to type-check this file.
*/

import { CanonicalNoteHeader } from "./interfaces/CanonicalNoteHeader.js";

const formatHeader = (key, value: string) => {
  return ":" + key + ":" + value + "\n";
};

// this function must be indempotent, so that it always results in one
// canonical data structure
const updateGraphDataStructure = async (graph: any) => {
  graph.notes = graph.notes.map((note) => {
    if (typeof note === "string") return note;

    let string
      = formatHeader(CanonicalNoteHeader.ID, note.id.toString())
      + formatHeader(CanonicalNoteHeader.TITLE, note.title)
      + formatHeader(
        CanonicalNoteHeader.CREATED_AT,
        note.creationTime.toString())
      + formatHeader(CanonicalNoteHeader.UPDATED_AT, note.updateTime.toString())
      + formatHeader(
        CanonicalNoteHeader.GRAPH_POSITION,
        note.position.x.toString() + "," + note.position.y.toString()
      );

    string += "\n" + note.content;

    return string;
  });
};


export default updateGraphDataStructure;
