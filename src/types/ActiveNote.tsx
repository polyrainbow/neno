import { FileInfo } from "../lib/notes/types/FileInfo";
import NotePreview from "../lib/notes/types/NotePreview";
import { Slug } from "../lib/notes/types/Slug";
import SparseNoteInfo from "../lib/notes/types/SparseNoteInfo";

interface BaseActiveNote {
  initialContent: string,
  files: Set<FileInfo>,
  flags: string[],
}

export interface UnsavedActiveNote extends BaseActiveNote {
  isUnsaved: true,
}

export interface SavedActiveNote extends BaseActiveNote {
  slug: Slug,
  aliases: Set<Slug>,
  isUnsaved: false,
  createdAt?: string,
  updatedAt?: string,
  numberOfCharacters: number,
  numberOfBlocks: number,
  outgoingLinks: NotePreview[],
  /*
    Availability of every slug referenced in the note's content, keyed
    by the slug as it appears in the content (before alias resolution).
    See NoteToTransmit.unresolvedOutgoingLinkAvailability. Used for
    synchronous link-availability lookups in the editor.
  */
  unresolvedOutgoingLinkAvailability: Map<Slug, boolean>,
  backlinks: SparseNoteInfo[],
  additionalHeaders: [string, string][],
}

type ActiveNote = UnsavedActiveNote | SavedActiveNote;

export default ActiveNote;
