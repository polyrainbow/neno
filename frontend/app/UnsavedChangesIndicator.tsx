import React from "react";
import {
  Tooltip,
} from "react-tippy";
import { emojis } from "./lib/config.js";

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
          position="bottom"
          // @ts-ignore types are not correct
          trigger="mouseenter focus"
        >
          <span>{emojis.new}</span>
        </Tooltip>
        : ""
    }
    <Tooltip
      title={unsavedChangesText}
      position="bottom"
      // @ts-ignore types are not correct
      trigger="mouseenter focus"
    >
      <span>{unsavedChangesSymbol}</span>
    </Tooltip>
  </>;
};

export default UnsavedChangesIndicator;
