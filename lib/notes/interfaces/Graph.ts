import SavedNote from "./SavedNote.js";
import { Link } from "./Link.js";
import NodePosition from "./NodePosition.js";
import { NoteId } from "./NoteId.js";
import ScreenPosition from "./ScreenPosition.js";
import { FileInfo } from "./FileInfo.js";

export default interface GraphObject {
  readonly creationTime: number,
  updateTime: number,
  notes: SavedNote[],
  links: Link[],
  idCounter: number,
  screenPosition: ScreenPosition,
  initialNodePosition: NodePosition,
  pinnedNotes: NoteId[],
  files: FileInfo[],
}