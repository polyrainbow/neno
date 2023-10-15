import { Slug } from "../lib/notes/types/Slug";

export default interface CreateNewNoteParams {
  useForce?: boolean,
  slug?: Slug,
  content?: string,
}
