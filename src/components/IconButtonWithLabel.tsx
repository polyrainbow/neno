import Tooltip from "./Tooltip";
import Icon from "./Icon";

interface IconButtonWithLabelProps {
  id?: string,
  title: string,
  icon: string,
  onClick: any,
  disabled?: boolean,
}

const IconButtonWithLabel = ({
  id,
  title,
  icon,
  onClick,
  disabled = false,
}: IconButtonWithLabelProps) => {
  return <Tooltip
    title={title}
  >
    <button
      className="default-button default-button-with-icon"
      id={id}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon
        icon={icon}
        title={title}
        size={24}
      />
      {title}
    </button>
  </Tooltip>;
};

export default IconButtonWithLabel;
