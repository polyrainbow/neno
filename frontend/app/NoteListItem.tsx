import React from "react";
import { yyyymmdd } from "./lib/utils.js";
import { emojis } from "./lib/config.js";
import NoteListItemLinkedNotesIndicator
  from "./NoteListItemLinkedNotesIndicator";
import NoteListItemFeatures from "./NoteListItemFeatures";


const NoteListItem = ({
  note,
  isActive,
  isLinked,
  onSelect,
  onLinkChange,
  isLinkable,
}) => {
  const SPAN_SEPARATOR = " · ";

  const isHub = (
    typeof note.numberOfLinkedNotes === "number"
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
        {note.title}
      </div>
      <div className="note-list-item-second-row">
        <div
          className="info"
        >
          {yyyymmdd(new Date(note.updateTime))}
          {
            isHub
              ? SPAN_SEPARATOR + emojis.hub + " Hub"
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
        </div>
      </div>
    </div>
    <NoteListItemLinkedNotesIndicator
      isLinked={isLinked}
      isLinkable={isLinkable}
      isActive={isActive}
      numberOfLinkedNotes={note.numberOfLinkedNotes}
      onLinkChange={onLinkChange}
    />
  </div>;
};

export default NoteListItem;
