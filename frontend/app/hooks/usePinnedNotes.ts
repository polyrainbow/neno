import { useState } from "react";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import DatabaseProvider from "../types/DatabaseProvider";

export default (
  databaseProvider: DatabaseProvider,
  graphId: GraphId,
) => {
  const [pinnedNotes, setPinnedNotes] = useState<NoteToTransmit[] | null>(null);

  const pinOrUnpinNote = async (
    noteId: NoteId,
  ) => {
    let newPinnedNotes: NoteToTransmit[];
    if (!pinnedNotes) {
      throw new Error("Pinned notes have not been initialized yet.");
    }

    if (pinnedNotes.find((pinnedNote) => pinnedNote.meta.id === noteId)) {
      newPinnedNotes = await databaseProvider.unpinNote(graphId, noteId);
    } else {
      newPinnedNotes = await databaseProvider.pinNote(graphId, noteId);
    }

    setPinnedNotes(newPinnedNotes);
  };

  const refreshPinnedNotes = async () => {
    const pinnedNotes = await databaseProvider.getPins(graphId);
    setPinnedNotes(pinnedNotes);
  };

  return {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
  };
};
