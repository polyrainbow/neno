import NoteFromUser from "./NoteFromUser.js";

export default interface ImportLinkAsNoteFailure {
  readonly note: NoteFromUser,
  readonly error: string,
}
