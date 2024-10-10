import Icon from "./Icon";
import { useEffect, useRef } from "react";

interface IconButtonProps {
  id?: string,
  title: string,
  icon: string,
  onClick: () => void,
  disabled?: boolean,
}

const IconButton = ({
  id,
  title,
  icon,
  onClick,
  disabled = false,
}: IconButtonProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const anchorName = `--${id}`;

    if (ref.current) {
      // @ts-ignore
      ref.current.style.anchorName = anchorName;
    }

    const showPopover = () => {
      const popoverElement = document.createElement("div");
      popoverElement.popover = "auto";
      popoverElement.className = "tooltip";
      // @ts-ignore
      popoverElement.style.positionAnchor = anchorName;
      document.body.appendChild(popoverElement);
      popoverElement.innerHTML = title;
      popoverElement.showPopover();
      popoverRef.current = popoverElement;
    };

    const hidePopover = () => {
      popoverRef.current?.hidePopover();
      popoverRef.current?.parentElement?.removeChild(popoverRef.current);
    };

    ref.current?.addEventListener("mouseenter", showPopover);
    ref.current?.addEventListener("mouseleave", hidePopover);

    return () => {
      ref.current?.removeEventListener("mouseenter", showPopover);
      ref.current?.removeEventListener("mouseleave", hidePopover);
    };
  }, []);

  return <button
    className="icon-button"
    id={id}
    onClick={onClick}
    disabled={disabled}
    ref={ref}
  >
    <Icon
      icon={icon}
      title={title}
      size={24}
    />
  </button>;
};

export default IconButton;
