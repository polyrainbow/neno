const getNoteTitle = (note) => {
  return note.editorData && note.editorData.blocks[0].data.text;
};

export {
  getNoteTitle,
};
