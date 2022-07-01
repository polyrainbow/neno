import { FileId } from "../../../lib/notes/interfaces/FileId";
import {
  NoteContentBlockType,
} from "../../../lib/notes/interfaces/NoteContentBlock";

interface NoteStatsFileInfo {
  id: FileId,
  type: NoteContentBlockType,
  name: string,
}

export default NoteStatsFileInfo;
