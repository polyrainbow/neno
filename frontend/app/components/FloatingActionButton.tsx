import React from "react";
import Tooltip from "./Tooltip.js";
import { getIconSrc } from "../lib/utils";

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
        src={getIconSrc(icon)}
        alt={title}
        width="24"
        height="24"
        className="svg-icon"
      />
    </button>
  </Tooltip>;
};

export default FloatingActionButton;
