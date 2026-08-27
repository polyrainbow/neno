/*
  Dispatches storage RPC on a MessagePortMain. The renderer asks for a
  bridge via the "storage:connect" IPC channel; main creates a
  MessageChannelMain, keeps port1 for itself and posts port2 back to the
  renderer, which forwards it into the notes worker.

  Method names are namespaced: "storage.…" hits the StorageProvider,
  "git.…" hits the isomorphic-git file system. Streams are chunked
  because a ReadableStream cannot be transferred across the
  main-process boundary.
*/

import { ipcMain, MessageChannelMain, MessagePortMain } from "electron";
import type { WebContents } from "electron";
import NodeFsStorageProvider from "./NodeFsStorageProvider";
import NodeFsGit, { isFsStat, serializeStat } from "./nodeFsGit";
import {
  BridgeRequest,
  BridgeResponse,
  OpenReadResult,
  OpenWriteResult,
  STORAGE_PORT_MESSAGE,
} from "../../src/lib/electron/bridgeTypes";

type ReadSession = {
  reader: ReadableStreamDefaultReader<Uint8Array>;
};

type WriteSession = {
  writer: WritableStreamDefaultWriter<Uint8Array>;
  /** Resolves with the number of bytes that landed on disk. */
  done: Promise<number>;
};

type ByteRangeArg = { start: number; end: number } | undefined;

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}


class StorageBridge {
  #storage: NodeFsStorageProvider;
  #git: NodeFsGit;
  #readSessions = new Map<number, ReadSession>();
  #writeSessions = new Map<number, WriteSession>();
  #nextStreamId = 1;
  #streamMethods: Record<string, (args: unknown[]) => Promise<unknown>>;
  #port: MessagePortMain | null = null;

