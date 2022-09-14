import React, { useEffect, useState } from "react";
import {
  Link,
} from "react-router-dom";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { MediaType } from "../../../lib/notes/interfaces/MediaType";
import { PathTemplate } from "../enum/PathTemplate";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { getAppPath, getMediaTypeFromFilename, getIconSrc } from "../lib/utils";

interface FilesViewPreviewBoxProps{
  key: string,
  file: FileInfo,
  databaseProvider: DatabaseProvider,
}

const FilesViewPreviewBox = ({
  file,
  databaseProvider,
}: FilesViewPreviewBoxProps) => {
  const type = getMediaTypeFromFilename(file.fileId) || "unknown";
  const [thumbnailImageSrc, setThumbnailImageSrc]
    = useState<string | null>(null);


  useEffect(() => {
    databaseProvider.getUrlForFileId(file.fileId)
      .then((src) => {
        const thumbnailImageSrcMap = {
          [MediaType.IMAGE]: src,
          [MediaType.AUDIO]: getIconSrc("audiotrack"),
          [MediaType.VIDEO]: getIconSrc("videocam"),
          [MediaType.PDF]: getIconSrc("description"),
          [MediaType.TEXT]: getIconSrc("text_snippet"),
        };

        setThumbnailImageSrc(thumbnailImageSrcMap[type]);
      });
  }, []);


  return <Link
    to={getAppPath(PathTemplate.FILE, new Map([["FILE_ID", file.fileId]]))}
    style={{
      lineHeight: "0",
    }}
  >
    <img
      style={{
        marginRight: "5px",
        marginBottom: "5px",
        width: "200px",
        height: "200px",
        objectFit: "cover",
        cursor: "pointer",
        background: "white",
      }}
      src={thumbnailImageSrc || ""}
      loading="lazy"
    />
  </Link>;
};

export default FilesViewPreviewBox;
