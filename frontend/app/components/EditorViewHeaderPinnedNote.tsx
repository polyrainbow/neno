import React from "react";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import { l } from "../lib/intl";
import { getIconSrc, shortenText } from "../lib/utils";

interface EditorViewHeaderPinnedNoteProps {
  key: string,
  note: NoteToTransmit,
  isActive: boolean,
  onClick: any,
}

const EditorViewHeaderPinnedNote = ({
  note,
  isActive,
  onClick,
}:EditorViewHeaderPinnedNoteProps) => {
  return <div
    className={"pinned-note " + (isActive ? "active" : "")}
    onClick={onClick}
  >
    <img
      src={getIconSrc("push_pin")}
      alt={"Pinned note"}
      width="24"
      height="24"
      className="svg-icon"
      style={{
        marginRight: "3px",
      }}
    />
    <p
      style={{
        whiteSpace: "pre",
      }}
    >{note.title ? shortenText(note.title, 35) : l("list.untitled-note")}</p>
  </div>;
};


export default EditorViewHeaderPinnedNote;
