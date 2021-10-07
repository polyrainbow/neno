import React from "react";
import Tooltip from "./Tooltip.js";
import { ICON_PATH } from "./lib/config";

const FloatingActionButton = ({
  title,
  icon,
  onClick,
  disabled = false,
}) => {
  return <Tooltip
    title={title}
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
