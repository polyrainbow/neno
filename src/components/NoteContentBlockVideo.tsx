import { useEffect, useState } from "react";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { humanFileSize } from "../lib/utils";
import NotesProviderProxy from "../lib/notes-worker/NotesProviderProxy";
import NoteContentBlockActions from "./NoteContentBlockActions";
import { getObjectUrlForArbitraryGraphFile } from "../lib/LocalDataStorage";

interface NoteContentBlockVideoProps {
  file: FileInfo,
  notesProvider: NotesProviderProxy,
}


const NoteContentBlockVideo = ({
  file,
  notesProvider,
}: NoteContentBlockVideoProps) => {
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
    className="preview-block-file-wrapper"
    key={file.slug}
  >
    <div className="preview-block-file-first-line">
      <div className="preview-block-file-info">
        <div className="preview-block-file-info-title">
          {file.slug}
        </div>
        <div className="preview-block-file-size">
          {humanFileSize(file.size)}
        </div>
      </div>
      <NoteContentBlockActions file={file} />
    </div>
    <div className="preview-block-video-second-line">
      <video
        controls
        src={url}
      ></video>
    </div>
  </div>;
};


export default NoteContentBlockVideo;
