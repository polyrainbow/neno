import { DialogType } from "../enum/DialogType";

interface DialogServiceConfiguration {
  openDialog: DialogType,
  props: any,
  callback: ((...args: any[]) => void) | null,
}

export default DialogServiceConfiguration;
