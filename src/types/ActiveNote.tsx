import { FileInfo } from "../lib/notes/types/FileInfo";
import NotePreview from "../lib/notes/types/NotePreview";
import { Slug } from "../lib/notes/types/Slug";
import SparseNoteInfo from "../lib/notes/types/SparseNoteInfo";

interface BaseActiveNote {
  initialContent: string,
  files: FileInfo[],
  keyValues: [string, string][],
  flags: string[],
}

export interface UnsavedActiveNote extends BaseActiveNote {
  isUnsaved: true,
}

export interface SavedActiveNote extends BaseActiveNote {
  slug: Slug,
  aliases: Set<Slug>,
  isUnsaved: false,
  createdAt?: number,
  updatedAt?: number,
  numberOfCharacters: number,
  numberOfBlocks: number,
  outgoingLinks: NotePreview[],
  backlinks: SparseNoteInfo[],
}

type ActiveNote = UnsavedActiveNote | SavedActiveNote;

export default ActiveNote;
