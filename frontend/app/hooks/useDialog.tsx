import { useContext } from "react";
import DialogServiceContext from "../contexts/DialogServiceContext";
import { DialogType } from "../enum/DialogType";

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
