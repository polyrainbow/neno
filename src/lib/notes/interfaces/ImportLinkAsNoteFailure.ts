import { NoteSaveRequest } from "./NoteSaveRequest";

export default interface ImportLinkAsNoteFailure {
  readonly note: NoteSaveRequest,
  readonly error: string,
}
