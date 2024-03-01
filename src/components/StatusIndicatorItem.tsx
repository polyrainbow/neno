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
        ? <Icon
          icon={icon}
          title={title}
          size={24}
        />
        : ""
    }
  </>;
};

export default StatusIndicatorItem;
