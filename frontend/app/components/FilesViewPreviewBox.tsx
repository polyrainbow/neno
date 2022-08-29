import React from "react";
import {
  Link,
} from "react-router-dom";
import { MediaType } from "../../../lib/notes/interfaces/MediaType";
import { PathTemplate } from "../enum/PathTemplate";
import FileIdAndSrc from "../interfaces/FileInfoAndSrc";
import { getAppPath, getMediaTypeFromFilename, getIconSrc } from "../lib/utils";

interface FilesViewPreviewBoxProps{
  key: string,
  file: FileIdAndSrc,
}

const FilesViewPreviewBox = ({
  file,
}: FilesViewPreviewBoxProps) => {
  const type = getMediaTypeFromFilename(file.fileId) || "unknown";

  const imageSrcMap = {
    [MediaType.IMAGE]: file.src,
    [MediaType.AUDIO]: getIconSrc("audiotrack"),
    [MediaType.VIDEO]: getIconSrc("videocam"),
    [MediaType.PDF]: getIconSrc("description"),
  };

  const imageSrc = imageSrcMap[type];

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
      src={imageSrc}
      loading="lazy"
    />
  </Link>;
};

export default FilesViewPreviewBox;
