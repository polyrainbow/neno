import React from "react";
import { BlockLinkData } from "../../../lib/subwaytext/interfaces/Block";

interface NoteContentBlockAudioProps {
  blockData: BlockLinkData,
}

const NoteContentBlockUrl = ({
  blockData,
}: NoteContentBlockAudioProps) => {
  const hostname = (new URL(blockData.url)).hostname;

  return <a
    href={blockData.url}
    target="_blank"
    rel="noreferrer noopener"
    key={Math.random()}
    className="url-block-link"
  >
    <div
      className="preview-block-file-wrapper"
      key={blockData.url}
    >
      {
        blockData.text
          ? <>
            <span className="url-block-title">{blockData.text}</span>
            <span className="url-block-hostname">{hostname}</span>
          </>
          : blockData.url
      }
    </div>
  </a>;
};


export default NoteContentBlockUrl;
