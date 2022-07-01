import LinkedNote from "../../../lib/notes/interfaces/LinkedNote";
import NodePosition from "../../../lib/notes/interfaces/NodePosition";
import NoteContentBlock from "../../../lib/notes/interfaces/NoteContentBlock";
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
  // blocks are only used for retrieving information out of them, this property
  // must not be linked/passed to the editor, as the editor maintains its own
  // state
  blocks: NoteContentBlock[],
}

type ActiveNote = UnsavedActiveNote | SavedActiveNote;

export default ActiveNote;
