import React from "react";
import NoteListItemLinkedNotesIndicator
  from "./NoteListItemLinkedNotesIndicator";
import NoteListItemInfo from "./NoteListItemInfo.js";


const NoteListItem = ({
  note,
  isActive,
  isLinked,
  onSelect,
  onLinkChange,
  isLinkable,
}) => {
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
        <NoteListItemInfo note={note} />
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
