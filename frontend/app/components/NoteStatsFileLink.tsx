import React from "react";
import { Link } from "react-router-dom";
import {
  FileInfo,
} from "../../../lib/notes/interfaces/FileInfo";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";

interface NoteStatsFileLinkProps {
  file: FileInfo,
  graphId: GraphId,
}

const NoteStatsFileLink = ({
  file,
  graphId,
}: NoteStatsFileLinkProps) => {
  return <Link
    key={"note-stats-link-" + file.fileId}
    to={getAppPath(PathTemplate.FILE, new Map([
      ["GRAPH_ID", graphId],
      ["FILE_ID", file.fileId],
    ]))}
  >
    {file.name ?? file.fileId}
  </Link>;
};

export default NoteStatsFileLink;
