/*
  Electron ignores the string a beforeunload handler returns and would
  block the window close with no UI at all, so the renderer pushes its
  dirty flag here and the close is intercepted with a native dialog.
*/

import { BrowserWindow, dialog, ipcMain } from "electron";

const dirtyWindows = new Set<number>();

export function registerUnsavedChangesHandler(window: BrowserWindow): void {
  let forceClose = false;

  window.on("close", (event) => {
    if (forceClose || !dirtyWindows.has(window.id)) return;

    event.preventDefault();

    void dialog.showMessageBox(window, {
      type: "warning",
      buttons: ["Cancel", "Discard changes"],
      defaultId: 0,
      cancelId: 0,
      title: "Unsaved changes",
      message: "You have unsaved changes.",
      detail: "If you close NENO now, those changes will be lost.",
    }).then(({ response }) => {
      if (response === 1) {
        forceClose = true;
        dirtyWindows.delete(window.id);
        window.close();
      }
    });
  });

  window.on("closed", () => {
    dirtyWindows.delete(window.id);
  });
}

export function registerUnsavedChangesIpc(): void {
  ipcMain.handle(
    "window:setUnsavedChanges",
    (event, hasChanges: unknown) => {
      const window = BrowserWindow.fromWebContents(event.sender);
      if (!window) return;
      if (hasChanges) {
        dirtyWindows.add(window.id);
      } else {
        dirtyWindows.delete(window.id);
      }
    },
  );
}
