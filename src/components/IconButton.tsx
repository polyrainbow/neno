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
    const showPopover = () => {
      const popoverElement = document.createElement("div");
      popoverElement.popover = "auto";
      popoverElement.className = "tooltip";
      document.body.appendChild(popoverElement);
      popoverElement.innerHTML = title;
      popoverElement.showPopover();
      popoverRef.current = popoverElement;

      const popoverRect = popoverElement.getBoundingClientRect();
      const targetRect = ref.current?.getBoundingClientRect();

      if (!targetRect) throw new Error("Target rect undefined");

      const css = new CSSStyleSheet();
      css.replaceSync(`
      .tooltip:popover-open {
        top: ${targetRect.y - 35}px;
        left: ${targetRect.x + 25 - (popoverRect.width / 2)}px;
      }`);
      document.adoptedStyleSheets = [css];
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
