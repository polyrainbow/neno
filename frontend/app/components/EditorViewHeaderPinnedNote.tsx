import React from "react";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
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
    style={{
      padding: "0px 10px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    }}
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
    >{shortenText(note.title, 35)}</p>
  </div>;
};


export default EditorViewHeaderPinnedNote;
