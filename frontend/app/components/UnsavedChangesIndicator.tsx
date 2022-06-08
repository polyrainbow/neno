import React from "react";
import Tooltip from "./Tooltip.js";
import { emojis } from "../config.js";
import { l } from "../lib/intl.js";

interface UnsavedChangesIndicatorProps {
  isUnsaved?: boolean,
  unsavedChanges: boolean,
}

const UnsavedChangesIndicator = ({
  isUnsaved,
  unsavedChanges,
}:UnsavedChangesIndicatorProps) => {
  const unsavedChangesText = unsavedChanges
    ? l("editor.unsaved-changes")
    : l("editor.no-unsaved-changes");

  const unsavedChangesSymbol = unsavedChanges
    ? emojis.unsavedChanges
    : emojis.noUnsavedChanges;

  return <>
    {
      isUnsaved
        ? <Tooltip
          title={l("editor.note-has-not-been-saved-yet")}
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
