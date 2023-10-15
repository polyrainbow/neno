import { Slug } from "./Slug";

export interface FileInfo {
  slug: Slug,
  size: number,
  readonly createdAt: number,
}
