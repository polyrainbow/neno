import React from "react";
import { l } from "../lib/intl";
import { getIconSrc } from "../lib/utils";

const NoteContentEmptyDisclaimer = ({
  toggleEditMode,
}) => {
  return <div
    className="splash-message"
    style={{
      cursor: "pointer",
    }}
    onClick={() => toggleEditMode()}
  >
    <img
      style={{
        width: "100px",
      }}
      src={getIconSrc("edit_square")}
      alt={l("note.content-empty")}
      className="svg-icon"
    />
    <p>{l("note.content-empty")}</p>
  </div>;
};

export default NoteContentEmptyDisclaimer;
