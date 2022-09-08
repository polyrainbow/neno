import UserNoteChange from "../../../lib/notes/interfaces/UserNoteChange";
import {
  UserNoteChangeType,
} from "../../../lib/notes/interfaces/UserNoteChangeType";

export interface FrontendUserNoteChangeNote {
  readonly id: number,
  readonly updatedAt: number,
  readonly title: string,
}

export interface FrontendUserNoteAdditionChange extends UserNoteChange {
  type: UserNoteChangeType.LINKED_NOTE_ADDED
  note: FrontendUserNoteChangeNote,
}

export interface FrontendUserNoteDeletionChange extends UserNoteChange {
  type: UserNoteChangeType.LINKED_NOTE_DELETED
}

type FrontendUserNoteChange
  = FrontendUserNoteAdditionChange | FrontendUserNoteDeletionChange;

export default FrontendUserNoteChange;
