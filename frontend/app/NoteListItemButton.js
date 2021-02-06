import React from "react";
import {
  Tooltip,
} from "react-tippy";
import { ICON_PATH } from "./lib/config.js";

const NoteListItemButton = ({
  icon,
  title,
  onClick,
  disabled,
}) => {
  return (
    <Tooltip
      title={title}
      position="bottom"
      trigger="mouseenter focus"
    >
      <button
        onClick={(e) => {
          onClick();
          e.stopPropagation();
        }}
        className="noteListItemButton"
        disabled={disabled}
      >
        <img
          style={{ "verticalAlign": "bottom" }}
          src={ICON_PATH + icon + "-24px.svg"}
          alt={title}
          className="svg-icon"
        />
      </button>
    </Tooltip>
  );
};

export default NoteListItemButton;
