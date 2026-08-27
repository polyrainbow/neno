import { useEffect, useState } from "react";
import { FileInfo } from "../lib/notes/types/FileInfo";
import NotesProviderProxy from "../lib/notes-worker/NotesProviderProxy";
import NoteContentBlockActions from "./NoteContentBlockActions";
import { getObjectUrlForArbitraryGraphFile } from "../lib/LocalDataStorage";
import { isMarkdownFilename } from "../lib/notes/utils";
import MarkdownPreview from "./MarkdownPreview";

interface NoteContentBlockTextFileProps {
  file: FileInfo,
  notesProvider: NotesProviderProxy,
}


const NoteContentBlockTextFile = ({
  file,
  notesProvider,
}: NoteContentBlockTextFileProps) => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    getObjectUrlForArbitraryGraphFile(file)
      .then(async (url) => {
        try {
          const response = await fetch(url);
          return await response.text();
        } finally {
          // Nothing else references the blob once it has been read.
          URL.revokeObjectURL(url);
        }
      })
      .then((text) => {
        if (!cancelled) setText(text);
      });

    return () => {
      cancelled = true;
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
        {/* for text files, we don't show file size because it's not that
        relevant and only takes space */}
      </div>
      <NoteContentBlockActions file={file} />
    </div>
    <div className="preview-block-audio-second-line">
      {
        isMarkdownFilename(file.filename)
          ? <MarkdownPreview
            markdown={text}
            className="preview-block-file-markdown"
          />
          : <pre
            key={Math.random()}
            className="preview-block-file-text"
          >
            {text}
          </pre>
      }
    </div>
  </div>;
};


export default NoteContentBlockTextFile;
