import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { PathTemplate } from "../enum/PathTemplate";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import {
  getAppPath,
  getUrl,
} from "../lib/utils";

interface NoteContentBlockImageProps {
  file: FileInfo,
  databaseProvider: DatabaseProvider,
  description: string,
}


const NoteContentBlockImage = ({
  file,
  description,
  databaseProvider,
}: NoteContentBlockImageProps) => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    getUrl(file, databaseProvider)
      .then((url) => {
        setUrl(url);
      });
  }, [file, databaseProvider]);


  return <div
    className="preview-block-image-wrapper"
    key={file.fileId}
  >
    <figure
      style={{
        textAlign: "center",
        marginTop: "0",
      }}
    >
      <Link
        to={getAppPath(PathTemplate.FILE, new Map([["FILE_ID", file.fileId]]))}
      >
        <img
          src={url}
          alt={description}
          style={{
            background: "white",
          }}
        />
      </Link>
      <figcaption
        style={{
          fontStyle: "italic",
          marginTop: "5px",
          whiteSpace: "break-spaces",
        }}
      >{description}</figcaption>
    </figure>
  </div>;
};


export default NoteContentBlockImage;
