import { useContext, useEffect, useState } from "react";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import useConfirmDiscardingUnsavedChangesDialog
  from "./useConfirmDiscardingUnsavedChangesDialog";
import {
  canGoBack as getCanGoBack,
  canGoForward as getCanGoForward,
  goBack as traverseBack,
  goForward as traverseForward,
  onCurrentEntryChange,
} from "../lib/navigation";

/*
  Back and forward for the desktop app, which has no browser chrome to
  provide them. Every trigger — header buttons, Go menu, mouse side
  buttons, trackpad swipe — goes through here, so leaving a note with
  unsaved changes always asks first, the way clicking a pinned note does.
*/
const useHistoryNavigation = () => {
  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const [canGoBack, setCanGoBack] = useState<boolean>(getCanGoBack);
  const [canGoForward, setCanGoForward]
    = useState<boolean>(getCanGoForward);

  useEffect(() => {
    return onCurrentEntryChange(() => {
      setCanGoBack(getCanGoBack());
      setCanGoForward(getCanGoForward());
    });
  }, []);

  const traverse = async (
    isPossible: () => boolean,
    step: () => void,
  ): Promise<void> => {
    // Nothing to confirm when there is nowhere to go.
    if (!isPossible()) return;
    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }
    step();
  };

  return {
    canGoBack,
    canGoForward,
    goBack: () => traverse(getCanGoBack, traverseBack),
    goForward: () => traverse(getCanGoForward, traverseForward),
  };
};

export default useHistoryNavigation;
