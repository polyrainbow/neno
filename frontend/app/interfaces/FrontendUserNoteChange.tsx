import UserNoteChange from "../../../lib/notes/interfaces/UserNoteChange";

interface FrontendUserNoteChangeNote {
  id: number,
  updateTime: number,
  title: string,
}

interface FrontendUserNoteChange extends UserNoteChange {
  note?: FrontendUserNoteChangeNote,
}

export default FrontendUserNoteChange;
