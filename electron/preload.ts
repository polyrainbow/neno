/*
  The only thing that crosses the context bridge. Every entry is a thin
  wrapper around an IPC channel; no Node API and no ipcRenderer itself
  is ever exposed to the page.

  This file must import nothing but "electron". A sandboxed preload
  cannot require() a sibling file, so any module shared with
  electron/main.ts would be split into a chunk that the preload fails to
  load — silently, leaving window.neno undefined. vite.electron.config.ts
  fails the build if that ever happens; the duplicated constant below is
  the price.
*/

import { contextBridge, ipcRenderer } from "electron";

// Keep in sync with STORAGE_PORT_MESSAGE in
// src/lib/electron/bridgeTypes.ts.
const STORAGE_PORT_MESSAGE = "neno:storage-port";
// Likewise FIND_COMMAND_MESSAGE.
const FIND_COMMAND_MESSAGE = "neno:find-command";

type FindCommand = "open" | "next" | "previous";

/*
  ipcRenderer itself must not cross the bridge, so subscriptions are
  handed over as plain functions that close over it and return their own
  unsubscribe.
*/
function subscribe<T>(
  channel: string,
  listener: (payload: T) => void,
): () => void {
  const handler = (_event: unknown, payload: T) => listener(payload);
  ipcRenderer.on(channel, handler);
  return () => {
    ipcRenderer.off(channel, handler);
  };
}

const neno = {
  pickFolder: (): Promise<string | null> =>
    ipcRenderer.invoke("dialog:pickFolder"),

  getLastFolder: (): Promise<string | null> =>
    ipcRenderer.invoke("config:getLastFolder"),

  setLastFolder: (folderPath: string | null): Promise<void> =>
    ipcRenderer.invoke("config:setLastFolder", folderPath),

  pickFilesToOpen: (
    filters: { name: string; extensions: string[] }[],
    multiple: boolean,
  ): Promise<{ name: string; data: ArrayBuffer }[]> =>
    ipcRenderer.invoke("dialog:pickFilesToOpen", filters, multiple),

  pickFileToSave: (
    options: {
      suggestedName?: string;
      filters?: { name: string; extensions: string[] }[];
    },
  ): Promise<number | null> =>
    ipcRenderer.invoke("dialog:pickFileToSave", options),

  writeChunk: (sessionId: number, chunk: ArrayBuffer): Promise<void> =>
    ipcRenderer.invoke("dialog:writeChunk", sessionId, chunk),

  closeWrite: (sessionId: number): Promise<void> =>
    ipcRenderer.invoke("dialog:closeWrite", sessionId),

  abortWrite: (sessionId: number): Promise<void> =>
    ipcRenderer.invoke("dialog:abortWrite", sessionId),

  connectStorage: (folderPath: string): Promise<void> =>
    ipcRenderer.invoke("storage:connect", folderPath),

  setUnsavedChanges: (hasUnsavedChanges: boolean): Promise<void> =>
    ipcRenderer.invoke("window:setUnsavedChanges", hasUnsavedChanges),

  onFindCommand: (listener: (command: FindCommand) => void): () => void =>
    subscribe(FIND_COMMAND_MESSAGE, listener),
};

contextBridge.exposeInMainWorld("neno", neno);

/*
  A MessagePort cannot travel through contextBridge, but the preload
  shares the page's window object, so the port is handed to the main
  world with a transferring window.postMessage.
*/
ipcRenderer.on(STORAGE_PORT_MESSAGE, (event) => {
  const port = event.ports[0];
  if (!port) return;
  window.postMessage({ type: STORAGE_PORT_MESSAGE }, "*", [port]);
});
