import { FileId } from "./FileId";

export interface FileInfo {
  fileId: FileId,
  name: string,
  size: number,
  readonly createdAt: number,
}
