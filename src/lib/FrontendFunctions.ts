import ActiveNote from "../types/ActiveNote";
import { getWritableStream } from "./utils";
import { serializeNewNote } from "../lib/notes/noteUtils";
import { l } from "./intl";
import NotesProvider from "./notes";

export const exportNote = async (
  activeNote: ActiveNote,
  databaseProvider: NotesProvider,
): Promise<void> => {
  let rawNote: string;

  if (activeNote.isUnsaved) {
    const note = {
      meta: {
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
      activeNote.slug,
    );
    if (!rawNoteFromDB) throw new Error("Raw export from database failed");
    rawNote = rawNoteFromDB;
  }

  // TODO: use correct file ending and MIME type
  const opts = {
    suggestedName: (
      "slug" in activeNote ? activeNote.slug : l("list.untitled-note")
    ) + ".neno",
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
