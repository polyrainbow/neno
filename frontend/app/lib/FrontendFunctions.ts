import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import ActiveNote from "../types/ActiveNote";
import { getWritableStream } from "./utils";
import { serializeNewNote } from "../../../lib/notes/noteUtils";
import { l } from "./intl";
import DatabaseProvider from "../types/DatabaseProvider";

export const exportNote = async (
  activeNote: ActiveNote,
  graphId: GraphId,
  databaseProvider: DatabaseProvider,
): Promise<void> => {
  let rawNote: string;

  if (activeNote.isUnsaved) {
    const note = {
      meta: {
        title: activeNote.title,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        custom: Object.fromEntries(activeNote.keyValues),
        contentType: "text/subway",
        flags: ["EXPORT_FROM_DRAFT"],
      },
      content: activeNote.content,
    };

    rawNote = serializeNewNote(note);
  } else {
    const rawNoteFromDB = await databaseProvider.getRawNote(
      graphId,
      activeNote.id,
    );
    if (!rawNoteFromDB) throw new Error("Raw export from database failed");
    rawNote = rawNoteFromDB;
  }

  const opts = {
    suggestedName: (activeNote.title || l("list.untitled-note")) + ".neno",
    types: [{
      description: "NENO note",
      accept: { "application/neno-note": [".neno"] },
    }],
  };

  const writableStream = await getWritableStream(opts);
  const writer = writableStream.getWriter();
  await writer.write(rawNote);
  writer.close();
};
