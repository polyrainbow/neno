import { useEffect, useState } from "react";
import {
  Link,
} from "react-router-dom";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { MediaType } from "../lib/notes/types/MediaType";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath, getIconSrc } from "../lib/utils";
import {
  getMediaTypeFromFilename,
} from "../lib/notes/utils";
import { getUrlForSlug } from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";

interface FilesViewPreviewBoxProps {
  key: string,
  file: FileInfo,
  isDangling: boolean,
}

const FilesViewPreviewBox = ({
  file,
  isDangling,
}: FilesViewPreviewBoxProps) => {
  const type = file.slug.endsWith(".neno.js")
    ? MediaType.NENO_SCRIPT
    : (getMediaTypeFromFilename(file.slug) || "unknown");
  const [thumbnailImageSrc, setThumbnailImageSrc]
    = useState<string | null>(null);


  useEffect(() => {
    getUrlForSlug(file.slug)
      .then((src) => {
        const thumbnailImageSrcMap = {
          [MediaType.IMAGE]: src,
          [MediaType.AUDIO]: getIconSrc("audio_file"),
          [MediaType.VIDEO]: getIconSrc("video_file"),
          [MediaType.PDF]: getIconSrc("description"),
          [MediaType.TEXT]: getIconSrc("description"),
          [MediaType.NENO_SCRIPT]: getIconSrc("neno"),
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
        ["GRAPH_ID", LOCAL_GRAPH_ID],
        ["FILE_SLUG", file.slug],
      ]))}
    >
      <img
        src={thumbnailImageSrc || ""}
        loading="lazy"
        className={
          type === MediaType.IMAGE
            ? "checkerboard-background preview-image"
            : ""
        }
      />
      <div
        className="file-info"
      >
        <div
          className="filename"
        >{file.slug}</div>
        {
          isDangling
            ? <div
              title={l("files.dangling")}
              className="dangling-file-indicator"
            />
            : ""
        }
      </div>
    </Link>
  </div>;
};

export default FilesViewPreviewBox;
