/*
  This module is to modify the data structure/the database schema from
  legacy schemas.
*/

import GraphObject from "./interfaces/Graph";
import NoteContentBlock from "./interfaces/NoteContentBlock";
import SavedNote from "./interfaces/SavedNote";

const updateBlock = (block:NoteContentBlock) => {
  // @ts-ignore
  delete block.id;

  // if the file object does not have valid data inside (file id), remove it,
  // so it is clear that this block is empty
  // @ts-ignore
  if (block.data.file && (!block.data.file.fileId)) {
    // @ts-ignore
    delete block.data.file;
  }
};


const updateNote = (note:SavedNote) => {
  note.blocks.forEach(updateBlock);
};


const updateNotes = (graph:GraphObject):void => {
  graph.notes.forEach(updateNote);
};


// this function must be indempotent, so that it always results in one
// canonical data structure
const updateGraphDataStructure = (graph:GraphObject):void => {
  updateNotes(graph);
};


export default updateGraphDataStructure;
