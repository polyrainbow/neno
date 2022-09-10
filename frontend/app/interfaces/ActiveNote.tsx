import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import LinkedNote from "../../../lib/notes/interfaces/LinkedNote";
import NodePosition from "../../../lib/notes/interfaces/NodePosition";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import FrontendUserNoteChange from "./FrontendUserNoteChange";

interface BaseActiveNote {
  changes: FrontendUserNoteChange[],
  title: string,
  content: string,
  files: FileInfo[],
  keyValues: [string, string][],
}

export interface UnsavedActiveNote extends BaseActiveNote {
  isUnsaved: true,
}

export interface SavedActiveNote extends BaseActiveNote {
  isUnsaved: false,
  id: NoteId,
  createdAt: number,
  updatedAt: number,
  linkedNotes: LinkedNote[],
  position: NodePosition,
  numberOfCharacters: number,
}

type ActiveNote = UnsavedActiveNote | SavedActiveNote;

export default ActiveNote;
