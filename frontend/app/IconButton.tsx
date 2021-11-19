import React from "react";
import Tooltip from "./Tooltip.js";
import { getIconSrc } from "./lib/utils";

interface IconButtonProps {
  id?: string,
  title: string,
  icon: string,
  onClick: any,
  disabled?: boolean,
}

const IconButton = ({
  id,
  title,
  icon,
  onClick,
  disabled = false,
}:IconButtonProps) => {
  return <Tooltip
    title={title}
  >
    <button
      className="icon-button"
      id={id}
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

export default IconButton;
