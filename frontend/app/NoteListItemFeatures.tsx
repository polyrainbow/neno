import React from "react";
import Tooltip from "./Tooltip.js";
import { emojis } from "./lib/config.js";


const NoteListItemFeatures = ({
  features,
}) => {
  return <div
    className="note-features"
    style={{
      textAlign: "right",
    }}
  >
    {
      features?.containsText
        ? <Tooltip
          tag="span"
          title="Contains text">{emojis.text}</Tooltip>
        : ""
    }
    {
      features?.containsWeblink
        ? <Tooltip
          tag="span"
          title="Contains links">{emojis.weblink}</Tooltip>
        : ""
    }
    {
      features?.containsCode
        ? <Tooltip
          tag="span"
          title="Contains code">{emojis.code}</Tooltip>
        : ""
    }
    {
      features?.containsImages
        ? <Tooltip
          tag="span"
          title="Contains images">{emojis.image}</Tooltip>
        : ""
    }
    {
      features?.containsAttachements
        ? <Tooltip
          tag="span"
          title="Contains files">{emojis.file}</Tooltip>
        : ""
    }
    {
      features?.containsAudio
        ? <Tooltip
          tag="span"
          title="Contains audio">{emojis.audio}</Tooltip>
        : ""
    }
  </div>;
};

export default NoteListItemFeatures;
