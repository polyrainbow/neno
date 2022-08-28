import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { PathTemplate } from "../enum/PathTemplate";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { l } from "../lib/intl";
import { getAppPath, getUrl, humanFileSize, onDownload } from "../lib/utils";
import Icon from "./Icon";

interface NoteContentBlockAudioProps {
  file: FileInfo,
  databaseProvider: DatabaseProvider,
}


const NoteContentBlockAudio = ({
  file,
  databaseProvider,
}: NoteContentBlockAudioProps) => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    getUrl(file, databaseProvider)
      .then((url) => {
        setUrl(url);
      });
  });

  return <div
    className="preview-block-file-wrapper"
    key={file.fileId}
  >
    <div className="preview-block-file-first-line">
      <div className="preview-block-file-info">
        <div className="preview-block-file-info-title">
          {file.name}
        </div>
        <div className="preview-block-file-size">
          {humanFileSize(file.size)}
        </div>
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
      <audio
        controls
        src={url}
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      ></audio>
    </div>
  </div>;
};


export default NoteContentBlockAudio;
