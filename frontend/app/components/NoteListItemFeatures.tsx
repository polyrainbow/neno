import React from "react";
import Tooltip from "./Tooltip";
import { emojis } from "../config";
import { l } from "../lib/intl";
import NoteListItemFeaturesType
  from "../../../lib/notes/interfaces/NoteListItemFeatures";


const NoteListItemFeatures = ({
  features,
}: {
  features: NoteListItemFeaturesType,
}) => {
  return <span
    className="note-features"
  >
    {
      features.containsText
        ? <Tooltip
          title={l("list.item.features.contains-text")}>
          <span>{emojis.text}</span>
        </Tooltip>
        : null
    }
    {
      features.containsWeblink
        ? <Tooltip
          title={l("list.item.features.contains-links")}>
          <span>{emojis.weblink}</span>
        </Tooltip>
        : null
    }
    {
      features.containsCode
        ? <Tooltip
          title={l("list.item.features.contains-code")}>
          <span>{emojis.code}</span>
        </Tooltip>
        : null
    }
    {
      features.containsImages
        ? <Tooltip
          title={l("list.item.features.contains-images")}>
          <span>{emojis.image}</span>
        </Tooltip>
        : null
    }
    {
      features.containsDocuments
        ? <Tooltip
          title={l("list.item.features.contains-documents")}>
          <span>{emojis.document}</span>
        </Tooltip>
        : null
    }
    {
      features.containsAudio
        ? <Tooltip
          title={l("list.item.features.contains-audio")}>
          <span>{emojis.audio}</span>
        </Tooltip>
        : null
    }
    {
      features.containsVideo
        ? <Tooltip
          title={l("list.item.features.contains-video")}>
          <span>{emojis.video}</span>
        </Tooltip>
        : null
    }
  </span>;
};

export default NoteListItemFeatures;
