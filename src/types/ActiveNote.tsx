import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import NodePosition from "../lib/notes/interfaces/NodePosition";
import NotePreview from "../lib/notes/interfaces/NotePreview";
import { Slug } from "../lib/notes/interfaces/Slug";
import SparseNoteInfo from "../lib/notes/interfaces/SparseNoteInfo";

interface BaseActiveNote {
  content: string,
  initialContent: string,
  files: FileInfo[],
  keyValues: [string, string][],
  flags: string[],
  contentType: string,
}

export interface UnsavedActiveNote extends BaseActiveNote {
  isUnsaved: true,
}

export interface SavedActiveNote extends BaseActiveNote {
  slug: Slug,
  isUnsaved: false,
  createdAt?: number,
  updatedAt?: number,
  position: NodePosition,
  numberOfCharacters: number,
  outgoingLinks: NotePreview[],
  backlinks: SparseNoteInfo[],
}

type ActiveNote = UnsavedActiveNote | SavedActiveNote;

export default ActiveNote;
