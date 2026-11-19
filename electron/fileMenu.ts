/*
  The File menu: Print.

  In the browser, Cmd-P was the browser's own print command, and
  public/assets/css/print.css turned the page into a print layout of the
  open note. Electron ships no such command, so without this menu item
  NENO cannot print at all.

  webContents.print() opens the system print panel, which also offers
  "Save as PDF". Printing goes through the same @media print rules the
  browser used, so nothing in the renderer needs to know about it.
*/

import { BrowserWindow } from "electron";

// See sendFindCommand in findMenu.ts for why the window is narrowed.
function print(window: Electron.BaseWindow | undefined): void {
  const target = window instanceof BrowserWindow
    ? window
    : BrowserWindow.getFocusedWindow();
  if (!target || target.isDestroyed()) return;
  /*
    The callback reports a cancelled or failed print job. The system
    print panel already tells the user about a failure, so there is
    nothing left to do with it.
  */
  target.webContents.print({}, () => {});
}

export function buildFileMenu(): Electron.MenuItemConstructorOptions {
  return {
    label: "File",
    submenu: [
      {
        label: "Print…",
        accelerator: "CmdOrCtrl+P",
        click: (_item, window) => print(window),
      },
    ],
  };
}
