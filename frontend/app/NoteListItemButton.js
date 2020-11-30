import React from "react";
import {
  Tooltip,
} from "react-tippy";

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
          src={"/assets/icons/" + icon + "-24px.svg"}
          alt={title}
        />
      </button>
    </Tooltip>
  );
};

export default NoteListItemButton;
