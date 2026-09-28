/*
  The Go menu: Back and Forward.

  Electron ships none of the browser UI that used to move through the
  history — no toolbar buttons, no Cmd-[ / Cmd-], no mouse or trackpad
  navigation — so NENO brings its own. The header buttons, the mouse
  side buttons and the two-finger swipe live in the renderer
  (src/components/HistoryNavigation.tsx); this module adds the keyboard
  shortcuts, which belong on the menu so they fire regardless of focus.

  The menu only forwards the command. The renderer traverses, because a
  note with unsaved changes must be able to ask before it is left —
  webContents.navigationHistory.goBack() would skip that question.

  The accelerators are Safari's and Finder's. Being menu accelerators,
  they pre-empt Monaco's Cmd-[ / Cmd-] (outdent / indent) in the scripts
  view; Shift-Tab and Tab still do the same there.
*/

import { BrowserWindow } from "electron";
import {
  HISTORY_COMMAND_MESSAGE,
  HistoryCommand,
} from "../src/lib/electron/bridgeTypes";

// See sendFindCommand in findMenu.ts for why the window is narrowed.
function sendHistoryCommand(
  window: Electron.BaseWindow | undefined,
  command: HistoryCommand,
): void {
  const target = window instanceof BrowserWindow
    ? window
    : BrowserWindow.getFocusedWindow();
  if (!target || target.isDestroyed()) return;
  target.webContents.send(HISTORY_COMMAND_MESSAGE, command);
}

export function buildHistoryMenu(): Electron.MenuItemConstructorOptions {
  return {
    label: "Go",
    submenu: [
      {
        label: "Back",
        accelerator: "CmdOrCtrl+[",
        click: (_item, window) => sendHistoryCommand(window, "back"),
      },
      {
        label: "Forward",
        accelerator: "CmdOrCtrl+]",
        click: (_item, window) => sendHistoryCommand(window, "forward"),
      },
    ],
  };
}
