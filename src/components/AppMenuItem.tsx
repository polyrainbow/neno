import { getIconSrc } from "../lib/utils";

interface AppMenuItemProps {
  icon: string,
  label: string,
  onClick: () => void,
  disabled?: boolean,
}


const AppMenuItem = ({
  icon,
  label,
  onClick,
  disabled = false,
}: AppMenuItemProps) => {
  return <div
    onClick={disabled ? undefined : onClick}
    className={"app-menu-item" + (disabled ? " disabled" : "")}
  >
    <img
      src={getIconSrc(icon)}
      alt={label}
      width="24"
      height="24"
      className="svg-icon"
    />
    <p
      className="label"
    >{label}</p>
  </div>;
};

export default AppMenuItem;
