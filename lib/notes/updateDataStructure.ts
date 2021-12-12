/*
  This module is to modify the data structure/the database schema from
  legacy schemas.
*/

const updateNotes = (db) => {
  db.notes.forEach((note) => {
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
}


const updateDatabase = (db) => {
  updateNotes(db);
}


// this function must be indempotent, so that there is only one
// canonical data structure
const updateDataStructure = async (io) => {
  await io.forEach(updateDatabase);
};

export default updateDataStructure;
