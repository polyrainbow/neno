import React from "react";
import {
  Link,
} from "react-router-dom";
import { PathTemplate } from "../enum/PathTemplate";
import { getAppPath } from "../lib/utils";


const FilesViewImageBox = ({
  imageFile,
}) => {
  return <Link
    to={getAppPath(PathTemplate.FILE, new Map([["FILE_ID", imageFile.id]]))}
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
      }}
      src={imageFile.src}
      loading="lazy"
    />
  </Link>;
};

export default FilesViewImageBox;
