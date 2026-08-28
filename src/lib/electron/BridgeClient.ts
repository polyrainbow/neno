/*
  RPC client for the storage bridge. Same `{id, method, args}` →
  `{id, result | error}` shape as
  src/lib/notes-worker/NotesProviderProxy.ts, but the far end is the
  Electron main process, so streams cannot be transferred and travel as
  chunks of bytes instead. There is no transfer list either: everything
  crossing the process boundary is serialized regardless.
*/

import { BridgeRequest, BridgeResponse } from "./bridgeTypes";

interface PendingCall {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
}

export default class BridgeClient {
  #port: MessagePort;
  #pendingCalls = new Map<number, PendingCall>();
  #nextId = 0;

  constructor(port: MessagePort) {
    this.#port = port;

    port.addEventListener("message", (event: MessageEvent) => {
      const data = event.data as BridgeResponse | undefined;
      if (!data || typeof data !== "object") return;
      const { id, result, error, errorCode } = data;
      if (typeof id !== "number") return;
      const pending = this.#pendingCalls.get(id);
      if (!pending) return;
      this.#pendingCalls.delete(id);
      if (typeof error === "string") {
        const err = new Error(error);
        if (errorCode) {
          // isomorphic-git branches on err.code (ENOENT, EEXIST, …).
          (err as Error & { code?: string }).code = errorCode;
        }
        pending.reject(err);
      } else {
        pending.resolve(result);
      }
    });
    /*
      A MessagePort listened to with addEventListener (as opposed to
      onmessage) must be started explicitly.
    */
    port.start();
  }

  call(method: string, args: unknown[]): Promise<unknown> {
    const id = this.#nextId++;
    const request: BridgeRequest = { id, method, args };
    return new Promise((resolve, reject) => {
      this.#pendingCalls.set(id, { resolve, reject });
      this.#port.postMessage(request);
    });
  }
}
