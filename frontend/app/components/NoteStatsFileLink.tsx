import React from "react";
import {
  NoteContentBlockFileMetadata,
} from "../../../lib/notes/interfaces/NoteContentBlock";
import DatabaseProvider from "../interfaces/DatabaseProvider";

interface NoteStatsFileLinkProps {
  fileMetadata: NoteContentBlockFileMetadata,
  databaseProvider: DatabaseProvider
}

const NoteStatsFileLink = ({
  fileMetadata,
  databaseProvider,
}: NoteStatsFileLinkProps) => {
  return <a
    key={"note-stats-link-" + fileMetadata.fileId}
    style={{
      "cursor": "pointer",
    }}
    onClick={async () => {
      const url = await databaseProvider.getUrlForFileId(
        fileMetadata.fileId,
        fileMetadata.name,
      );
      window.open(url, "_blank");
    }}
  >
    {fileMetadata.name ?? fileMetadata.fileId}
  </a>;
};

export default NoteStatsFileLink;
