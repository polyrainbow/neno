import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath, getUrl, humanFileSize, onDownload } from "../lib/utils";
import FlexContainer from "./FlexContainer";
import Icon from "./Icon";
import NotesProvider from "../lib/notes";
import { LOCAL_GRAPH_ID } from "../config";

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
      <FlexContainer>
        <Link to={
          getAppPath(
            PathTemplate.FILE,
            new Map([
              ["GRAPH_ID", LOCAL_GRAPH_ID],
              ["FILE_SLUG", file.slug],
            ]),
          )
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
      <audio
        controls
        src={url}
      ></audio>
    </div>
  </div>;
};


export default NoteContentBlockAudio;
