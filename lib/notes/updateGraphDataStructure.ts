
/*
  This module is to modify the data structure/the database schema from
  legacy schemas. As those do not match our types, it does not really make
  sense to type-check this file.
*/

// this function must be indempotent, so that it always results in one
// canonical data structure
const updateGraphDataStructure = async (graph: any) => {
  graph.notes = graph.notes.map((note) => {
    if (typeof note === "string") return note;

    let string
      = ":-neno-id:" + note.id.toString()
      + "\n"
      + ":title:" + note.title
      + "\n"
      + ":created-at:" + note.creationTime.toString()
      + "\n"
      + ":updated-at:" + note.updateTime.toString()
      + "\n"
      + ":-neno-default-graph-position:" + note.position.x.toString()
      + "," + note.position.y.toString();

    string += "\n\n" + note.content;

    return string;
  });
};


export default updateGraphDataStructure;
