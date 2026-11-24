import useRunOnce from "../hooks/useRunOnce";
import Icon from "./Icon";
import { useRef } from "react";

interface IconButtonProps {
  id?: string,
  title: string,
  icon: string,
  onClick: () => void,
  disabled?: boolean,
  disableTooltip?: boolean,
  navRailButton?: boolean,
}

const IconButton = ({
  id,
  title,
  icon,
  onClick,
  disabled = false,
  disableTooltip = false,
  navRailButton = false,
}: IconButtonProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useRunOnce(() => {
    /*
      Tooltips are for a mouse hovering. A tap on a touch screen fires
      pointer and mouse events too, which would leave a tooltip standing
      over the page until the next tap. They also need the Popover API
      (Chrome 114); an older Android WebView lacks it, and the half-made
      tooltip would end up as stray text at the top of the page.
    */
    if (disableTooltip || !("showPopover" in HTMLElement.prototype)) return;

    const showPopover = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const popoverElement = document.createElement("div");
      popoverElement.popover = "auto";
      popoverElement.classList.add("tooltip");
      if (navRailButton) {
        popoverElement.classList.add("nav-rail-tooltip");
      }
      document.body.appendChild(popoverElement);
      popoverElement.innerHTML = title;
      popoverElement.showPopover();
      popoverRef.current = popoverElement;

      const targetRect = ref.current?.getBoundingClientRect();

      if (!targetRect) throw new Error("Target rect undefined");

      if (id) {
        const css = new CSSStyleSheet();
        css.replaceSync(`
        #${id} {
          anchor-name: --icon-button-${id};
        }
        .tooltip:popover-open {
          position-anchor: --icon-button-${id};
        }`);
        document.adoptedStyleSheets = [css];
      }
    };

    const hidePopover = () => {
      const element = popoverRef.current;
      if (!element) return;
      element.hidePopover();
      element.remove();
    };

    ref.current?.addEventListener("pointerenter", showPopover);
    ref.current?.addEventListener("pointerleave", hidePopover);
    ref.current?.addEventListener("click", hidePopover);

    return () => {
      ref.current?.removeEventListener("pointerenter", showPopover);
      ref.current?.removeEventListener("pointerleave", hidePopover);
      ref.current?.removeEventListener("click", hidePopover);
    };
  });

  return <button
    className="icon-button"
    id={id}
    onClick={onClick}
    disabled={disabled}
    ref={ref}
    aria-label={title}
    title={disableTooltip ? title : ""}
  >
    <Icon
      icon={icon}
    />
  </button>;
};

export default IconButton;
