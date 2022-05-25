import LinkedNote from "../../../lib/notes/interfaces/LinkedNote";
import NoteContentBlock from "../../../lib/notes/interfaces/NoteContentBlock";
import FrontendUserNoteChange from "./FrontendUserNoteChange";

interface ActiveNote {
  isUnsaved: boolean,
  changes: FrontendUserNoteChange[],
  linkedNotes: LinkedNote[],
  blocks: NoteContentBlock[],
  id: number,
  title: string,
}

export default ActiveNote;
