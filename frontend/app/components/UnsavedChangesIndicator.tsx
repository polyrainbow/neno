import React from "react";
import Tooltip from "./Tooltip";
import { l } from "../lib/intl";
import Icon from "./Icon";

interface UnsavedChangesIndicatorProps {
  isUnsaved?: boolean,
  unsavedChanges: boolean,
}

const UnsavedChangesIndicator = ({
  isUnsaved,
  unsavedChanges,
}: UnsavedChangesIndicatorProps) => {
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
