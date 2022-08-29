import React from "react";
import ConfirmationServiceContext
  from "../contexts/ConfirmationServiceContext";
import { l } from "../lib/intl";

const useConfirmDiscardingUnsavedChangesDialog = () => {
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;

  const confirmDiscardingUnsavedChanges = () => {
    return confirm({
      text: l("editor.discard-changes-confirmation.text"),
      confirmText: l("editor.discard-changes-confirmation.confirm"),
      cancelText: l("dialog.cancel"),
      encourageConfirmation: false,
    });
  };

  return confirmDiscardingUnsavedChanges;
};

export default useConfirmDiscardingUnsavedChangesDialog;
