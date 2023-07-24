import { Slug } from "../lib/notes/interfaces/Slug";

export default interface CreateNewNoteParams {
  useForce?: boolean,
  slug?: Slug,
  content?: string,
}
