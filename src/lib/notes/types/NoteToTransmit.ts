import { FileInfo } from "./FileInfo.js";
import ExistingNote from "./ExistingNote.js";
import SparseNoteInfo from "./SparseNoteInfo.js";
import NotePreview from "./NotePreview.js";
import { Slug } from "./Slug.js";

export default interface NoteToTransmit extends ExistingNote {
  readonly backlinks: SparseNoteInfo[],
  readonly outgoingLinks: NotePreview[],
  /*
    Availability of every slug the note's content references, keyed by
    the slug as it appears in the content — i.e. *before* alias
    resolution. So if the note contains `[[Alias]]` and `Alias` is an
    alias for `original-slug`, the entry is keyed under `alias`, not
    `original-slug`. The value is `true` when the target exists in the
    graph (as a note, alias, or file) and `false` when the link is
    broken. Keys match what `sluggifyWikilinkText` produces at render
    time, which makes the map suitable for synchronous
    link-availability lookups in the editor. Covers both wikilink and
    slashlink targets.

    Compare with `outgoingLinks`, which is alias-resolved and contains
    only note-to-note links (no files), and with the underlying
    `graph.indexes.outgoingLinks`, which is unresolved but doesn't
    carry availability info.
  */
  readonly unresolvedOutgoingLinkAvailability: Map<Slug, boolean>,
  readonly files: Set<FileInfo>,
  readonly numberOfCharacters: number,
  readonly numberOfBlocks: number,
  readonly aliases: Set<string>,
  readonly keyValues: Map<string, string>,
}
