import ActiveNote from "../types/ActiveNote";
import { getWritableStream } from "./utils";
import { serializeNewNote } from "../lib/notes/noteUtils";
import { l } from "./intl";
import NotesProvider from "./notes";
import {
  NOTE_FILE_DESCRIPTION,
  NOTE_FILE_EXTENSION,
  NOTE_MIME_TYPE,
} from "../config";

export const exportNote = async (
  activeNote: ActiveNote,
  notesProvider: NotesProvider,
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
    const rawNoteFromDB = await notesProvider.getRawNote(
      activeNote.slug,
    );
    if (!rawNoteFromDB) throw new Error("Raw export failed");
    rawNote = rawNoteFromDB;
  }

  const opts = {
    suggestedName: (
      "slug" in activeNote ? activeNote.slug : l("list.untitled-note")
    ) + NOTE_FILE_EXTENSION,
    types: [{
      description: NOTE_FILE_DESCRIPTION,
      accept: { [NOTE_MIME_TYPE]: [NOTE_FILE_EXTENSION] },
    }],
  };

  const writableStream = await getWritableStream(opts);
  const writer = writableStream.getWriter();
  await writer.write(rawNote);
  writer.close();
};
