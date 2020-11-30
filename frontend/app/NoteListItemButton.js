import React from "react";

const NoteListItemButton = ({
  icon,
  title,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={(e) => {
        onClick();
        e.stopPropagation();
      }}
      title={title}
      className="noteListItemButton"
      disabled={disabled}
    >
      <img
        style={{ "verticalAlign": "bottom" }}
        src={"/assets/icons/" + icon + "-24px.svg"}
        title={title}
        alt={title}
      />
    </button>
  );
};

export default NoteListItemButton;
