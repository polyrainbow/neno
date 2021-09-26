import React from "react";
import { emojis } from "./lib/config.js";

const GraphViewStatusIndicator = ({
  status,
}) => {
  if (!status.active) {
    return null;
  }

  let statusSpan;

  if (status.type === "new-nodes-position-indicator") {
    statusSpan
      = <span>{
        emojis.new
        + " "
        + "Initial position for new nodes (drag and drop to move)"
      }</span>;
  } else if (status.type === "node") {
    statusSpan = <span>{emojis.note + " " + status.title}</span>;
  } else if (status.type === "edge") {
    statusSpan
      = <span>{emojis.link
      + " " + status.titles[0]
      + " "}<span className="emoji">↔️</span>
      {
        " " + status.titles[1]
      }</span>;
  }

  return <div
    id="graph-view-status"
  >{statusSpan}</div>;
};

export default GraphViewStatusIndicator;
