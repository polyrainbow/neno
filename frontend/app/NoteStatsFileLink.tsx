import React from "react";
import {
  getUrlForFileId,
} from "./lib/utils.js";

const NoteStatsFileLink = ({
  fileInfo,
  databaseProvider,
}) => {
  return <a
    key={"note-stats-link-" + fileInfo.fileId}
    style={{
      "cursor": "pointer",
    }}
    onClick={async () => {
      const url = await getUrlForFileId(
        fileInfo.fileId,
        databaseProvider,
        fileInfo.name,
      );
      window.open(url, "_blank");
    }}
  >
    {fileInfo.name ?? fileInfo.fileId}
  </a>;
};

export default NoteStatsFileLink;
