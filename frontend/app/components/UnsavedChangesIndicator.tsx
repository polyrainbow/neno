import React from "react";
import Tooltip from "./Tooltip.js";
import { l } from "../lib/intl.js";
import Icon from "./Icon.js";

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

  return <>
    {
      isUnsaved
        ? <Tooltip
          title={l("editor.note-has-not-been-saved-yet")}
        >
          <Icon
            icon={"fiber_new"}
            title={l("editor.note-has-not-been-saved-yet")}
            size={24}
          />
        </Tooltip>
        : ""
    }
    <Tooltip
      title={unsavedChangesText}
    >
      <Icon
        icon={unsavedChanges ? "stream" : "done"}
        title={unsavedChangesText}
        size={24}
      />
    </Tooltip>
  </>;
};

export default UnsavedChangesIndicator;
