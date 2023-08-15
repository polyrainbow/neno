import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath, getUrl, onDownload } from "../lib/utils";
import FlexContainer from "./FlexContainer";
import Icon from "./Icon";
import NotesProvider from "../lib/notes";
import { LOCAL_GRAPH_ID } from "../config";

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
      <FlexContainer>
        <Link to={
          getAppPath(PathTemplate.FILE, new Map([
            ["GRAPH_ID", LOCAL_GRAPH_ID],
            ["FILE_SLUG", file.slug],
          ]))
        }>
          <Icon
            icon="info"
            title="File details"
            size={24}
          />
        </Link>
        <a
          className="preview-block-file-download-button"
          onClick={() => onDownload(file)}
        >
          <Icon
            icon="file_download"
            title={l("note.download-file")}
            size={24}
          />
        </a>
      </FlexContainer>
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
