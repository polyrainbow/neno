/*
  The `window.neno` surface inside the Android app — what
  electron/preload.ts is on the desktop. Installed by main.tsx before
  React renders, and only inside the Capacitor shell, so neither the
  desktop app nor the browser loads this chunk.

  The graph is not a folder the user picks: it lives in the app's
  private storage (Context.filesDir/graph), which no other app, the
  Files app or USB access can see. pickFolder() creates it,
  getLastFolder() reports it once it exists.
*/

import { App } from "@capacitor/app";
import { NenoBridge, PickedFile, PickerFilter, SaveDialogOptions }
  from "../electron/bridgeTypes";
import { SyncStatus } from "../git/types";
import { canGoBack } from "../navigation";
import MimeTypes from "../MimeTypes";
import { getExtensionFromFilename } from "../notes/utils";
import {
  bytesToBase64,
  getNativePlugin,
  NenoNativePlugin,
} from "./nativePlugin";

/*
  The system file picker. A plain <input type="file"> is enough:
  Capacitor's WebChromeClient answers it with the Storage Access
  Framework. No `accept` attribute — Android turns accept types into MIME
  types, and an extension like ".subtext" would match nothing at all.
*/
export function pickFilesWithInput(
  multiple: boolean,
): Promise<PickedFile[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    input.addEventListener("change", () => {
      const files = Array.from(input.files ?? []);
      Promise.all(files.map(async (file) => ({
        name: file.name,
        data: await file.arrayBuffer(),
      }))).then(resolve, reject);
    });
    input.addEventListener("cancel", () => resolve([]));
    input.click();
  });
}

function mimeTypeFor(filename: string | undefined): string {
  const extension = filename ? getExtensionFromFilename(filename) : null;
  return (extension && MimeTypes.get(extension.toLowerCase()))
    || "application/octet-stream";
}

/*
  Leaving the first page of the history puts the app in the background,
  the way the back button leaves any Android app; everything else goes
  through useHistoryNavigation, which asks before discarding unsaved
  changes.
*/
function onBackButton(listener: (command: "back") => void): () => void {
  const handle = App.addListener("backButton", () => {
    if (canGoBack()) {
      listener("back");
    } else {
      void App.minimizeApp();
    }
  });
  return () => {
    void handle.then((h) => h.remove());
  };
}

export function createAndroidBridge(
  plugin: NenoNativePlugin = getNativePlugin(),
): NenoBridge {
  return {
    platform: "android",

    pickFolder: async () => (await plugin.createGraph()).path,

    getLastFolder: async () => {
      const { path, exists } = await plugin.getGraphInfo();
      return exists ? path : null;
    },

    // There is only the one folder.
    setLastFolder: async () => undefined,

    pickFilesToOpen: (_filters: PickerFilter[], multiple: boolean) =>
      pickFilesWithInput(multiple),

    pickFileToSave: async (options: SaveDialogOptions) => {
      const suggestedName = options.suggestedName ?? "untitled";
      const { sessionId } = await plugin.pickSaveTarget({
        suggestedName,
        mimeType: mimeTypeFor(suggestedName),
      });
      return sessionId;
    },

    writeChunk: (sessionId: number, chunk: ArrayBuffer) =>
      plugin.saveChunk({
        sessionId,
        data: bytesToBase64(new Uint8Array(chunk)),
      }),

    closeWrite: (sessionId: number) => plugin.closeSave({ sessionId }),

    abortWrite: (sessionId: number) => plugin.abortSave({ sessionId }),

    /*
      Never called on Android: connectStorage() hands the worker a port
      served by AndroidBridgeHost instead.
    */
    connectStorage: async () => {
      throw new Error("Use connectStorage() from src/lib/electron");
    },

    setUnsavedChanges: (value: boolean) =>
      plugin.setUnsavedChanges({ value }),

    // No menu bar, so no find commands; the find bar is desktop-only.
    onFindCommand: () => () => undefined,

    onHistoryCommand: onBackButton,

    getSyncStatus: async () => (await plugin.getSyncStatus()).status,

    setAutoSync: async (enabled: boolean) =>
      (await plugin.setAutoSync({ enabled })).status,

    syncNow: () => plugin.syncNow(),

    onSyncStatus: (listener: (status: SyncStatus | null) => void) => {
      const handle = plugin.addListener(
        "syncStatus",
        (event) => listener(event.status),
      );
      return () => {
        void handle.then((h) => h.remove());
      };
    },
  };
}

