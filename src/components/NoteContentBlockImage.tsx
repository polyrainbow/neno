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
    let objectUrl: string | null = null;
    let cancelled = false;

    getObjectUrlForArbitraryGraphFile(file)
      .then((url) => {
        objectUrl = url;
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        setUrl(url);
      });

    // The app process stays open for days; an unrevoked object URL keeps
    // the whole blob alive for that long.
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
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
