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
    className="floating-action-button"
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    <img
      src={getIconSrc(icon)}
      alt={title}
      className="svg-icon"
    />
  </button>;
};

export default FloatingActionButton;
