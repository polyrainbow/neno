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
        ? <a
          href={
            getAppPath(PathTemplate.SCRIPT, new Map([
              ["GRAPH_ID", LOCAL_GRAPH_ID],
              ["SCRIPT_SLUG", file.slug],
            ]))
          }
          aria-label={l("files.open-in-script-editor")}
        >
          <Icon
            icon="play_arrow"
          />
        </a>
        : ""
    }
    <a
      href={
        getAppPath(PathTemplate.FILE, new Map([
          ["GRAPH_ID", LOCAL_GRAPH_ID],
          ["FILE_SLUG", file.slug],
        ]))
      }
      aria-label="File details"
    >
      <Icon
        icon="info"
      />
    </a>
    <a
      className="preview-block-file-download-button"
      onClick={(e) => {
        saveFile(file.slug);
        e.stopPropagation();
      }}
      aria-label={l("note.download-file")}
    >
      <Icon
        icon="file_download"
      />
    </a>
  </FlexContainer>;
};


export default NoteContentBlockActions;
