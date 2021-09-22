import React from "react";
import { shortenText } from "./lib/utils.js";
import { ICON_PATH } from "./lib/config.js";

const EditorViewHeaderPinnedNote = ({
  note,
  isActive,
  onClick,
}) => {
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
      src={ICON_PATH + "push_pin-24px.svg"}
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
