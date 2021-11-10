import React from "react";
import Tooltip from "./Tooltip.js";
import { emojis } from "./lib/config.js";


const NoteListItemFeatures = ({
  features,
}) => {
  return <span
    className="note-features"
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
      features?.containsDocuments
        ? <Tooltip
          title="Contains documents"><span>{emojis.document}</span></Tooltip>
        : null
    }
    {
      features?.containsAudio
        ? <Tooltip
          title="Contains audio"><span>{emojis.audio}</span></Tooltip>
        : null
    }
    {
      features?.containsVideo
        ? <Tooltip
          title="Contains video"><span>{emojis.video}</span></Tooltip>
        : null
    }
  </span>;
};

export default NoteListItemFeatures;
