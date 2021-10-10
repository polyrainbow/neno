import NoteContentBlock from "../../../lib/notes/interfaces/NoteContentBlock";
import FrontendUserNoteChange from "./FrontendUserNoteChange";

interface ActiveNote {
    isUnsaved: boolean,
    changes: FrontendUserNoteChange[],
    linkedNotes: any[],
    blocks: NoteContentBlock[],
    id: number,
    title: string,
  };

export default ActiveNote;