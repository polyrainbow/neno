import React from "react";
import { ICON_PATH } from "./lib/config.js";

const NoteListStatus = ({
  status,
}) => {
  const map = {
    BUSY: {
      label: "Loading notes ...",
      icon: "pending",
    },
    SEARCH_VALUE_TOO_SHORT: {
      label: "Please type at least 3 characters to search",
      icon: "looks_3",
    },
    NO_NOTES_FOUND: {
      label: "No notes found",
      icon: "radio_button_unchecked",
    },
  };

  const activeState = map[status];

  return <div
    style={{
      fontSize: "20px",
      textAlign: "center",
      margin: "30px auto",
    }}
    className="noteListStatus"
  >
    <img
      style={{
        width: "100px",
      }}
      src={ICON_PATH + activeState.icon + "-24px.svg"}
      alt={activeState.label}
      className="svg-icon"
    />
    <p>{activeState.label}</p>
  </div>;
};

export default NoteListStatus;
