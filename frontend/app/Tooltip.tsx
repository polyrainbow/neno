import React from "react";
import { Tooltip as ReactTippyTooltip } from "react-tippy";

const Tooltip = ({
  title,
  tag = "div",
  children,
}) => {
  return <ReactTippyTooltip
    title={title}
    position="bottom"
    // @ts-ignore types are not correct https://github.com/tvkhoa/react-tippy/issues/127
    trigger="mouseenter focus"
    style={{
      display: (tag === "span") ? "inline" : "flex",
    }}
    tag={tag}
  >{children}</ReactTippyTooltip>;
};

export default Tooltip;
