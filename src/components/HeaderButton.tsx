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
      (icon ? "with-icon" : "without-icon")
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
          className="svg-icon"
          draggable={false}
        />
        : ""
    }
    <span>{children}</span>
  </button>;
};


export default HeaderButton;
