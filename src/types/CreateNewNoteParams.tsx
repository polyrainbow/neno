import { Slug } from "../lib/notes/types/Slug";

export default interface CreateNewNoteParams {
  slug?: Slug,
  content?: string,
}
