import ExistingNote from "./ExistingNote.js";
import { FileInfo } from "./FileInfo.js";
import { Block } from "../../subwaytext/interfaces/Block.js";
import { Slug } from "./Slug.js";

export interface GraphMetadata {
  readonly createdAt: number, // the time of creation of this metadata object
  updatedAt: number, // the time of the last change of this metadata object
  pinnedNotes: Slug[],
  files: FileInfo[],
  version: "4",
}

// We are extensively using Maps here because they must be implemented with
// sublinear access time, e. g. using a hash table.
export default interface GraphObject {
  metadata: GraphMetadata,
  notes: Map<Slug, ExistingNote>,
  indexes: {
    // maps slug to parsed blocks
    blocks: Map<Slug, Block[]>,
    // maps slug of a note A to an array of slugs of notes (B-n) that A links
    // to
    outgoingLinks: Map<Slug, Set<Slug>>,
    // maps slug of a note A to an array of slugs whose notes (B-n) link
    // to note A
    backlinks: Map<Slug, Set<Slug>>,
  }
}

