import LinkedNote from "../../../lib/notes/interfaces/LinkedNote.js";
import NoteListItem from "../../../lib/notes/interfaces/NoteListItem.js";
import { FrontendUserNoteChangeNote } from "./FrontendUserNoteChange.js";

/*
  What we are displaying in a note list on the web app can either be
  * a linked note item received from the database provider when requesting a
  single note ( DatabaseProvider.get(nodeId).linkedNotes )
  * a NoteListItem received from the database provider via
  DatabaseProvider.getNotes()
  * a list item generated from a user change (link addition) in
  the frontend app
*/
export type MainNoteListItem = NoteListItem;
export type FrontendNoteListItem
  = LinkedNote
  | NoteListItem
  | FrontendUserNoteChangeNote;
