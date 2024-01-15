import { Slug } from "./Slug.js";

export default interface SparseNoteInfo {
  readonly slug: Slug,
  readonly aliases: Set<Slug>,
  readonly title: string,
  readonly createdAt?: number,
  readonly updatedAt?: number
}
