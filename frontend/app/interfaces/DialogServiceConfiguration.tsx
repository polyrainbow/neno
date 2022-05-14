import { DialogType } from "../enum/DialogType";

interface DialogServiceConfiguration {
  openDialog: DialogType,
  callback: ((...args: any[]) => void) | null,
}

export default DialogServiceConfiguration;
