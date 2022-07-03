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

  // if extension property is there, delete it
  if (
    // @ts-ignore
    block.data.file
    // @ts-ignore
    && block.data.file.fileId
    // @ts-ignore
    && (block.data.file.extension)
  ) {
    // @ts-ignore
    delete block.data.file.extension;
  }

  if (
    (block.type === "image")
    && (typeof block.data.file === "object")
    && (!block.data.file.name)
  ) {
    block.data.file.name = block.data.file.fileId;
  }

  if (
    (block.type === "image")
    && (typeof block.data.file === "object")
    && (block.data.file.size === null)
  ) {
    block.data.file.size = -1;
  }

  if (
    (block.type === "image")
    && (typeof block.data.file === "object")
    && (!block.data.file.size)
  ) {
    block.data.file.size = -1;
  }

  if (
    (block.type === "link")
    && (block.data.meta)
    && (!block.data.meta.image)
  ) {
    block.data.meta.image = {
      url: null
    };
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
