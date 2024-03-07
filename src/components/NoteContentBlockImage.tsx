import { useEffect, useState } from "react";
import { FileInfo } from "../lib/notes/types/FileInfo";
import {
  getUrl,
} from "../lib/utils";
import NotesProvider from "../lib/notes";

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
    key={file.slug}
  >
    <img
      src={url}
      alt={file.slug}
    />
  </div>;
};


export default NoteContentBlockImage;
