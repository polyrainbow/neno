import React from "react";
import {
  Tooltip,
} from "react-tippy";

const UnsavedChangesIndicator = ({
  unsavedChanges,
}) => {
  const title = unsavedChanges
    ? "Unsaved changes"
    : "No unsaved changes";

  const symbol = unsavedChanges
    ? "✳️"
    : "✔️";

  return <Tooltip
    title={title}
    position="bottom"
    trigger="mouseenter focus"
  >
    <span>{symbol}</span>
  </Tooltip>;
};

export default UnsavedChangesIndicator;
