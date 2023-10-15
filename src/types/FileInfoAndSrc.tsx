import { FileInfo } from "../lib/notes/types/FileInfo";

interface FileInfoAndSrc extends FileInfo{
  src: string,
}

export default FileInfoAndSrc;
