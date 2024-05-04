import { MouseEvent } from "react";
import { getIconSrc } from "../lib/utils";

interface FloatingActionButtonProps {
  title: string;
  icon: string;
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
}

const FloatingActionButton = ({
  title,
  icon,
  onClick,
  disabled = false,
}: FloatingActionButtonProps) => {
  return <button
    className="icon-button-floating"
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    <img
      src={getIconSrc(icon)}
      alt={title}
      width="24"
      height="24"
      className="svg-icon"
    />
  </button>;
};

export default FloatingActionButton;
