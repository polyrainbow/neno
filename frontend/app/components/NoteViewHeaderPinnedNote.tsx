import React from "react";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import { l } from "../lib/intl";
import { getIconSrc, shortenText } from "../lib/utils";

interface NoteViewHeaderPinnedNoteProps {
  key: string,
  note: NoteToTransmit,
  isActive: boolean,
  onClick: any,
}

const NoteViewHeaderPinnedNote = ({
  note,
  isActive,
  onClick,
}: NoteViewHeaderPinnedNoteProps) => {
  return <button
    className={"pinned-note " + (isActive ? "active" : "")}
    onClick={onClick}
  >
    <img
      src={getIconSrc("push_pin")}
      alt={"Pinned note"}
      width="24"
      height="24"
      className="svg-icon"
    />
    <p>{
      note.meta.title
        ? shortenText(note.meta.title, 35)
        : l("list.untitled-note")
    }</p>
  </button>;
};


export default NoteViewHeaderPinnedNote;
