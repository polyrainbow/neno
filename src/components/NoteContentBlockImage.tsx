import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import { PathTemplate } from "../enum/PathTemplate";
import {
  getAppPath,
  getUrl,
} from "../lib/utils";
import NotesProvider from "../lib/notes";
import { LOCAL_GRAPH_ID } from "../config";

interface NoteContentBlockImageProps {
  file: FileInfo,
  notesProvider: NotesProvider,
}


const NoteContentBlockImage = ({
  file,
  notesProvider,
}: NoteContentBlockImageProps) => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    getUrl(file)
      .then((url) => {
        setUrl(url);
      });
  }, [file, notesProvider]);


  return <div
    className="preview-block-image-wrapper"
    key={file.fileId}
  >
    <figure>
      <Link
        to={getAppPath(PathTemplate.FILE, new Map([
          ["GRAPH_ID", LOCAL_GRAPH_ID],
          ["FILE_ID", file.fileId],
        ]))}
      >
        <img
          src={url}
          alt={file.name}
        />
      </Link>
    </figure>
  </div>;
};


export default NoteContentBlockImage;
