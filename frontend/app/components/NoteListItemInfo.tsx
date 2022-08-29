import React from "react";
import { emojis } from "../config";
import {
  FrontendNoteListItem,
  MainNoteListItem,
} from "../interfaces/NoteListItem";
import { l } from "../lib/intl";
import NoteListItemFeatures from "./NoteListItemFeatures";


const NoteListItemInfo = ({
  note,
}: {
  note: FrontendNoteListItem
}) => {
  const SPAN_SEPARATOR = " · ";

  const isMainNoteListItem = (
    noteListItem:(FrontendNoteListItem),
  ): noteListItem is MainNoteListItem => {
    return "features" in noteListItem;
  };

  const isHub = (
    isMainNoteListItem(note)
    && !isNaN(note.numberOfLinkedNotes)
    && note.numberOfLinkedNotes >= 5
  );

  return <div
    className="info"
  >
    {(new Date(note.updateTime)).toLocaleDateString()}
    {
      isMainNoteListItem(note) && (note.numberOfFiles > 0)
        ? SPAN_SEPARATOR + l(
          note.numberOfFiles > 1 ? "list.item.files" : "list.item.file",
          { files: note.numberOfFiles.toString() },
        )
        : ""
    }
    {
      /* if note contains at least one feature, show the separator and the
      features */
      (
        isMainNoteListItem(note)
        && Object.values(note.features).some((val) => val === true)
      )
        ? <>{SPAN_SEPARATOR}<NoteListItemFeatures
          features={note.features}
        /></>
        : ""
    }
    {
      isHub
        ? SPAN_SEPARATOR + emojis.hub + " " + l("list.item.hub")
        : ""
    }
  </div>;
};

export default NoteListItemInfo;
