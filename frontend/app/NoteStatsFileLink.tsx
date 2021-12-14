import React from "react";

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
      const url = await databaseProvider.getUrlForFileId(
        fileInfo.fileId,
        fileInfo.name,
      );
      window.open(url, "_blank");
    }}
  >
    {fileInfo.name ?? fileInfo.fileId}
  </a>;
};

export default NoteStatsFileLink;
