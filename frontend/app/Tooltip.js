import React from "react";
import { Tooltip as ReactTippyTooltip } from "react-tippy";

const Tooltip = ({ title, tag, children }) => {
  return <ReactTippyTooltip
    title={title}
    position="bottom"
    trigger="mouseenter focus"
    style={{
      display: (tag === "span") ? "inline" : "flex",
    }}
    tag={tag ?? "div"}
  >{children}</ReactTippyTooltip>;
};

export default Tooltip;
