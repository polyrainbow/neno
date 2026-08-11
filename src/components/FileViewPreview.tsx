import { MediaType } from "../lib/notes/types/MediaType";
import FlexContainer from "./FlexContainer";
import MarkdownPreview from "./MarkdownPreview";

interface FileViewPreviewProps {
  type: MediaType,
  src: string,
  text?: string,
  isMarkdown?: boolean,
}

const FileViewPreview = ({
  type,
  src,
  text,
  isMarkdown = false,
}: FileViewPreviewProps) => {
  return <FlexContainer
    className="file-container"
  >
    {
      type === MediaType.IMAGE
        ? <img
          className="checkerboard-background"
          src={src}
          loading="lazy"
        />
        : ""
    }
    {
      type === MediaType.AUDIO
        ? <audio
          src={src}
          controls
        />
        : ""
    }
    {
      type === MediaType.VIDEO
        ? <video
          src={src}
          controls
        />
        : ""
    }
    {
      type === MediaType.PDF
        ? <iframe
          src={src}
        />
        : ""
    }
    {
      type === MediaType.TEXT && !!text && isMarkdown
        ? <MarkdownPreview markdown={text} />
        : ""
    }
    {
      type === MediaType.TEXT && !!text && !isMarkdown
        ? <pre
          className="preview-block-file-text"
        >{text}</pre>
        : ""
    }
  </FlexContainer>;
};

export default FileViewPreview;
