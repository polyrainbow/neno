import { l } from "../lib/intl";
import useConfirm from "./useConfirm";

const useConfirmDiscardingUnsavedChangesDialog = () => {
  const confirm = useConfirm();

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
