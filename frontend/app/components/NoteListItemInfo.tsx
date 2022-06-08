import React from "react";
import { emojis } from "../config.js";
import { l } from "../lib/intl.js";
import NoteListItemFeatures from "./NoteListItemFeatures";


const NoteListItemInfo = ({
  note,
}) => {
  const SPAN_SEPARATOR = " · ";

  const isHub = (
    typeof note.numberOfLinkedNotes === "number"
    && !isNaN(note.numberOfLinkedNotes)
    && note.numberOfLinkedNotes >= 5
  );

  return <div
    className="info"
  >
    {(new Date(note.updateTime)).toLocaleDateString()}
    {
      note.numberOfFiles > 0
        ? SPAN_SEPARATOR + l(
          note.numberOfFiles > 1 ? "list.item.files" : "list.item.file",
          { files: note.numberOfFiles },
        )
        : ""
    }
    {
      /* if note contains at least one feature, show the separator */
      Object.values(note.features || {}).some((val) => val === true)
        ? SPAN_SEPARATOR
        : ""
    }
    <NoteListItemFeatures
      features={note.features}
    />
    {
      isHub
        ? SPAN_SEPARATOR + emojis.hub + " " + l("list.item.hub")
        : ""
    }
  </div>;
};

export default NoteListItemInfo;
