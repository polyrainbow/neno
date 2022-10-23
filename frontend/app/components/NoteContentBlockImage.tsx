import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import { PathTemplate } from "../enum/PathTemplate";
import DatabaseProvider from "../types/DatabaseProvider";
import {
  getAppPath,
  getUrl,
} from "../lib/utils";

interface NoteContentBlockImageProps {
  file: FileInfo,
  databaseProvider: DatabaseProvider,
  description: string,
  graphId: GraphId,
}


const NoteContentBlockImage = ({
  file,
  description,
  databaseProvider,
  graphId,
}: NoteContentBlockImageProps) => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    getUrl(graphId, file, databaseProvider)
      .then((url) => {
        setUrl(url);
      });
  }, [file, databaseProvider]);


  return <div
    className="preview-block-image-wrapper"
    key={file.fileId}
  >
    <figure>
      <Link
        to={getAppPath(PathTemplate.FILE, new Map([
          ["GRAPH_ID", graphId],
          ["FILE_ID", file.fileId],
        ]))}
      >
        <img
          src={url}
          alt={description}
        />
      </Link>
      <figcaption>{description}</figcaption>
    </figure>
  </div>;
};


export default NoteContentBlockImage;
