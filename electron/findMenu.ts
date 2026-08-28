/*
  The Edit menu's find items.

  Chromium's own find bar is browser UI that Electron does not ship, so
  Cmd-F does nothing on its own. This module supplies the menu items and
  forwards what the user picked to the renderer, where the find bar
  (src/components/FindBar.tsx) does the searching.

  The main process no longer runs the search itself. webContents
  .findInPage() searches everything the window renders — sidebar, header,
  navigation rail, the find bar's own input — and takes focus by
  selecting each match, neither of which is wanted for a bar whose job
  is the note in front of the user. The search now lives entirely in the
  renderer and covers the active editor only.

  The Edit menu owns the accelerators rather than a renderer keydown
  listener: a menu accelerator fires even when focus sits in a native
  sub-view, and it makes the feature discoverable in the menu.
*/

import { BrowserWindow } from "electron";
import {
  FIND_COMMAND_MESSAGE,
  FindCommand,
} from "../src/lib/electron/bridgeTypes";

/*
  A menu click hands over a BaseWindow, which has no webContents of its
  own; NENO only ever has BrowserWindows, so narrow and fall back to the
  focused one.
*/
function sendFindCommand(
  window: Electron.BaseWindow | undefined,
  command: FindCommand,
): void {
  const target = window instanceof BrowserWindow
    ? window
    : BrowserWindow.getFocusedWindow();
  if (!target || target.isDestroyed()) return;
  target.webContents.send(FIND_COMMAND_MESSAGE, command);
}

export function buildFindMenuItems(): Electron.MenuItemConstructorOptions[] {
  return [
    { type: "separator" },
    {
      label: "Find…",
      accelerator: "CmdOrCtrl+F",
      click: (_item, window) => sendFindCommand(window, "open"),
    },
    {
      label: "Find Next",
      accelerator: "CmdOrCtrl+G",
      click: (_item, window) => sendFindCommand(window, "next"),
    },
    {
      label: "Find Previous",
      accelerator: "Shift+CmdOrCtrl+G",
      click: (_item, window) => sendFindCommand(window, "previous"),
    },
  ];
}
