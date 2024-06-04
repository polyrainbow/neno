import { getIconSrc } from "../lib/utils";

interface HeaderButtonProps extends React.PropsWithChildren {
  onClick: () => void,
  icon?: string,
  disabled?: boolean,
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void,
  onDragEnd?: (e: React.DragEvent<HTMLButtonElement>) => void,
  onDragOver?: (e: React.DragEvent<HTMLButtonElement>) => void,
  className?: string,
  draggable?: boolean,
  dangerous?: boolean,
}

const HeaderButton = ({
  onClick,
  icon,
  children,
  disabled,
  onDragStart,
  onDragEnd,
  onDragOver,
  className,
  draggable,
  dangerous,
}: HeaderButtonProps) => {
  return <button
    disabled={disabled}
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    onDragOver={onDragOver}
    className={
      "header-button "
      + (icon ? "with-icon" : "without-icon")
      + (className ? (" " + className) : "")
      + (dangerous ? (" dangerous") : "")
    }
    onClick={() => onClick()}
  >
    {
      icon
        ? <img
          src={getIconSrc(icon)}
          role="presentation"
          width="24"
          height="24"
          className="svg-icon"
          draggable={false}
        />
        : ""
    }
    <p>{children}</p>
  </button>;
};


export default HeaderButton;
