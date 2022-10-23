import React from "react";
import { HighlightDetails } from "../types/GraphVisualizerConfig";
import { emojis } from "../config";
import { l } from "../lib/intl";

interface GraphViewStatusIndicatorProps {
  status: HighlightDetails
}

const GraphViewStatusIndicator = ({
  status,
}: GraphViewStatusIndicatorProps) => {
  if (!status.active) {
    return null;
  }

  let statusSpan;

  if (status.type === "new-nodes-position-indicator") {
    statusSpan
      = <span>{
        emojis.new
        + " "
        + l("graph.initial-position-explainer")
      }</span>;
  } else if (status.type === "node") {
    statusSpan = <span>{emojis.note + " " + status.title}</span>;
  } else if (status.type === "edge") {
    statusSpan
      = <span>{emojis.link
      + " " + status.titles?.[0]
      + " "}<span className="emoji">↔️</span>
      {
        " " + status.titles?.[1]
      }</span>;
  }

  return <div
    id="graph-view-status"
  >{statusSpan}</div>;
};

export default GraphViewStatusIndicator;
