import ExistingNote from "./ExistingNote.js";
import NodePosition from "./NodePosition.js";
import ScreenPosition from "./ScreenPosition.js";
import { FileInfo } from "./FileInfo.js";
import { Block } from "../../subwaytext/interfaces/Block.js";
import { Slug } from "./Slug.js";

export interface GraphMetadata {
  readonly createdAt: number,
  updatedAt: number,
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
  pinnedNotes: Slug[],
  files: FileInfo[],
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

