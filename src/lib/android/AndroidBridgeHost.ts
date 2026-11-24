/*
  The Android counterpart of electron/storage/bridge.ts's port dispatch.

  On the desktop, the notes worker's storage port leads straight into the
  Electron main process. On Android, native code is reachable only from
  the page (Capacitor's bridge lives on the window), so the page holds the
  far end of the worker's port and forwards each request to the Kotlin
  plugin:

    notes worker ──port2──▶ this host ──Capacitor──▶ NenoPlugin.kt
                 ◀────────           ◀─────────────

  The worker side — BridgeClient, StorageProviderProxy, GitClient — is
  the one the desktop uses, unchanged.
*/

import {
  BridgeEvent,
  BridgeRequest,
  BridgeResponse,
} from "../electron/bridgeTypes";
import { FileDiff } from "../git/types";
import { computeDiffLines } from "../git/diff";
import {
  decodeBinary,
  encodeBinary,
  FileVersions,
  NenoNativePlugin,
} from "./nativePlugin";

type NativeError = Error & { code?: string };

/** What the host needs of a port: lets the spec use a plain channel. */
type HostPort = Pick<
  MessagePort,
  "postMessage" | "addEventListener" | "start" | "close"
>;

/*
  The history view's diff. Native code only decides binary, too large or
  text and hands over both versions; the line diff with its word-level
  emphasis is computed by src/lib/git/diff.ts, the code the desktop runs,
  so the two apps never show a change differently.
*/
export function toFileDiff(versions: FileVersions): FileDiff {
  const { path, change } = versions;
  if (versions.binary) return { path, change, binary: true };
  if (versions.tooLarge) return { path, change, tooLarge: true };
  return {
    path,
    change,
    lines: computeDiffLines(versions.oldText ?? "", versions.newText ?? ""),
  };
}

async function callNative(
  plugin: NenoNativePlugin,
  method: string,
  args: unknown[],
): Promise<unknown> {
  if (method === "git.diff") {
    const { result } = await plugin.call({ method: "git.fileVersions", args });
    return (result as FileVersions[]).map(toFileDiff);
  }
  const { result } = await plugin.call({ method, args: encodeBinary(args) });
  return decodeBinary(result);
}

export async function handleRequest(
  plugin: NenoNativePlugin,
  request: BridgeRequest,
): Promise<BridgeResponse> {
  const { id, method, args } = request;
  try {
    return { id, result: await callNative(plugin, method, args ?? []) };
  } catch (e) {
    const error = e as NativeError;
    return {
      id,
      error: error?.message ?? String(e),
      /*
        Capacitor puts the code a plugin rejects with on the error.
        Callers branch on ENOENT, EEXIST, … as they would on Node's.
      */
      errorCode: typeof error?.code === "string" && error.code.length > 0
        ? error.code
        : undefined,
    };
  }
}

/**
 * Serves `port` on behalf of the native plugin until the port is closed.
 * Returns a function that stops serving.
 */
export async function serveBridge(
  plugin: NenoNativePlugin,
  port: HostPort,
): Promise<() => void> {
  port.addEventListener("message", (event: MessageEvent) => {
    const data = event.data as BridgeRequest | undefined;
    if (!data || typeof data !== "object" || typeof data.id !== "number") {
      return;
    }
    void handleRequest(plugin, data).then((response) => {
      port.postMessage(response);
    });
  });
  port.start();

  // Native speaks first, too: a pull tells the worker what to re-read.
  const handle = await plugin.addListener(
    "bridgeEvent",
    (event: BridgeEvent) => port.postMessage(event),
  );

  return () => {
    void handle.remove();
    port.close();
  };
}

let stopServing: (() => void) | null = null;

/**
 * The Android counterpart of electron/connectStorage.ts: a MessagePort
 * for the notes worker that leads to the graph folder in the app's
 * private storage.
 */
export async function connectAndroidStorage(
  plugin: NenoNativePlugin,
): Promise<MessagePort> {
  // A folder switch reconnects; the previous worker port is dead.
  stopServing?.();
  const channel = new MessageChannel();
  stopServing = await serveBridge(plugin, channel.port1);
  return channel.port2;
}