  constructor(folderPath: string) {
    this.#storage = new NodeFsStorageProvider(folderPath);
    this.#git = new NodeFsGit(folderPath);
    this.#streamMethods = {
      openRead: (args) =>
        this.#openRead(args[0] as string, args[1] as ByteRangeArg),
      readChunk: (args) => this.#readChunk(args[0] as number),
      closeRead: (args) => this.#closeRead(args[0] as number),
      openWrite: (args) => this.#openWrite(args[0] as string),
      writeChunk: (args) =>
        this.#writeChunk(args[0] as number, args[1] as ArrayBuffer),
      closeWrite: (args) => this.#closeWrite(args[0] as number),
      abortWrite: (args) => this.#abortWrite(args[0] as number),
    };
  }

  async #openRead(
    requestPath: string,
    range: ByteRangeArg,
  ): Promise<OpenReadResult> {
    const size = await this.#storage.getObjectSize(requestPath);
    const stream = await this.#storage.getReadableStream(requestPath, range);
    const streamId = this.#nextStreamId++;
    this.#readSessions.set(streamId, { reader: stream.getReader() });
    return { streamId, size };
  }

  async #readChunk(streamId: number): Promise<ArrayBuffer | null> {
    const session = this.#readSessions.get(streamId);
    if (!session) throw new Error("Unknown read stream: " + streamId);
    const { done, value } = await session.reader.read();
    if (done || !value) {
      this.#readSessions.delete(streamId);
      return null;
    }
    return toArrayBuffer(value);
  }

  async #closeRead(streamId: number): Promise<void> {
    const session = this.#readSessions.get(streamId);
    if (!session) return;
    this.#readSessions.delete(streamId);
    await session.reader.cancel().catch(() => {
      // Already closed — nothing to do.
    });
  }

  async #openWrite(requestPath: string): Promise<OpenWriteResult> {
    const streamId = this.#nextStreamId++;
    /*
      writeObjectFromReadable consumes a ReadableStream, so we hand it
      one end of a TransformStream and push the incoming chunks into the
      other end as they arrive over the port. The highWaterMark of 1
      keeps backpressure meaningful for large attachments.
    */
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>(
      {},
      { highWaterMark: 1 },
      { highWaterMark: 1 },
    );
    const done = this.#storage.writeObjectFromReadable(requestPath, readable);
    // Keep the rejection from surfacing as unhandled; it is reported by
    // closeWrite / abortWrite instead.
    done.catch(() => { /* reported by closeWrite */ });
    this.#writeSessions.set(streamId, {
      writer: writable.getWriter(),
      done,
    });
    return { streamId };
  }

  async #writeChunk(streamId: number, chunk: ArrayBuffer): Promise<void> {
    const session = this.#writeSessions.get(streamId);
    if (!session) throw new Error("Unknown write stream: " + streamId);
    await session.writer.ready;
    await session.writer.write(new Uint8Array(chunk));
  }

  async #closeWrite(streamId: number): Promise<number> {
    const session = this.#writeSessions.get(streamId);
    if (!session) throw new Error("Unknown write stream: " + streamId);
    this.#writeSessions.delete(streamId);
    await session.writer.close();
    return await session.done;
  }

  async #abortWrite(streamId: number): Promise<void> {
    const session = this.#writeSessions.get(streamId);
    if (!session) return;
    this.#writeSessions.delete(streamId);
    await session.writer.abort(new Error("Aborted")).catch(() => {
      // Already closed.
    });
    await session.done.catch(() => {
      // Expected after an abort.
    });
  }

  #callOn(
    target: object,
    name: string,
    args: unknown[],
  ): Promise<unknown> {
    const fn = (target as unknown as Record<string, unknown>)[name];
    if (typeof fn !== "function") {
      throw new Error("Unknown bridge method: " + name);
    }
    return (fn as (...a: unknown[]) => Promise<unknown>).apply(target, args);
  }

  async call(method: string, args: unknown[]): Promise<unknown> {
    if (method.startsWith("storage.")) {
      const name = method.slice("storage.".length);
      const streamMethod = this.#streamMethods[name];
      if (streamMethod) {
        return await streamMethod(args);
      }
      return await this.#callOn(this.#storage, name, args);
    }

    if (method.startsWith("git.")) {
      const name = method.slice("git.".length);
      const result = await this.#callOn(this.#git, name, args);
      // readFile hands back bytes; the proxy expects an ArrayBuffer.
      if (result instanceof Uint8Array) {
        return toArrayBuffer(result);
      }
      // A stat's predicates cannot survive a structured clone.
      if (isFsStat(result)) {
        return serializeStat(result);
      }
      return result;
    }

    throw new Error("Unknown bridge method: " + method);
  }

  adoptPort(port: MessagePortMain): void {
    this.#port = port;
  }

  dispose(): void {
    for (const streamId of [...this.#readSessions.keys()]) {
      void this.#closeRead(streamId);
    }
    for (const streamId of [...this.#writeSessions.keys()]) {
      void this.#abortWrite(streamId);
    }
    this.#port?.close();
    this.#port = null;
  }
}


function attachDispatch(port: MessagePortMain, bridge: StorageBridge): void {
  port.on("message", async (event) => {
    const data = event.data as BridgeRequest | undefined;
    if (!data || typeof data !== "object" || typeof data.id !== "number") {
      return;
    }
    const { id, method, args } = data;
    try {
      const result = await bridge.call(method, args ?? []);
      /*
        No transfer list: a MessagePortMain can only transfer
        MessagePorts, and an ArrayBuffer crossing the process boundary is
        serialized either way.
      */
      const response: BridgeResponse = { id, result };
      port.postMessage(response);
    } catch (e: unknown) {
      const response: BridgeResponse = {
        id,
        error: e instanceof Error ? e.message : String(e),
        errorCode: (e as { code?: string })?.code,
      };
      port.postMessage(response);
    }
  });
  port.start();
}


const bridgesByWebContents = new Map<number, StorageBridge>();


export function registerStorageBridge(): void {
  ipcMain.handle(
    "storage:connect",
    async (event, folderPath: unknown): Promise<void> => {
      if (typeof folderPath !== "string" || folderPath.length === 0) {
        throw new Error("connectStorage requires an absolute folder path");
      }

      const sender = event.sender as WebContents;
      const previous = bridgesByWebContents.get(sender.id);
      if (previous) {
        previous.dispose();
      }

      const bridge = new StorageBridge(folderPath);
      bridgesByWebContents.set(sender.id, bridge);

      const { port1, port2 } = new MessageChannelMain();
      attachDispatch(port1, bridge);
      bridge.adoptPort(port1);
      sender.postMessage(STORAGE_PORT_MESSAGE, null, [port2]);
    },
  );
}


export function disposeStorageBridges(): void {
  for (const bridge of bridgesByWebContents.values()) {
    bridge.dispose();
  }
  bridgesByWebContents.clear();
}
