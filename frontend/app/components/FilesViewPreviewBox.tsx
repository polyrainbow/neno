import React, { useEffect, useState } from "react";
import {
  Link,
} from "react-router-dom";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { MediaType } from "../../../lib/notes/interfaces/MediaType";
import { PathTemplate } from "../enum/PathTemplate";
import DatabaseProvider from "../types/DatabaseProvider";
import { l } from "../lib/intl";
import { getAppPath, getMediaTypeFromFilename, getIconSrc } from "../lib/utils";

interface FilesViewPreviewBoxProps{
  key: string,
  file: FileInfo,
  databaseProvider: DatabaseProvider,
  graphId: GraphId,
  isDangling: boolean,
}

const FilesViewPreviewBox = ({
  file,
  databaseProvider,
  isDangling,
  graphId,
}: FilesViewPreviewBoxProps) => {
  const type = getMediaTypeFromFilename(file.fileId) || "unknown";
  const [thumbnailImageSrc, setThumbnailImageSrc]
    = useState<string | null>(null);


  useEffect(() => {
    databaseProvider.getUrlForFileId(graphId, file.fileId)
      .then((src) => {
        const thumbnailImageSrcMap = {
          [MediaType.IMAGE]: src,
          [MediaType.AUDIO]: getIconSrc("audio_file"),
          [MediaType.VIDEO]: getIconSrc("video_file"),
          [MediaType.PDF]: getIconSrc("description"),
          [MediaType.TEXT]: getIconSrc("description"),
          [MediaType.OTHER]: getIconSrc("draft"),
        };

        setThumbnailImageSrc(thumbnailImageSrcMap[type]);
      });
  }, []);


  return <div
    className="files-view-preview-box"
  >
    <Link
      to={getAppPath(PathTemplate.FILE, new Map([
        ["GRAPH_ID", graphId],
        ["FILE_ID", file.fileId],
      ]))}
    >
      <img
        src={thumbnailImageSrc || ""}
        loading="lazy"
        className={type === MediaType.IMAGE ? "checkerboard-background" : ""}
      />
      <div
        className="file-info"
      >
        <div
          className="filename"
        >{file.name}</div>
        {
          isDangling
            ? <div
              title={l("files.dangling")}
              className="dangling-indicator"
            />
            : ""
        }
      </div>
    </Link>
  </div>;
};

export default FilesViewPreviewBox;
