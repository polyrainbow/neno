import { useContext } from "react";
import DialogServiceContext from "../contexts/DialogServiceContext";
import { DialogType } from "../enum/DialogType";

/*
  This hook enables a component to easily open a dialog.
  It accepts two parameters: the dialog type and a handler that is executed
  when the callback request it.
  Usage:
  const openCertainDialog = useDialog(DialogType.MY_DIALOG, handler);
*/
const useDialog = (
  dialogType: DialogType,
  callback: ((...args: any[]) => void) | null,
) => {
  const setDialogConfig = useContext(DialogServiceContext);
  return () => {
    setDialogConfig?.({
      openDialog: dialogType,
      callback,
    });
  };
};

export default useDialog;
