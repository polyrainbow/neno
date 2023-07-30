import { DEFAULT_CONTENT_TYPE } from "../../config.js";
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
      // @ts-ignore
      = formatHeader(CanonicalNoteHeader.ID, note.id.toString())
      + formatHeader(
        CanonicalNoteHeader.CREATED_AT,
        note.creationTime.toString())
      + formatHeader(CanonicalNoteHeader.UPDATED_AT, note.updateTime.toString())
      + formatHeader(
        CanonicalNoteHeader.GRAPH_POSITION,
        note.position.x.toString() + "," + note.position.y.toString(),
      )
      + formatHeader(
        CanonicalNoteHeader.CONTENT_TYPE,
        DEFAULT_CONTENT_TYPE,
      )
      + formatHeader(
        CanonicalNoteHeader.FLAGS,
        "MIGRATED_FROM_V3",
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
