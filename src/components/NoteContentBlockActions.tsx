import { Link } from "react-router-dom";
import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath, onDownload } from "../lib/utils";
import FlexContainer from "./FlexContainer";
import Icon from "./Icon";
import { LOCAL_GRAPH_ID } from "../config";

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
        onDownload(file);
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
