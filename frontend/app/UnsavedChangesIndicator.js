import React from "react";
import {
  Tooltip,
} from "react-tippy";
import { emojis } from "./lib/config.js";

const UnsavedChangesIndicator = ({
  isUnsaved,
  unsavedChanges,
}) => {
  const unsavedChangesText = unsavedChanges
    ? "Unsaved changes"
    : "No unsaved changes";

  const unsavedChangesSymbol = unsavedChanges
    ? emojis.unsavedChanges
    : emojis.noUnsavedChanges;

  return <>
    {
      isUnsaved
        ? <Tooltip
          title="This note has not been saved yet"
          position="bottom"
          trigger="mouseenter focus"
        >
          <span>{emojis.new}</span>
        </Tooltip>
        : ""
    }
    <Tooltip
      title={unsavedChangesText}
      position="bottom"
      trigger="mouseenter focus"
    >
      <span>{unsavedChangesSymbol}</span>
    </Tooltip>
  </>;
};

export default UnsavedChangesIndicator;
