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
          title="Contains text"><span>{emojis.text}</span></Tooltip>
        : null
    }
    {
      features?.containsWeblink
        ? <Tooltip
          title="Contains links"><span>{emojis.weblink}</span></Tooltip>
        : null
    }
    {
      features?.containsCode
        ? <Tooltip
          title="Contains code"><span>{emojis.code}</span></Tooltip>
        : null
    }
    {
      features?.containsImages
        ? <Tooltip
          title="Contains images"><span>{emojis.image}</span></Tooltip>
        : null
    }
    {
      features?.containsAttachements
        ? <Tooltip
          title="Contains files"><span>{emojis.file}</span></Tooltip>
        : null
    }
    {
      features?.containsAudio
        ? <Tooltip
          title="Contains audio"><span>{emojis.audio}</span></Tooltip>
        : null
    }
  </div>;
};

export default NoteListItemFeatures;
