/*
  Dispatches storage RPC on a MessagePortMain. The renderer asks for a
  bridge via the "storage:connect" IPC channel; main creates a
  MessageChannelMain, keeps port1 for itself and posts port2 back to the
  renderer, which forwards it into the notes worker.

  Method names are namespaced: "storage.…" hits the StorageProvider,
  "git.…" the folder's repository. Streams are chunked because a
  ReadableStream cannot be transferred across the main-process boundary.

  Every write to the folder takes the repository's worktree lock, which
  a pull's rebase holds while it rewrites the working tree.
*/

import {
  BrowserWindow,
  ipcMain,
  MessageChannelMain,
  MessagePortMain,
} from "electron";
import type { IpcMainInvokeEvent, WebContents } from "electron";
import NodeFsStorageProvider from "./NodeFsStorageProvider";
import GitRepo from "../git/GitRepo";
import GitSync from "../git/GitSync";
import { findGit } from "../git/runGit";
import {
  hasUnsavedChanges,
  onUnsavedChangesCleared,
} from "../unsavedChanges";
import {
  BridgeEvent,
  BridgeRequest,
  BridgeResponse,
  OpenReadResult,
  OpenWriteResult,
  STORAGE_PORT_MESSAGE,
  SYNC_STATUS_MESSAGE,
} from "../../src/lib/electron/bridgeTypes";
import {
  CommitHistoryOptions,
  FlushChanges,
  GitAuthor,
  SyncStatus,
} from "../../src/lib/git/types";

type ReadSession = {
  reader: ReadableStreamDefaultReader<Uint8Array>;
};

type WriteSession = {
  writer: WritableStreamDefaultWriter<Uint8Array>;
  /** Resolves with the number of bytes that landed on disk. */
  done: Promise<number>;
  /** Gives the worktree lock back; a streamed write holds it throughout. */
  release: () => void;
};

/* StorageProvider methods that change the folder. */
const WRITING_METHODS = new Set([
  "writeObject",
  "removeObject",
  "renameObject",
]);

const GIT_MISSING_MESSAGE = "Git is not installed. Install Apple's "
  + "Command Line Tools (xcode-select --install) and restart NENO.";

type ByteRangeArg = { start: number; end: number } | undefined;

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}


class StorageBridge {
  #folderPath: string;
  #storage: NodeFsStorageProvider;
  /* Null when no usable git is installed. */
  #sync: Promise<GitSync | null>;
  #readSessions = new Map<number, ReadSession>();
  #writeSessions = new Map<number, WriteSession>();
  #nextStreamId = 1;
  #streamMethods: Record<string, (args: unknown[]) => Promise<unknown>>;
  #gitMethods: Record<string, (args: unknown[]) => Promise<unknown>>;
  #port: MessagePortMain | null = null;
  #sender: WebContents;
  #cleanups: (() => void)[] = [];
  #disposal: Promise<void> | null = null;

