import React, { useEffect, useState } from "react";
import {
  Link,
} from "react-router-dom";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { MediaType } from "../../../lib/notes/interfaces/MediaType";
import { PathTemplate } from "../enum/PathTemplate";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { l } from "../lib/intl";
import { getAppPath, getMediaTypeFromFilename, getIconSrc } from "../lib/utils";

interface FilesViewPreviewBoxProps{
  key: string,
  file: FileInfo,
  databaseProvider: DatabaseProvider,
  isDangling: boolean,
}

const FilesViewPreviewBox = ({
  file,
  databaseProvider,
  isDangling,
}: FilesViewPreviewBoxProps) => {
  const type = getMediaTypeFromFilename(file.fileId) || "unknown";
  const [thumbnailImageSrc, setThumbnailImageSrc]
    = useState<string | null>(null);


  useEffect(() => {
    databaseProvider.getUrlForFileId(file.fileId)
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
      to={getAppPath(PathTemplate.FILE, new Map([["FILE_ID", file.fileId]]))}
      style={{
        textDecoration: "none",
      }}
    >
      <img
        src={thumbnailImageSrc || ""}
        loading="lazy"
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
