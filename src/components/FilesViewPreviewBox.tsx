import { useEffect, useState } from "react";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { MediaType } from "../lib/notes/types/MediaType";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import { getAppPath, getIconSrc } from "../lib/utils";
import {
  getMediaTypeFromFilename,
} from "../lib/notes/utils";
import { getObjectUrlForArbitraryGraphFile } from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID, NENO_SCRIPT_FILE_SUFFIX } from "../config";
import FloatingActionButton from "./FloatingActionButton";

interface FilesViewPreviewBoxProps {
  key: string,
  file: FileInfo,
  isDangling: boolean,
}

const FilesViewPreviewBox = ({
  file,
  isDangling,
}: FilesViewPreviewBoxProps) => {
  const type = getMediaTypeFromFilename(file.filename) || "unknown";
  const isNenoScript = file.slug.endsWith(NENO_SCRIPT_FILE_SUFFIX);
  const [thumbnailImageSrc, setThumbnailImageSrc]
    = useState<string | undefined>(undefined);


  useEffect(() => {
    getObjectUrlForArbitraryGraphFile(file)
      .then((src) => {
        if (isNenoScript) {
          setThumbnailImageSrc(getIconSrc("neno"));
          return;
        }

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


  return <a
    className="files-view-preview-box"
    href={getAppPath(PathTemplate.FILE, new Map([
      ["GRAPH_ID", LOCAL_GRAPH_ID],
      ["FILE_SLUG", file.slug],
    ]))}
  >
    <img
      src={thumbnailImageSrc}
      loading="lazy"
      className={
        type === MediaType.IMAGE
          ? "checkerboard-background preview-image"
          : "file-type-icon"
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
    {
      isNenoScript
        ? <FloatingActionButton
          title={l("files.open-in-script-editor")}
          icon="create"
          onClick={(e) => {
            // @ts-ignore
            navigation.navigate(getAppPath(
              PathTemplate.SCRIPT,
              new Map([
                ["GRAPH_ID", LOCAL_GRAPH_ID],
                ["SCRIPT_SLUG", file.slug],
              ]),
            ));

            e.stopPropagation();
            e.preventDefault();
          }}
        />
        : ""
    }
  </a>;
};

export default FilesViewPreviewBox;
