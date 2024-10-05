import { Slug } from "./Slug";

export interface FileInfo {
  slug: Slug,
  filename: string,
  size: number,
  createdAt?: string,
  updatedAt?: string,
}
