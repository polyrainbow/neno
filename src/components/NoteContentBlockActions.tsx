import { Link } from "react-router-dom";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath } from "../lib/utils";
import FlexContainer from "./FlexContainer";
import Icon from "./Icon";
import { LOCAL_GRAPH_ID } from "../config";
import { saveFile } from "../lib/LocalDataStorage";

interface NoteContentBlockActionsProps {
  file: FileInfo,
}


const NoteContentBlockActions = ({
  file,
}: NoteContentBlockActionsProps) => {
  return <FlexContainer className="preview-block-file-actions">
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
      onClick={(e) => {
        saveFile(file.slug);
        e.stopPropagation();
      }}
    >
      <Icon
        icon="file_download"
        title={l("note.download-file")}
        size={24}
      />
    </a>
  </FlexContainer>;
};


export default NoteContentBlockActions;
