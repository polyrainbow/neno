import { FileInfo } from "../lib/notes/interfaces/FileInfo";

interface FileInfoAndSrc extends FileInfo{
  src: string,
}

export default FileInfoAndSrc;
