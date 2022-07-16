import React from "react";
import {
  Link,
} from "react-router-dom";
import { PathTemplate } from "../enum/PathTemplate";
import FileIdAndSrc from "../interfaces/FileIdAndSrc";
import { getAppPath, getFileTypeFromFilename, getIconSrc } from "../lib/utils";

interface FilesViewPreviewBoxProps{
  key: string,
  file: FileIdAndSrc,
}

const FilesViewPreviewBox = ({
  file,
}: FilesViewPreviewBoxProps) => {
  const type = getFileTypeFromFilename(file.id) || "unknown";

  const imageSrcMap = {
    "image": file.src,
    "audio": getIconSrc("audiotrack"),
    "video": getIconSrc("videocam"),
    "document": getIconSrc("description"),
  };

  const imageSrc = imageSrcMap[type];

  return <Link
    to={getAppPath(PathTemplate.FILE, new Map([["FILE_ID", file.id]]))}
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
