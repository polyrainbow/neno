import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { PathTemplate } from "../enum/PathTemplate";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { l } from "../lib/intl";
import { getAppPath, getUrl, onDownload } from "../lib/utils";
import Icon from "./Icon";

interface NoteContentBlockTextFileProps {
  file: FileInfo,
  databaseProvider: DatabaseProvider,
}


const NoteContentBlockTextFile = ({
  file,
  databaseProvider,
}: NoteContentBlockTextFileProps) => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    getUrl(file, databaseProvider)
      .then((url) => {
        return fetch(url);
      })
      .then((response) => response.text())
      .then((text) => setText(text));
  }, [file, databaseProvider]);

  return <div
    className="preview-block-file-wrapper"
    key={file.fileId}
  >
    <div className="preview-block-file-first-line">
      <div className="preview-block-file-info">
        <div className="preview-block-file-info-title">
          {file.name}
        </div>
        {/* for text files, we don't show file size because it's not that
        relevant and only takes space */}
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <Link to={
          getAppPath(PathTemplate.FILE, new Map([["FILE_ID", file.fileId]]))
        }>
          <Icon
            icon="info"
            title="File details"
            size={24}
          />
        </Link>
        <a
          className="preview-block-file-download-button"
          onClick={() => onDownload(file, databaseProvider)}
        >
          <Icon
            icon="file_download"
            title={l("note.download-file")}
            size={24}
          />
        </a>
      </div>
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
