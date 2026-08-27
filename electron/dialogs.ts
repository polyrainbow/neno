/*
  Native folder / open / save dialogs, replacing the File System Access
  API pickers the browser build used.
*/

import { BrowserWindow, dialog, ipcMain } from "electron";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  PickedFile,
  PickerFilter,
  SaveDialogOptions,
} from "../src/lib/electron/bridgeTypes";

type WriteSession = {
  fileHandle: fs.FileHandle;
  filePath: string;
};

const writeSessions = new Map<number, WriteSession>();
let nextSessionId = 1;

function getWindow(event: Electron.IpcMainInvokeEvent): BrowserWindow | null {
  return BrowserWindow.fromWebContents(event.sender);
}

function sanitizeFilters(filters: unknown): PickerFilter[] {
  if (!Array.isArray(filters)) return [];
  return filters
    .filter((filter): filter is PickerFilter =>
      Boolean(filter)
      && typeof (filter as PickerFilter).name === "string"
      && Array.isArray((filter as PickerFilter).extensions),
    )
    .map((filter): PickerFilter => ({
      name: filter.name,
      extensions: filter.extensions
        .filter((extension: unknown): extension is string =>
          typeof extension === "string",
        )
        // Electron wants extensions without the leading dot.
        .map((extension: string) => extension.replace(/^\./, "")),
    }))
    .filter((filter) => filter.extensions.length > 0);
}

async function pickFolder(
  event: Electron.IpcMainInvokeEvent,
): Promise<string | null> {
  const window = getWindow(event);
  const result = window
    ? await dialog.showOpenDialog(window, {
      properties: ["openDirectory", "createDirectory"],
    })
    : await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory"],
    });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  /*
    The folder is remembered by the renderer once the graph has actually
    opened, so a folder that fails to load is not offered again on the
    next launch.
  */
  return result.filePaths[0];
}

async function pickFilesToOpen(
  event: Electron.IpcMainInvokeEvent,
  filters: unknown,
  multiple: unknown,
): Promise<PickedFile[]> {
  const window = getWindow(event);
  const options: Electron.OpenDialogOptions = {
    properties: multiple
      ? ["openFile", "multiSelections"]
      : ["openFile"],
    filters: sanitizeFilters(filters),
  };

  const result = window
    ? await dialog.showOpenDialog(window, options)
    : await dialog.showOpenDialog(options);

  if (result.canceled) return [];

  return await Promise.all(
    result.filePaths.map(async (filePath): Promise<PickedFile> => {
      const bytes = await fs.readFile(filePath);
      return {
        name: path.basename(filePath).normalize("NFC"),
        data: bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength,
        ) as ArrayBuffer,
      };
    }),
  );
}

async function pickFileToSave(
  event: Electron.IpcMainInvokeEvent,
  options: unknown,
): Promise<number | null> {
  const window = getWindow(event);
  const { suggestedName, filters } = (options ?? {}) as SaveDialogOptions;

  const dialogOptions: Electron.SaveDialogOptions = {
    defaultPath: typeof suggestedName === "string" ? suggestedName : undefined,
    filters: sanitizeFilters(filters),
  };

  const result = window
    ? await dialog.showSaveDialog(window, dialogOptions)
    : await dialog.showSaveDialog(dialogOptions);

  if (result.canceled || !result.filePath) return null;

  const sessionId = nextSessionId++;
  writeSessions.set(sessionId, {
    fileHandle: await fs.open(result.filePath, "w"),
    filePath: result.filePath,
  });
  return sessionId;
}

async function writeChunk(
  sessionId: unknown,
  chunk: unknown,
): Promise<void> {
  const session = writeSessions.get(sessionId as number);
  if (!session) throw new Error("Unknown write session: " + sessionId);
  if (!(chunk instanceof ArrayBuffer)) {
    throw new Error("writeChunk expects an ArrayBuffer");
  }
  await session.fileHandle.write(new Uint8Array(chunk));
}

async function closeWrite(sessionId: unknown): Promise<void> {
  const session = writeSessions.get(sessionId as number);
  if (!session) return;
  writeSessions.delete(sessionId as number);
  await session.fileHandle.close();
}

async function abortWrite(sessionId: unknown): Promise<void> {
  const session = writeSessions.get(sessionId as number);
  if (!session) return;
  writeSessions.delete(sessionId as number);
  await session.fileHandle.close();
  await fs.rm(session.filePath, { force: true });
}

export function registerDialogHandlers(): void {
  ipcMain.handle("dialog:pickFolder", pickFolder);
  ipcMain.handle(
    "dialog:pickFilesToOpen",
    (event, filters, multiple) =>
      pickFilesToOpen(event, filters, multiple),
  );
  ipcMain.handle(
    "dialog:pickFileToSave",
    (event, options) => pickFileToSave(event, options),
  );
  ipcMain.handle(
    "dialog:writeChunk",
    (_event, sessionId, chunk) => writeChunk(sessionId, chunk),
  );
  ipcMain.handle(
    "dialog:closeWrite",
    (_event, sessionId) => closeWrite(sessionId),
  );
  ipcMain.handle(
    "dialog:abortWrite",
    (_event, sessionId) => abortWrite(sessionId),
  );
}
