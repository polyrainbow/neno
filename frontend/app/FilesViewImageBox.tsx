import React from "react";
import {
  Link,
} from "react-router-dom";
import { paths } from "./lib/config";


const FilesViewImageBox = ({
  imageFile,
}) => {
  return <Link
    to={paths.files + "/" + imageFile.id}
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
