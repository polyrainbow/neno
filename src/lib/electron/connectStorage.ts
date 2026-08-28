/*
  Requests a storage bridge for `folderPath` from the Electron main
  process and returns the MessagePort that speaks to it.

  A MessagePort cannot travel through contextBridge, so the preload hands
  it to the page with a transferring window.postMessage; this helper
  pairs that message with the IPC request.
*/

import { STORAGE_PORT_MESSAGE } from "./bridgeTypes";
import { getBridge } from "./bridge";

const PORT_TIMEOUT_MS = 15_000;

export default function connectStorage(
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
