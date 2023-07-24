import Tooltip from "./Tooltip";
import Icon from "./Icon";

interface StatusIndicatorItemProps {
  isActive: boolean,
  title: string,
  icon: string,
}

const StatusIndicatorItem = ({
  isActive,
  title,
  icon,
}: StatusIndicatorItemProps) => {
  return <>
    {
      isActive
        ? <Tooltip
          title={title}
        >
          <Icon
            icon={icon}
            title={title}
            size={24}
          />
        </Tooltip>
        : ""
    }
  </>;
};

export default StatusIndicatorItem;
