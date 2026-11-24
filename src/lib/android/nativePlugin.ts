/*
  The Kotlin side of the Android app: one Capacitor plugin, "Neno"
  (android/app/src/main/java/io/github/polyrainbow/neno/NenoPlugin.kt).

  `call` carries the storage bridge's own `{method, args}` requests
  unchanged, so the notes worker speaks the same protocol to Android
  that it speaks to the Electron main process. Everything else is the
  rest of the NenoBridge surface: the graph folder, the save dialog and
  sync.

  Capacitor serializes calls as JSON, so binary data travels as
  `{ $b64: "…" }` — see encodeBinary/decodeBinary.
*/

import { registerPlugin } from "@capacitor/core";
import type { PluginListenerHandle } from "@capacitor/core";
import { SyncStatus } from "../git/types";
import { BridgeEvent } from "../electron/bridgeTypes";

export type GraphInfo = {
  /** Absolute path of the graph folder in the app's private storage. */
  path: string;
  /** Whether the folder has been set up. */
  exists: boolean;
};

/** Both versions of one changed file; the line diff is computed here. */
export type FileVersions = {
  path: string;
  change: "add" | "modify" | "delete";
  binary?: boolean;
  tooLarge?: boolean;
  oldText?: string;
  newText?: string;
};

/** What stands between this device and a remote. */
export type ProbeResult
  = | { state: "ok" }
  | { state: "unknownHost"; host: string; fingerprint: string }
  | { state: "hostKeyChanged"; host: string }
  | { state: "auth" | "offline" | "error"; message: string };

export type CloneProgress = {
  task: string;
  done: number;
  total: number;
};

export interface NenoNativePlugin {
  call(options: {
    method: string;
    args: unknown[];
  }): Promise<{ result?: unknown }>;
  getGraphInfo(): Promise<GraphInfo>;
  createGraph(): Promise<GraphInfo>;
  setUnsavedChanges(options: { value: boolean }): Promise<void>;
  /** Resolves to null when the user cancels the system save dialog. */
  pickSaveTarget(options: {
    suggestedName: string;
    mimeType: string;
  }): Promise<{ sessionId: number | null }>;
  saveChunk(options: { sessionId: number; data: string }): Promise<void>;
  closeSave(options: { sessionId: number }): Promise<void>;
  abortSave(options: { sessionId: number }): Promise<void>;
  getSyncStatus(): Promise<{ status: SyncStatus | null }>;
  setAutoSync(options: { enabled: boolean }): Promise<{ status: SyncStatus }>;
  syncNow(): Promise<void>;
  /**
   * This device's SSH public key, made on first use. `replaced`: the
   * app was reinstalled keeping its data, so the key is a new one the
   * server does not know yet.
   */
  getPublicKey(): Promise<{ publicKey: string; replaced: boolean }>;
  probeRemote(options: { url: string }): Promise<ProbeResult>;
  /** Trusts the key the host presented, if it has this fingerprint. */
  trustHost(options: { url: string; fingerprint: string }): Promise<void>;
  /** Clones the remote as this device's graph, with auto-sync on. */
  cloneGraph(options: { url: string }): Promise<GraphInfo>;
  addListener(
    eventName: "cloneProgress",
    listener: (event: CloneProgress) => void,
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: "bridgeEvent",
    listener: (event: BridgeEvent) => void,
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: "syncStatus",
    listener: (event: { status: SyncStatus | null }) => void,
  ): Promise<PluginListenerHandle>;
}

let plugin: NenoNativePlugin | null = null;

export function getNativePlugin(): NenoNativePlugin {
  plugin ??= registerPlugin<NenoNativePlugin>("Neno");
  return plugin;
}


export type EncodedBinary = { $b64: string };

const isEncodedBinary = (value: unknown): value is EncodedBinary => {
  return typeof value === "object"
    && value !== null
    && typeof (value as EncodedBinary).$b64 === "string";
};

/*
  btoa() takes a binary string; building it in slices keeps
  String.fromCharCode's argument list well below the engine's limit.
*/
export function bytesToBase64(bytes: Uint8Array): string {
  const SLICE = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += SLICE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + SLICE));
  }
  return btoa(binary);
}

export function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Replaces every ArrayBuffer in a list of call arguments with base64. */
export function encodeBinary(args: unknown[]): unknown[] {
  return args.map((arg) => {
    if (arg instanceof ArrayBuffer) {
      return { $b64: bytesToBase64(new Uint8Array(arg)) };
    }
    if (ArrayBuffer.isView(arg)) {
      return {
        $b64: bytesToBase64(
          new Uint8Array(arg.buffer, arg.byteOffset, arg.byteLength),
        ),
      };
    }
    return arg;
  });
}

/** Turns a `{ $b64 }` result back into an ArrayBuffer. */
export function decodeBinary(result: unknown): unknown {
  return isEncodedBinary(result)
    ? base64ToBytes(result.$b64).buffer
    : result;
}
