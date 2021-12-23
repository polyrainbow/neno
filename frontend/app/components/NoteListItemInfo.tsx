import React from "react";
import { emojis } from "../lib/config.js";
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
        ? SPAN_SEPARATOR
          + ` ${note.numberOfFiles} file`
          + (note.numberOfFiles > 1 ? "s" : "")
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
        ? SPAN_SEPARATOR + emojis.hub + " Hub"
        : ""
    }
  </div>;
};

export default NoteListItemInfo;
