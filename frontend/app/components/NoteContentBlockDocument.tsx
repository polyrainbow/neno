import React from "react";
import { Link } from "react-router-dom";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { PathTemplate } from "../enum/PathTemplate";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { l } from "../lib/intl";
import {
  getAppPath,
  humanFileSize,
  onDownload,
} from "../lib/utils";
import FlexContainer from "./FlexContainer";
import Icon from "./Icon";

interface NoteContentBlockAudioProps {
  file: FileInfo,
  databaseProvider: DatabaseProvider,
}


const NoteContentBlockDocument = ({
  file,
  databaseProvider,
}: NoteContentBlockAudioProps) => {
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
      <FlexContainer>
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
      </FlexContainer>
    </div>
  </div>;
};


export default NoteContentBlockDocument;
