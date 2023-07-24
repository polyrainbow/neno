import { useState } from "react";
import NoteToTransmit from "../lib/notes/interfaces/NoteToTransmit";
import { Slug } from "../lib/notes/interfaces/Slug";
import NotesProvider from "../lib/notes";

export default (
  databaseProvider: NotesProvider,
) => {
  const [pinnedNotes, setPinnedNotes] = useState<NoteToTransmit[] | null>(null);

  const pinOrUnpinNote = async (
    slug: Slug,
  ) => {
    let newPinnedNotes: NoteToTransmit[];
    if (!pinnedNotes) {
      throw new Error("Pinned notes have not been initialized yet.");
    }

    if (pinnedNotes.find((pinnedNote) => pinnedNote.meta.slug === slug)) {
      newPinnedNotes = await databaseProvider.unpin(slug);
    } else {
      newPinnedNotes = await databaseProvider.pin(slug);
    }

    setPinnedNotes(newPinnedNotes);
  };

  const refreshPinnedNotes = async () => {
    const pinnedNotes = await databaseProvider.getPins();
    setPinnedNotes(pinnedNotes);
  };

  return {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
  };
};
