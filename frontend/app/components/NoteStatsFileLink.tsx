import React from "react";
import { Link } from "react-router-dom";
import {
  FileInfo,
} from "../../../lib/notes/interfaces/FileInfo";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";

interface NoteStatsFileLinkProps {
  file: FileInfo,
}

const NoteStatsFileLink = ({
  file,
}: NoteStatsFileLinkProps) => {
  return <Link
    key={"note-stats-link-" + file.fileId}
    to={getAppPath(PathTemplate.FILE, new Map([["FILE_ID", file.fileId]]))}
  >
    {file.name ?? file.fileId}
  </Link>;
};

export default NoteStatsFileLink;
