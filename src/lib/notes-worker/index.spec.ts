import {
  describe, it, expect, beforeEach, vi,
} from "vitest";

/*
  Drives the worker module through the worker global, which is the single
  window's port now that this is a dedicated Worker rather than a
  SharedWorker. Script workers still attach extra MessagePorts via the
  `addPort` action, and those are exercised here too.

  Heavy dependencies (NotesProvider, FileSystemAccessAPIStorageProvider,
  FileSystemAccessFs, git) are mocked because they need a real
  FileSystemDirectoryHandle and isomorphic-git's node-fs adapter,
  neither of which is available in jsdom.
*/

vi.mock("../FileSystemAccessAPIStorageProvider", () => ({
  default: class {
    constructor() { /* noop */ }
    async writeObject() { /* noop */ }
  },
}));

vi.mock("../notes", () => ({
  default: class {
    async put() { return { meta: { slug: "x" } }; }
  },
}));

vi.mock("./FileSystemAccessFs", () => ({
  default: class {
    constructor() { /* noop */ }
  },
}));

vi.mock("./git", () => ({
  hasExistingRepo: async () => false,
  ensureRepo: async () => { /* noop */ },
  commitChanged: async () => { /* noop */ },
  getCommitHistory: async () => [],
  getCommitDiff: async () => [],
}));


type WorkerHarness = {
  /** Port the test writes to; the worker sees the other end. */
  window: MessagePort;
};

/*
  The worker registers itself on the worker global, so the global's
  addEventListener/postMessage are redirected to one end of a
  MessageChannel and the test drives the protocol from the other end.
  The redirection stays installed for the whole file and follows
  `workerSide`, which each reload replaces.
*/
let workerSide: MessagePort | null = null;
let redirectionInstalled = false;

function installGlobalRedirection(): void {
  if (redirectionInstalled) return;
  redirectionInstalled = true;

  globalThis.addEventListener = ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions,
  ) => {
    if (type !== "message" || !workerSide) return;
    workerSide.addEventListener(
      "message",
      listener as EventListener,
      options,
    );
    workerSide.start();
  }) as typeof globalThis.addEventListener;

  (globalThis as unknown as { postMessage: unknown }).postMessage = (
    message: unknown,
    transfer?: Transferable[],
  ) => {
    workerSide?.postMessage(message, (transfer ?? []) as Transferable[]);
  };
}

async function loadFreshWorker(): Promise<WorkerHarness> {
  vi.resetModules();
  installGlobalRedirection();

  const channel = new MessageChannel();
  workerSide = channel.port2;

  await import("./index");

  channel.port1.start();
  return { window: channel.port1 };
}


function fakeFolderHandle(name: string): FileSystemDirectoryHandle {
  return {
    name,
    kind: "directory",
  } as unknown as FileSystemDirectoryHandle;
}


function expectMessage<T = unknown>(
  port: MessagePort,
  predicate: (data: unknown) => boolean,
  timeoutMs = 200,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const ac = new AbortController();
    const timer = setTimeout(() => {
      ac.abort();
      reject(new Error("Timed out waiting for message"));
    }, timeoutMs);
    port.addEventListener("message", (e: MessageEvent) => {
      if (!predicate(e.data)) return;
      clearTimeout(timer);
      ac.abort();
      resolve(e.data as T);
    }, { signal: ac.signal });
    port.start();
  });
}


function hasAction(action: string) {
  return (d: unknown): boolean =>
    Boolean(d) && (d as { action?: string }).action === action;
}


