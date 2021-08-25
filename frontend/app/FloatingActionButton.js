import React from "react";
import {
  Tooltip,
} from "react-tippy";
import { ICON_PATH } from "./lib/config.js";

const FloatingActionButton = ({
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
      className="icon-button-floating"
      id={id}
      alt={title}
      onClick={onClick}
      disabled={disabled}
    >
      <img
        src={ICON_PATH + icon + "-24px.svg"}
        alt={title}
        width="24"
        height="24"
        className="svg-icon"
      />
    </button>
  </Tooltip>;
};

export default FloatingActionButton;