  constructor(folderPath: string, sender: WebContents) {
    this.#folderPath = folderPath;
    this.#sender = sender;
    this.#storage = new NodeFsStorageProvider(folderPath);
    this.#sync = this.#createSync();
    // Replaces whatever the renderer still shows for the previous folder.
    void this.#sync.then((sync) => {
      if (!sender.isDestroyed()) {
        sender.send(SYNC_STATUS_MESSAGE, sync?.getStatus() ?? null);
      }
    }, () => {});
    this.#gitMethods = {
      hasRepo: () => this.#hasRepo(),
      setAuthor: async (args) => {
        (await this.#sync)?.setAuthor(args[0] as GitAuthor);
      },
      init: (args) => this.#initRepo(args[0] as GitAuthor),
      commit: (args) => this.#commit(
        args[0] as FlushChanges,
        args[1] as GitAuthor,
      ),
      log: async (args) =>
        (await this.#requireSync()).repo.log(args[0] as CommitHistoryOptions),
      diff: async (args) =>
        (await this.#requireSync()).repo.diff(args[0] as string),
    };
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

  async #createSync(): Promise<GitSync | null> {
    const gitPath = await findGit();
    if (!gitPath) return null;

    const sender = this.#sender;
    const window = BrowserWindow.fromWebContents(sender);
    const sync = new GitSync({
      repo: new GitRepo({ dir: this.#folderPath, gitPath }),
      onStatus: (status) => {
        if (!sender.isDestroyed()) {
          sender.send(SYNC_STATUS_MESSAGE, status);
        }
      },
      onPathsChanged: (paths) => {
        const event: BridgeEvent = { event: "pathsChanged", paths };
        this.#port?.postMessage(event);
      },
      isEditorDirty: () => window !== null && hasUnsavedChanges(window.id),
    });

    if (window) {
      const onFocus = () => sync.windowFocused();
      const onBlur = () => sync.windowBlurred();
      window.on("focus", onFocus);
      window.on("blur", onBlur);
      this.#cleanups.push(() => {
        window.off("focus", onFocus);
        window.off("blur", onBlur);
      });
    }
    this.#cleanups.push(onUnsavedChangesCleared((windowId) => {
      if (windowId === window?.id) sync.editorBecameClean();
    }));

    await sync.start();
    if (window?.isFocused()) sync.windowFocused();
    return sync;
  }

  async #requireSync(): Promise<GitSync> {
    const sync = await this.#sync;
    if (!sync) throw new Error(GIT_MISSING_MESSAGE);
    return sync;
  }

  /** Runs a write to the folder under the worktree lock. */
  async #locked<T>(fn: () => Promise<T>): Promise<T> {
    const sync = await this.#sync;
    return sync ? sync.withWorktreeLock(fn) : fn();
  }

  async #hasRepo(): Promise<boolean> {
    const sync = await this.#sync;
    return sync !== null && await sync.repo.exists();
  }

  async #initRepo(author: GitAuthor): Promise<void> {
    const sync = await this.#requireSync();
    await sync.withWorktreeLock(() => sync.repo.init(author));
  }

  async #commit(
    changes: FlushChanges,
    author: GitAuthor,
  ): Promise<string | null> {
    const sync = await this.#requireSync();
    return sync.commit(changes, author);
  }

  async getSyncStatus(): Promise<SyncStatus | null> {
    const sync = await this.#sync;
    return sync ? sync.getStatus() : null;
  }

  async setAutoSync(enabled: boolean): Promise<SyncStatus> {
    return (await this.#requireSync()).setAutoSync(enabled);
  }

  async syncNow(): Promise<void> {
    const sync = await this.#sync;
    await sync?.syncNow();
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

  /*
    Takes the worktree lock and hands back the function that releases
    it, for a write that spans several bridge calls.
  */
  async #holdLock(): Promise<() => void> {
    let release!: () => void;
    const released = new Promise<void>((resolve) => {
      release = resolve;
    });
    await new Promise<void>((acquired) => {
      void this.#locked(async () => {
        acquired();
        await released;
      });
    });
    return release;
  }

  async #openWrite(requestPath: string): Promise<OpenWriteResult> {
    const release = await this.#holdLock();
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
      release,
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
    try {
      await session.writer.close();
      return await session.done;
    } finally {
      session.release();
    }
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
    session.release();
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
      if (WRITING_METHODS.has(name)) {
        return await this.#locked(
          () => this.#callOn(this.#storage, name, args),
        );
      }
      return await this.#callOn(this.#storage, name, args);
    }

    if (method.startsWith("git.")) {
      const gitMethod = this.#gitMethods[method.slice("git.".length)];
      if (!gitMethod) {
        throw new Error("Unknown bridge method: " + method);
      }
      return await gitMethod(args);
    }

    throw new Error("Unknown bridge method: " + method);
  }

  adoptPort(port: MessagePortMain): void {
    this.#port = port;
  }

  /*
    Kills any fetch or push, and resolves once a local step that had
    already started — a commit, a rebase — is over, so the repository is
    never left halfway through one.
  */
  dispose(): Promise<void> {
    this.#disposal ??= (async () => {
      for (const cleanup of this.#cleanups) cleanup();
      for (const streamId of [...this.#readSessions.keys()]) {
        void this.#closeRead(streamId);
      }
      for (const streamId of [...this.#writeSessions.keys()]) {
        void this.#abortWrite(streamId);
      }
      this.#port?.close();
      this.#port = null;
      const sync = await this.#sync.catch(() => null);
      await sync?.dispose();
    })();
    return this.#disposal;
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
const disposals = new Set<Promise<void>>();

function dispose(bridge: StorageBridge): void {
  const disposal = bridge.dispose();
  disposals.add(disposal);
  void disposal.finally(() => disposals.delete(disposal));
}

function getBridgeFor(event: IpcMainInvokeEvent): StorageBridge | null {
  return bridgesByWebContents.get(event.sender.id) ?? null;
}


export function registerStorageBridge(): void {
  ipcMain.handle("git:getSyncStatus", async (event) => {
    return await getBridgeFor(event)?.getSyncStatus() ?? null;
  });

  ipcMain.handle("git:setAutoSync", async (event, enabled: unknown) => {
    const bridge = getBridgeFor(event);
    if (!bridge) throw new Error("No folder is open");
    return bridge.setAutoSync(enabled === true);
  });

  ipcMain.handle("git:syncNow", async (event) => {
    await getBridgeFor(event)?.syncNow();
  });

  ipcMain.handle(
    "storage:connect",
    async (event, folderPath: unknown): Promise<void> => {
      if (typeof folderPath !== "string" || folderPath.length === 0) {
        throw new Error("connectStorage requires an absolute folder path");
      }

      const sender = event.sender as WebContents;
      /*
        Waits for the old folder's sync to stop: reopening the same folder
        must not leave two instances, with two locks, on one repository.
        It never waits on the network — dispose() kills fetch and push.
      */
      const previous = bridgesByWebContents.get(sender.id);
      if (previous) {
        bridgesByWebContents.delete(sender.id);
        dispose(previous);
        await previous.dispose();
      }

      const bridge = new StorageBridge(folderPath, sender);
      bridgesByWebContents.set(sender.id, bridge);

      const { port1, port2 } = new MessageChannelMain();
      attachDispatch(port1, bridge);
      bridge.adoptPort(port1);
      sender.postMessage(STORAGE_PORT_MESSAGE, null, [port2]);
    },
  );
}


/* Resolves once every bridge, including ones disposed earlier, is done. */
export async function disposeStorageBridges(): Promise<void> {
  for (const bridge of bridgesByWebContents.values()) {
    dispose(bridge);
  }
  bridgesByWebContents.clear();
  await Promise.all(disposals);
}
