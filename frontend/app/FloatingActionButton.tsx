import React from "react";
import {
  Tooltip,
} from "react-tippy";
import { ICON_PATH } from "./lib/config.js";

const FloatingActionButton = ({
  title,
  icon,
  onClick,
  disabled = false,
}) => {
  return <Tooltip
    title={title}
    position="bottom"
    // @ts-ignore type definition is not correct
    trigger="mouseenter focus"
  >
    <button
      className="icon-button-floating"
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
