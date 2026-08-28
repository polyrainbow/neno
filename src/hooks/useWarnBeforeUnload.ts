import { useEffect } from "react";
import { isElectron, getBridge } from "../lib/electron/bridge";

/*
  Electron ignores the string a beforeunload handler returns and would
  block the window close with no UI at all, so instead of hooking
  beforeunload we push the dirty flag to the main process, which
  intercepts the window's "close" event with a native message box.
*/
export default (isEnabled: boolean): void => {
  useEffect(() => {
    if (!isElectron()) return;
    getBridge().setUnsavedChanges(isEnabled);
  }, [isEnabled]);
};
