import React from "react";
import {
  FileInfo,
} from "../../../lib/notes/interfaces/FileInfo";
import DatabaseProvider from "../interfaces/DatabaseProvider";

interface NoteStatsFileLinkProps {
  file: FileInfo,
  databaseProvider: DatabaseProvider
}

const NoteStatsFileLink = ({
  file,
  databaseProvider,
}: NoteStatsFileLinkProps) => {
  return <a
    key={"note-stats-link-" + file.fileId}
    style={{
      "cursor": "pointer",
    }}
    onClick={async () => {
      const url = await databaseProvider.getUrlForFileId(
        file.fileId,
        file.name,
      );
      window.open(url, "_blank");
    }}
  >
    {file.name ?? file.fileId}
  </a>;
};

export default NoteStatsFileLink;
