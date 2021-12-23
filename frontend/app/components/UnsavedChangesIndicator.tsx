import React from "react";
import Tooltip from "./Tooltip.js";
import { emojis } from "../lib/config.js";

interface UnsavedChangesIndicatorProps {
  isUnsaved?: boolean,
  unsavedChanges: boolean,
}

const UnsavedChangesIndicator = ({
  isUnsaved,
  unsavedChanges,
}:UnsavedChangesIndicatorProps) => {
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
        >
          <span>{emojis.new}</span>
        </Tooltip>
        : ""
    }
    <Tooltip
      title={unsavedChangesText}
    >
      <span>{unsavedChangesSymbol}</span>
    </Tooltip>
  </>;
};

export default UnsavedChangesIndicator;
