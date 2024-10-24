import {
  FileInfo,
} from "../lib/notes/types/FileInfo";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { LOCAL_GRAPH_ID } from "../config";

interface NoteStatsFileLinkProps {
  file: FileInfo,
}

const NoteStatsFileLink = ({
  file,
}: NoteStatsFileLinkProps) => {
  return <a
    key={"note-stats-link-" + file.slug}
    href={getAppPath(PathTemplate.FILE, new Map([
      ["GRAPH_ID", LOCAL_GRAPH_ID],
      ["FILE_SLUG", file.slug],
    ]))}
  >
    {file.slug}
  </a>;
};

export default NoteStatsFileLink;
