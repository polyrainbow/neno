import { useEffect, useState } from "react";
import { FileInfo } from "../lib/notes/types/FileInfo";
import NotesProviderProxy from "../lib/notes-worker/NotesProviderProxy";
import { getObjectUrlForArbitraryGraphFile } from "../lib/LocalDataStorage";

interface NoteContentBlockImageProps {
  file: FileInfo,
  notesProvider: NotesProviderProxy,
}


const NoteContentBlockImage = ({
  file,
  notesProvider,
}: NoteContentBlockImageProps) => {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    getObjectUrlForArbitraryGraphFile(file)
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
