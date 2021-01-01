import React from "react";
import {
  Tooltip,
} from "react-tippy";
import { emojis } from "./lib/config.js";

const UnsavedChangesIndicator = ({
  isUnsaved,
  unsavedChanges,
}) => {
  const title = isUnsaved
    ? "This note has not been saved yet"
    : unsavedChanges
      ? "Unsaved changes"
      : "No unsaved changes";

  const symbol = isUnsaved
    ? emojis.new
    : unsavedChanges
      ? emojis.unsavedChanges
      : emojis.noUnsavedChanges;

  return <Tooltip
    title={title}
    position="bottom"
    trigger="mouseenter focus"
  >
    <span>{symbol}</span>
  </Tooltip>;
};

export default UnsavedChangesIndicator;
