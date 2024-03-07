import { useState } from "react";
import NoteToTransmit from "../lib/notes/types/NoteToTransmit";
import { Slug } from "../lib/notes/types/Slug";
import NotesProvider from "../lib/notes";

export default (
  notesProvider: NotesProvider,
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
      newPinnedNotes = await notesProvider.unpin(slug);
    } else {
      newPinnedNotes = await notesProvider.pin(slug);
    }

    setPinnedNotes(newPinnedNotes);
  };

  const move = async (slug: Slug, offset: number) => {
    const newPinnedNotes = await notesProvider.movePinPosition(slug, offset);
    setPinnedNotes(newPinnedNotes);
  };

  const refreshPinnedNotes = async () => {
    const pinnedNotes = await notesProvider.getPins();
    setPinnedNotes(pinnedNotes);
  };

  return {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
    move,
  };
};
