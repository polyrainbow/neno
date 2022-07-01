import LinkedNote from "../../../lib/notes/interfaces/LinkedNote";
import FrontendUserNoteChange from "./FrontendUserNoteChange";

interface ActiveNote {
  isUnsaved: boolean,
  changes: FrontendUserNoteChange[],
  linkedNotes: LinkedNote[],
  id: number,
  title: string,
}

export default ActiveNote;
