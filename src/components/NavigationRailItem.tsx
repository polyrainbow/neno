import IconButton from "./IconButton";

interface NavigationRailItemProps {
  icon: string,
  label: string,
  onClick: () => void,
  disabled?: boolean,
  id: string,
  isActive?: boolean,
}


const NavigationRailItem = ({
  icon,
  label,
  onClick,
  disabled = false,
  id,
  isActive = false,
}: NavigationRailItemProps) => {
  return <div>
    {
      isActive
        ? <div className="active-view-indicator"></div>
        : null
    }
    <IconButton
      disabled={disabled}
      onClick={onClick}
      icon={icon}
      title={label}
      id={id}
    />
  </div>;
};

export default NavigationRailItem;
