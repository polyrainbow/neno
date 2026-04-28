import {
  describe, it, expect, beforeEach, vi,
} from "vitest";

/*
  Drives the worker module's onconnect handler with synthetic
  MessagePorts. jsdom has no SharedWorker, but the module's onconnect
  is invoked the same way: once per tab, with port[0] for that tab.

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


type Connector = (port: MessagePort) => void;

type OnConnectHandler = (event: MessageEvent) => void;

async function loadFreshWorker(): Promise<Connector> {
  vi.resetModules();
  const slot: { handler: OnConnectHandler | null } = { handler: null };
  Object.defineProperty(globalThis, "onconnect", {
    configurable: true,
    set(handler: OnConnectHandler) { slot.handler = handler; },
    get() { return slot.handler; },
  });
  await import("./index");
  const onconnect = slot.handler;
  if (!onconnect) throw new Error("onconnect was not set");
  return (port: MessagePort) => {
    onconnect({ ports: [port] } as unknown as MessageEvent);
  };
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
  timeoutMs = 100,
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


function connectTab(connect: Connector): MessagePort {
  const channel = new MessageChannel();
  connect(channel.port2);
  return channel.port1;
}


describe("notes worker SharedWorker protocol", () => {
  let connect: Connector;

  beforeEach(async () => {
    connect = await loadFreshWorker();
  });

  it(
    "responds to hello with initialized:false on a fresh worker",
    async () => {
      const tab = connectTab(connect);
      const pending = expectMessage<{
        action: string;
        initialized: boolean;
        connectedTabCount: number;
      }>(tab, (d) =>
        Boolean(d) && (d as { action?: string }).action === "helloAck",
      );
      tab.postMessage({ action: "hello" });
      const ack = await pending;
      expect(ack.initialized).toBe(false);
      expect(ack.connectedTabCount).toBe(1);
    },
  );

  it(
    "tracks connected tab count across connect and goodbye",
    async () => {
      const tabA = connectTab(connect);
      tabA.start();
      const tabB = connectTab(connect);
      tabB.start();

      // Hello on B → count is 2.
      const ackB = expectMessage<{ connectedTabCount: number }>(
        tabB,
        (d) => Boolean(d) && (d as { action?: string }).action === "helloAck",
      );
      tabB.postMessage({ action: "hello" });
      expect((await ackB).connectedTabCount).toBe(2);

      // B says goodbye, hello on A → count is 1.
      tabB.postMessage({ action: "goodbye" });
      // Give the worker a tick to process goodbye.
      await new Promise((r) => setTimeout(r, 0));

      const ackA = expectMessage<{ connectedTabCount: number }>(
        tabA,
        (d) => Boolean(d) && (d as { action?: string }).action === "helloAck",
      );
      tabA.postMessage({ action: "hello" });
      expect((await ackA).connectedTabCount).toBe(1);
    },
  );

  it("denies reset when another tab is connected", async () => {
    const tabA = connectTab(connect);
    tabA.start();
    const tabB = connectTab(connect);
    tabB.start();

    tabA.postMessage({ action: "reset" });
    const reply = await expectMessage<{
      action: string; connectedTabCount: number;
    }>(tabA, (d) =>
      Boolean(d) && (d as { action?: string }).action === "resetDenied",
    );
    expect(reply.action).toBe("resetDenied");
    expect(reply.connectedTabCount).toBe(2);
  });

  it("allows reset when alone", async () => {
    const tabA = connectTab(connect);
    tabA.start();
    tabA.postMessage({ action: "reset" });
    const reply = await expectMessage<{ action: string }>(
      tabA,
      (d) => Boolean(d) && (d as { action?: string }).action === "resetOk",
    );
    expect(reply.action).toBe("resetOk");
  });

  it("initializes once across simultaneous initialize calls", async () => {
    const tabA = connectTab(connect);
    const tabB = connectTab(connect);
    tabA.start();
    tabB.start();

    const handle = fakeFolderHandle("test-folder");
    const aReply = expectMessage<{
      action: string; folderName: string;
    }>(tabA, (d) =>
      Boolean(d) && (d as { action?: string }).action === "initialized",
    );
    const bReply = expectMessage<{
      action: string; folderName: string;
    }>(tabB, (d) =>
      Boolean(d) && (d as { action?: string }).action === "initialized",
    );
    tabA.postMessage({
      action: "initialize",
      folderHandle: handle,
      gitAuthor: { name: "n", email: "e" },
    });
    tabB.postMessage({
      action: "initialize",
      folderHandle: fakeFolderHandle("other-folder"),
      gitAuthor: { name: "n", email: "e" },
    });

    const [a, b] = await Promise.all([aReply, bReply]);
    // Both tabs see the same folderName — first writer wins.
    expect(a.folderName).toBe("test-folder");
    expect(b.folderName).toBe("test-folder");
  });

  it("hello after init reports initialized:true and folderName", async () => {
    const tabA = connectTab(connect);
    tabA.start();
    const initReply = expectMessage<unknown>(tabA, (d) =>
      Boolean(d) && (d as { action?: string }).action === "initialized",
    );
    tabA.postMessage({
      action: "initialize",
      folderHandle: fakeFolderHandle("some-folder"),
      gitAuthor: { name: "n", email: "e" },
    });
    await initReply;

    const tabB = connectTab(connect);
    const ackPromise = expectMessage<{
      action: string;
      initialized: boolean;
      folderName: string;
      connectedTabCount: number;
    }>(tabB, (d) =>
      Boolean(d) && (d as { action?: string }).action === "helloAck",
    );
    tabB.postMessage({ action: "hello" });
    const ack = await ackPromise;
    expect(ack.initialized).toBe(true);
    expect(ack.folderName).toBe("some-folder");
    expect(ack.connectedTabCount).toBe(2);
  });
});
