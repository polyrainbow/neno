import { useEffect, useState } from "react";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { getUrl } from "../lib/utils";
import NotesProvider from "../lib/notes";
import NoteContentBlockActions from "./NoteContentBlockActions";

interface NoteContentBlockTextFileProps {
  file: FileInfo,
  notesProvider: NotesProvider,
}


const NoteContentBlockTextFile = ({
  file,
  notesProvider,
}: NoteContentBlockTextFileProps) => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    getUrl(file)
      .then((url) => {
        return fetch(url);
      })
      .then((response) => response.text())
      .then((text) => setText(text));
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
        {/* for text files, we don't show file size because it's not that
        relevant and only takes space */}
      </div>
      <NoteContentBlockActions file={file} />
    </div>
    <div className="preview-block-audio-second-line">
      <pre
        key={Math.random()}
        className="preview-block-file-text"
      >
        {text}
      </pre>
    </div>
  </div>;
};


export default NoteContentBlockTextFile;
