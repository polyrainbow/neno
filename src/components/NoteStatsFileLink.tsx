import { Link } from "react-router-dom";
import {
  FileInfo,
} from "../lib/notes/types/FileInfo";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { LOCAL_GRAPH_ID } from "../config";
import { getFilenameFromFileSlug } from "../lib/notes/noteUtils";

interface NoteStatsFileLinkProps {
  file: FileInfo,
}

const NoteStatsFileLink = ({
  file,
}: NoteStatsFileLinkProps) => {
  return <Link
    key={"note-stats-link-" + file.slug}
    to={getAppPath(PathTemplate.FILE, new Map([
      ["GRAPH_ID", LOCAL_GRAPH_ID],
      ["FILE_SLUG", file.slug],
    ]))}
  >
    {getFilenameFromFileSlug(file.slug)}
  </Link>;
};

export default NoteStatsFileLink;
