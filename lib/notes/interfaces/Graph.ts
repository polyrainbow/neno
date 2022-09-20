import ExistingNote from "./ExistingNote.js";
import { Link } from "./Link.js";
import NodePosition from "./NodePosition.js";
import { NoteId } from "./NoteId.js";
import ScreenPosition from "./ScreenPosition.js";
import { FileInfo } from "./FileInfo.js";
import UnbalancedBinaryTree from "../../UnbalancedBinaryTree.js";
import { Block } from "../../subwaytext/interfaces/Block.js";

interface BaseGraphObject {
  readonly createdAt: number,
  updatedAt: number,
  links: Link[],
  idCounter: number,
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
  pinnedNotes: NoteId[],
  files: FileInfo[],
}

export default interface GraphObject extends BaseGraphObject {
  notes: ExistingNote[],
  blockIndex: UnbalancedBinaryTree<Block[]>,
}

export interface SerializedGraphObject extends BaseGraphObject {
  notes: string[],
}