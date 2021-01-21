import React from "react";
import {
  Tooltip,
} from "react-tippy";

const IconButton = ({
  id,
  title,
  icon,
  onClick,
  disabled,
}) => {
  return <Tooltip
    title={title}
    position="bottom"
    trigger="mouseenter focus"
  >
    <button
      className="icon-button"
      id={id}
      alt={title}
      onClick={onClick}
      disabled={disabled}
    >
      <img
        src={"/assets/icons/" + icon + "-24px.svg"}
        alt={title}
        width="24"
        height="24"
        className="svg-icon"
      />
    </button>
  </Tooltip>;
};

export default IconButton;
