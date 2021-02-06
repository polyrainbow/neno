import React from "react";
import {
  getUrlForFileId,
} from "./lib/utils.js";

const NoteStatsFileLink = ({
  fileId,
  name,
  databaseProvider,
}) => {
  return <a
    key={"note-stats-link-" + fileId}
    style={{
      "cursor": "pointer",
    }}
    onClick={async () => {
      const url = await getUrlForFileId(
        fileId,
        databaseProvider,
      );
      window.open(url, "_blank");
    }}
  >
    {name ?? fileId}
  </a>;
};

export default NoteStatsFileLink;
