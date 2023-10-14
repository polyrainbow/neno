import Tooltip from "./Tooltip";
import { getIconSrc } from "../lib/utils";

interface FloatingActionButtonProps {
  title: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
}

const FloatingActionButton = ({
  title,
  icon,
  onClick,
  disabled = false,
}: FloatingActionButtonProps) => {
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
