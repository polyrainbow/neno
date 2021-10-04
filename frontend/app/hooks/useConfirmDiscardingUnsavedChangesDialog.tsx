import React from "react";
import ConfirmationServiceContext from "../ConfirmationServiceContext.js";
import { texts } from "../lib/config.js";

const useConfirmDiscardingUnsavedChangesDialog = () => {
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;

  const confirmDiscardingUnsavedChanges = () => {
    return confirm({
      text: texts.discardChangesConfirmation,
      confirmText: "Discard changes",
      cancelText: "Cancel",
      encourageConfirmation: false,
    });
  };

  return confirmDiscardingUnsavedChanges;
};

export default useConfirmDiscardingUnsavedChangesDialog;
