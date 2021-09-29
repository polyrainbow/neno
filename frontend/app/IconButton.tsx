import React from "react";
import {
  Tooltip,
} from "react-tippy";
import { ICON_PATH } from "./lib/config";

interface IconButtonProps {
  id?: string,
  title: string,
  icon: string,
  onClick: any,
  disabled?: boolean,
};

const IconButton = ({
  id,
  title,
  icon,
  onClick,
  disabled = false,
}:IconButtonProps) => {
  return <Tooltip
    title={title}
    position="bottom"
    // @ts-ignore types are incorrect
    trigger="mouseenter focus"
  >
    <button
      className="icon-button"
      id={id}
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

export default IconButton;