describe("notes worker protocol", () => {
  let harness: WorkerHarness;

  beforeEach(async () => {
    harness = await loadFreshWorker();
  });

  it(
    "responds to hello with initialized:false on a fresh worker",
    async () => {
      const pending = expectMessage<{
        action: string;
        initialized: boolean;
      }>(harness.window, hasAction("helloAck"));
      harness.window.postMessage({ action: "hello" });
      const ack = await pending;
      expect(ack.initialized).toBe(false);
    },
  );

  it("allows reset at any time — that is how a folder switch works",
    async () => {
      harness.window.postMessage({ action: "reset" });
      const reply = await expectMessage<{ action: string }>(
        harness.window,
        hasAction("resetOk"),
      );
      expect(reply.action).toBe("resetOk");
    },
  );

  it("initializes once across simultaneous initialize calls", async () => {
    const replies = expectMessage<{ folderName: string }>(
      harness.window,
      hasAction("initialized"),
    );
    harness.window.postMessage({
      action: "initialize",
      folderHandle: fakeFolderHandle("test-folder"),
      gitAuthor: { name: "n", email: "e" },
    });
    harness.window.postMessage({
      action: "initialize",
      folderHandle: fakeFolderHandle("other-folder"),
      gitAuthor: { name: "n", email: "e" },
    });

    expect((await replies).folderName).toBe("test-folder");
  });

  it("hello after init reports initialized:true and folderName", async () => {
    const initReply = expectMessage<unknown>(
      harness.window,
      hasAction("initialized"),
    );
    harness.window.postMessage({
      action: "initialize",
      folderHandle: fakeFolderHandle("some-folder"),
      gitAuthor: { name: "n", email: "e" },
    });
    await initReply;

    const ackPromise = expectMessage<{
      initialized: boolean;
      folderName: string;
    }>(harness.window, hasAction("helloAck"));
    harness.window.postMessage({ action: "hello" });
    const ack = await ackPromise;
    expect(ack.initialized).toBe(true);
    expect(ack.folderName).toBe("some-folder");
  });

  it("resets folderName so a folder switch can re-initialize", async () => {
    const initReply = expectMessage<unknown>(
      harness.window,
      hasAction("initialized"),
    );
    harness.window.postMessage({
      action: "initialize",
      folderHandle: fakeFolderHandle("first-folder"),
      gitAuthor: { name: "n", email: "e" },
    });
    await initReply;

    const resetReply = expectMessage<unknown>(
      harness.window,
      hasAction("resetOk"),
    );
    harness.window.postMessage({ action: "reset" });
    await resetReply;

    const secondInit = expectMessage<{ folderName: string }>(
      harness.window,
      hasAction("initialized"),
    );
    harness.window.postMessage({
      action: "initialize",
      folderHandle: fakeFolderHandle("second-folder"),
      gitAuthor: { name: "n", email: "e" },
    });
    expect((await secondInit).folderName).toBe("second-folder");
  });

  /*
    The Electron variant: a folder path plus a transferred MessagePort to
    the main process. Nothing is actually read over the port here — the
    StorageProvider and git are mocked out — but the worker has to accept
    the shape and report the path back so a folder switch can be detected
    even between two folders that share a basename.
  */
  it("reports the absolute folder path for a folderPath init", async () => {
    const initReply = expectMessage<unknown>(
      harness.window,
      hasAction("initialized"),
    );
    const storageChannel = new MessageChannel();
    harness.window.postMessage(
      {
        action: "initialize",
        folderPath: "/Users/someone/Documents/notes",
        gitAuthor: { name: "n", email: "e" },
      },
      [storageChannel.port1],
    );
    await initReply;

    const ackPromise = expectMessage<{
      folderName: string;
      folderPath: string;
      usingOPFS: boolean;
    }>(harness.window, hasAction("helloAck"));
    harness.window.postMessage({ action: "hello" });
    const ack = await ackPromise;
    expect(ack.folderPath).toBe("/Users/someone/Documents/notes");
    expect(ack.folderName).toBe("notes");
    expect(ack.usingOPFS).toBe(false);
  });

  it("rejects a folderPath init without a storage port", async () => {
    const errorReply = expectMessage<{ error: string }>(
      harness.window,
      hasAction("initError"),
    );
    harness.window.postMessage({
      action: "initialize",
      folderPath: "/Users/someone/notes",
      gitAuthor: { name: "n", email: "e" },
    });
    expect((await errorReply).error).toMatch(/storage port/);
  });

  it("clears the folder path on reset", async () => {
    const initReply = expectMessage<unknown>(
      harness.window,
      hasAction("initialized"),
    );
    const storageChannel = new MessageChannel();
    harness.window.postMessage(
      {
        action: "initialize",
        folderPath: "/Users/someone/notes",
        gitAuthor: { name: "n", email: "e" },
      },
      [storageChannel.port1],
    );
    await initReply;

    const resetReply = expectMessage<unknown>(
      harness.window,
      hasAction("resetOk"),
    );
    harness.window.postMessage({ action: "reset" });
    await resetReply;

    const ackPromise = expectMessage<{
      initialized: boolean;
      folderPath: string | null;
    }>(harness.window, hasAction("helloAck"));
    harness.window.postMessage({ action: "hello" });
    const ack = await ackPromise;
    expect(ack.initialized).toBe(false);
    expect(ack.folderPath).toBe(null);
  });

  it("dispatches RPC on ports attached via addPort", async () => {
    const initReply = expectMessage<unknown>(
      harness.window,
      hasAction("initialized"),
    );
    harness.window.postMessage({
      action: "initialize",
      folderHandle: fakeFolderHandle("some-folder"),
      gitAuthor: { name: "n", email: "e" },
    });
    await initReply;

    const channel = new MessageChannel();
    harness.window.postMessage({ action: "addPort" }, [channel.port1]);

    const reply = expectMessage<{ id: number; result: unknown }>(
      channel.port2,
      (d) => Boolean(d) && (d as { id?: number }).id === 7,
    );
    channel.port2.postMessage({
      id: 7,
      method: "put",
      args: [{}],
    });
    expect((await reply).result).toEqual({ meta: { slug: "x" } });
  });
});
