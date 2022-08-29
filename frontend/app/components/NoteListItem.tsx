import React from "react";
import NoteListItemLinkedNotesIndicator
  from "./NoteListItemLinkedNotesIndicator";
import NoteListItemInfo from "./NoteListItemInfo";
import {
  FrontendNoteListItem,
  MainNoteListItem,
} from "../interfaces/NoteListItem";
import { l } from "../lib/intl";

interface NoteListItemProps {
  key: string,
  note: FrontendNoteListItem,
  isActive: boolean,
  isLinked: boolean,
  onSelect: any,
  onLinkChange: any,
  isLinkable: boolean,
}


const NoteListItem = ({
  note,
  isActive,
  isLinked,
  onSelect,
  onLinkChange,
  isLinkable,
}: NoteListItemProps) => {
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

  const trClassList = ["note-list-item"];
  if (isHub) {
    trClassList.push("hub");
  }
  if (isActive) {
    trClassList.push("active");
  }
  if (isLinked) {
    trClassList.push("linked");
  }
  trClassList.push(isLinkable ? "linkable" : "not-linkable");


  return <div
    className={trClassList.join(" ")}
  >
    <div
      className={
        "note-list-item-main"
      }
      onClick={onSelect}
    >
      <div
        className="title"
      >
        {note.title || l("list.untitled-note")}
      </div>
      <div className="note-list-item-second-row">
        <NoteListItemInfo note={note} />
      </div>
    </div>
    <NoteListItemLinkedNotesIndicator
      isLinked={isLinked}
      isLinkable={isLinkable}
      isActive={isActive}
      numberOfLinkedNotes={isMainNoteListItem(note) && note.numberOfLinkedNotes}
      onLinkChange={onLinkChange}
    />
  </div>;
};

export default NoteListItem;
