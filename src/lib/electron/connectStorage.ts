/*
  Requests a storage bridge for `folderPath` from the native host and
  returns the MessagePort that speaks to it.

  Electron: a MessagePort cannot travel through contextBridge, so the
  preload hands it to the page with a transferring window.postMessage;
  this helper pairs that message with the IPC request.

  Android: the page itself serves the port, forwarding to the Kotlin
  plugin (src/lib/android/AndroidBridgeHost.ts). The folder is always
  the app's own, so `folderPath` only matters on the desktop.
*/

import { STORAGE_PORT_MESSAGE } from "./bridgeTypes";
import { getBridge, isAndroid } from "./bridge";

const PORT_TIMEOUT_MS = 15_000;

function connectElectronStorage(
  folderPath: string,
): Promise<MessagePort> {
  const bridge = getBridge();

  return new Promise<MessagePort>((resolve, reject) => {
    const abortController = new AbortController();

    const timer = setTimeout(() => {
      abortController.abort();
      reject(new Error("Timed out waiting for the storage port"));
    }, PORT_TIMEOUT_MS);

    window.addEventListener("message", (event: MessageEvent) => {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type !== STORAGE_PORT_MESSAGE) return;
      const port = event.ports[0];
      if (!port) return;
      clearTimeout(timer);
      abortController.abort();
      resolve(port);
    }, { signal: abortController.signal });

    bridge.connectStorage(folderPath).catch((e: unknown) => {
      clearTimeout(timer);
      abortController.abort();
      reject(e instanceof Error ? e : new Error(String(e)));
    });
  });
}

export default async function connectStorage(
  folderPath: string,
): Promise<MessagePort> {
  if (isAndroid()) {
    const [{ connectAndroidStorage }, { getNativePlugin }] = await Promise.all([
      import("../android/AndroidBridgeHost"),
      import("../android/nativePlugin"),
    ]);
    return connectAndroidStorage(getNativePlugin());
  }

  return connectElectronStorage(folderPath);
}
