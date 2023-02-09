
/*
  This module is to modify the data structure/the database schema from
  legacy schemas. As those do not match our types, it does not really make
  sense to type-check this file.
*/

import { CanonicalNoteHeader } from "./interfaces/CanonicalNoteHeader.js";

const formatHeader = (key: string, value: string) => {
  return ":" + key + ":" + value + "\n";
};

// this function must be indempotent, so that it always results in one
// canonical data structure
const updateGraphDataStructure = async (graph: any) => {
  graph.notes = graph.notes.map((note: any) => {
    if (typeof note === "string") {
      return note;
    }

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
      )
      + formatHeader(
        CanonicalNoteHeader.CONTENT_TYPE,
        "text/subway"
      )
      + formatHeader(
        CanonicalNoteHeader.FLAGS,
        "MIGRATED_FROM_V3"
      );

    string += "\n" + note.content;
    return string;
  });

  graph.files.forEach((file: any) => {
    if (file.creationTime) {
      file.createdAt = file.creationTime;
      delete file.creationTime;
    }
  });
};


export default updateGraphDataStructure;
