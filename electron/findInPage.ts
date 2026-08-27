/*
  Find-on-page for the renderer.

  Chromium's own find bar is browser UI that Electron does not ship, so
  Cmd-F does nothing on its own. What Electron does expose is the
  underlying search: webContents.findInPage() highlights and scrolls to
  matches, and reports progress on the "found-in-page" event. The bar
  itself is a React component (src/components/FindBar.tsx); this module
  is the plumbing between the two.

  The Edit menu owns the accelerators rather than a renderer keydown
  listener: a menu accelerator fires even when focus sits in a native
  sub-view, and it makes the feature discoverable in the menu.
*/

import { BrowserWindow, ipcMain } from "electron";
import {
  FIND_COMMAND_MESSAGE,
  FIND_RESULT_MESSAGE,
  FindCommand,
  FindQuery,
} from "../src/lib/electron/bridgeTypes";

/*
  A "found-in-page" result carries the requestId of the search it belongs
  to, and results keep streaming while Chromium walks the document. The
  renderer drops stale ones by comparing ids, so nothing is tracked here.
*/
export function registerFindHandlers(): void {
  ipcMain.handle("find:start", (event, query: FindQuery) => {
    const { text, forward, newSession } = query;
    if (text.length === 0) {
      event.sender.stopFindInPage("clearSelection");
      return null;
    }
    // Electron's findNext is "begin a new session" — see FindQuery.
    return event.sender.findInPage(text, { forward, findNext: newSession });
  });

  ipcMain.handle("find:stop", (event) => {
    event.sender.stopFindInPage("clearSelection");
  });
}

/*
  Wired per window, because "found-in-page" is a webContents event and
  the listener has to be attached to the contents that will emit it.
*/
export function forwardFindResults(window: BrowserWindow): void {
  window.webContents.on("found-in-page", (_event, result) => {
    if (window.isDestroyed()) return;
    window.webContents.send(FIND_RESULT_MESSAGE, {
      requestId: result.requestId,
      matches: result.matches,
      activeMatchOrdinal: result.activeMatchOrdinal,
    });
  });
}

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
