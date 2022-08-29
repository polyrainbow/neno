import React from "react";
import Tooltip from "./Tooltip";
import Icon from "./Icon";

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
}: IconButtonProps) => {
  return <Tooltip
    title={title}
  >
    <button
      className="icon-button"
      id={id}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon
        icon={icon}
        title={title}
        size={24}
      />
    </button>
  </Tooltip>;
};

export default IconButton;
