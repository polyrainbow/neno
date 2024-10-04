import ExistingNote from "./ExistingNote.js";
import { FileInfo } from "./FileInfo.js";
import { Block } from "../../subwaytext/types/Block.js";
import { Slug } from "./Slug.js";


// We are extensively using Maps here because they must be implemented with
// sublinear access time, e. g. using a hash table.
export default interface GraphObject {
  notes: Map<Slug, ExistingNote>,
  aliases: Map<Slug, Slug>,
  files: Map<Slug, FileInfo>,
  pinnedNotes: Slug[],
  /*
    In the indexes, we include only canonical slugs that are not aliases.
  */
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

