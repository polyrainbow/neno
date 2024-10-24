import { FileInfo } from "../lib/notes/types/FileInfo";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath } from "../lib/utils";
import FlexContainer from "./FlexContainer";
import Icon from "./Icon";
import { LOCAL_GRAPH_ID, NENO_SCRIPT_FILE_SUFFIX } from "../config";
import { saveFile } from "../lib/LocalDataStorage";

interface NoteContentBlockActionsProps {
  file: FileInfo,
}


const NoteContentBlockActions = ({
  file,
}: NoteContentBlockActionsProps) => {
  const isNenoScript = file.slug.endsWith(NENO_SCRIPT_FILE_SUFFIX);
  return <FlexContainer className="preview-block-file-actions">
    {
      isNenoScript
        ? <a href={
          getAppPath(PathTemplate.SCRIPT, new Map([
            ["GRAPH_ID", LOCAL_GRAPH_ID],
            ["SCRIPT_SLUG", file.slug],
          ]))
        }>
          <Icon
            icon="play_arrow"
            title="Open in script editor"
            size={24}
          />
        </a>
        : ""
    }
    <a href={
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
    </a>
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
