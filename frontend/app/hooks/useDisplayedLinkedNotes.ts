import { useMemo } from "react";
import LinkedNote from "../../../lib/notes/interfaces/LinkedNote";
import {
  UserNoteChangeType,
} from "../../../lib/notes/interfaces/UserNoteChangeType";
import ActiveNote from "../interfaces/ActiveNote";
import {
  FrontendUserNoteAdditionChange,
  FrontendUserNoteChangeNote,
} from "../interfaces/FrontendUserNoteChange";

export default (
  activeNote: ActiveNote,
): (LinkedNote | FrontendUserNoteChangeNote)[] => {
  /*
    Below the active note, we want to display a list of all notes that are
    currently linked to the main note with two modifications:
    1. In addition we want to show links that the user just has
    created but not saved yet.
    2. And we want to hide those saved linked notes that the user just has
    deleted but not saved yet.

    All in all we show a list of the saved state with the updates the user has
    done but not saved yet.
  */
  const displayedLinkedNotes: (LinkedNote | FrontendUserNoteChangeNote)[]
    = useMemo(() => [
      ...(!activeNote.isUnsaved)
        ? activeNote.linkedNotes.filter((note) => {
          const isRemoved = activeNote.changes.some((change) => {
            return (
              change.type === UserNoteChangeType.LINKED_NOTE_DELETED
              && change.noteId === note.id
            );
          });
          return !isRemoved;
        })
        : [],
      ...activeNote.changes
        .filter((change): change is FrontendUserNoteAdditionChange => {
          return change.type === UserNoteChangeType.LINKED_NOTE_ADDED;
        })
        .map((change: FrontendUserNoteAdditionChange) => {
          return change.note;
        }),
    ], [activeNote]);

  return displayedLinkedNotes;
};
