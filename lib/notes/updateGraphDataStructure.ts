/*
  This module is to modify the data structure/the database schema from
  legacy schemas.
*/

import GraphObject from "./interfaces/Graph";

const updateNotes = (graph:GraphObject):void => {
  graph.notes.forEach((note) => {

    // add new note title field if not present
    if (
      typeof note.title !== "string"
    ) {
      if (note.blocks[0]?.type === "header") {
        note.title = note.blocks[0].data.text;
        note.blocks.shift();
      } else {
        note.title = "";
      }
    }
  });
};


// this function must be indempotent, so that it always results in one
// canonical data structure
const updateGraphDataStructure = (graph:GraphObject):void => {
  updateNotes(graph);
};


export default updateGraphDataStructure;
