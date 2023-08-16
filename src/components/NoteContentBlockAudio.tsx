import { useEffect, useState } from "react";
import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import { getUrl, humanFileSize } from "../lib/utils";
import NotesProvider from "../lib/notes";
import NoteContentBlockActions from "./NoteContentBlockActions";

interface NoteContentBlockAudioProps {
  file: FileInfo,
  notesProvider: NotesProvider,
}


const NoteContentBlockAudio = ({
  file,
  notesProvider,
}: NoteContentBlockAudioProps) => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    getUrl(file)
      .then((url) => {
        setUrl(url);
      });
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
    <div className="preview-block-audio-second-line">
      <audio
        controls
        src={url}
      ></audio>
    </div>
  </div>;
};


export default NoteContentBlockAudio;
