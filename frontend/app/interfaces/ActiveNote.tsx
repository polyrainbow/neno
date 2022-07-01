import LinkedNote from "../../../lib/notes/interfaces/LinkedNote";
import NodePosition from "../../../lib/notes/interfaces/NodePosition";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import FrontendUserNoteChange from "./FrontendUserNoteChange";

export interface UnsavedActiveNote {
  isUnsaved: true,
  changes: FrontendUserNoteChange[],
  title: string,
}

export interface SavedActiveNote {
  isUnsaved: false,
  changes: FrontendUserNoteChange[],
  id: NoteId,
  title: string,
  creationTime: number,
  updateTime: number,
  linkedNotes: LinkedNote[],
  position: NodePosition,
  numberOfCharacters: number,
  numberOfBlocks: number,
}

type ActiveNote = UnsavedActiveNote | SavedActiveNote;

export default ActiveNote;
