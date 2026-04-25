import { Buffer } from "buffer";
import FileSystemAccessAPIStorageProvider
  from "../FileSystemAccessAPIStorageProvider";
import NotesProvider from "../notes";
import FileSystemAccessFs from "./FileSystemAccessFs";
import {
  commitChanged,
  ensureRepo,
  getCommitDiff,
  getCommitHistory,
  GitAuthor,
  hasExistingRepo,
} from "./git";

// isomorphic-git uses Node's Buffer internally; make it available
// to the worker's global scope.
(globalThis as { Buffer?: typeof Buffer }).Buffer = Buffer;

let notesProvider: NotesProvider | null = null;
let gitFs: FileSystemAccessFs | null = null;
let dirHandleForGit: FileSystemDirectoryHandle | null = null;
let folderName: string | null = null;
let usingOPFS = false;
let gitAuthor: GitAuthor = {
  name: "NENO",
  email: "noreply@neno.local",
};

type InitOptions = {
  folderHandle?: FileSystemDirectoryHandle;
  useOPFS?: boolean;
  createDummyNotes?: boolean;
  gitAuthor?: GitAuthor;
};

let initPromise: Promise<void> | null = null;

// Tab ports: one per connected NENO tab. Counted for connectedTabCount
// and used as broadcast targets.
const tabPorts = new Set<MessagePort>();
// Sub-ports: extra MessagePorts (e.g. script workers) attached via the
// `addPort` action. Receive RPC dispatch but no broadcasts and do not
// count as tabs.
const subPorts = new Set<MessagePort>();

const MUTATING_METHODS = new Set<string>([
  "put",
  "remove",
  "addFile",
  "updateFile",
  "renameFileSlug",
  "deleteFile",
  "pin",
  "unpin",
  "movePinPosition",
  "reIndexGraph",
]);

type RPCMessage = {
  id: number;
  method: string;
  args: unknown[];
};

type RPCAction
  = { action: "hello" }
  | ({ action: "initialize" } & InitOptions)
  | { action: "addPort" }
  | { action: "setGitAuthor"; author: GitAuthor }
  | { action: "enableGit" }
  | { action: "reset" }
  | { action: "goodbye" };

function getTransferables(value: unknown): Transferable[] {
  if (value instanceof ReadableStream) {
    return [value];
  }
  return [];
}

function broadcast(
  message: { event: string; [key: string]: unknown },
  except?: MessagePort,
): void {
  for (const port of tabPorts) {
    if (port === except) continue;
    try {
      port.postMessage(message);
    } catch {
      tabPorts.delete(port);
    }
  }
}

async function runInitialize(
  opts: InitOptions,
): Promise<void> {
  let dirHandle: FileSystemDirectoryHandle;

  if (opts.useOPFS) {
    dirHandle = await navigator.storage.getDirectory();
    usingOPFS = true;
  } else if (opts.folderHandle) {
    dirHandle = opts.folderHandle;
    usingOPFS = false;
  } else {
    throw new Error("No folder handle or OPFS flag provided");
  }

  const storageProvider
    = new FileSystemAccessAPIStorageProvider(dirHandle);

  if (opts.createDummyNotes) {
    for (let i = 1; i <= 1000; i++) {
      await storageProvider.writeObject(
        "note-" + i + ".subtext",
        "Test note " + i,
      );
    }
  }

  if (opts.gitAuthor) {
    gitAuthor = opts.gitAuthor;
  }

  dirHandleForGit = dirHandle;
  const candidateGitFs = new FileSystemAccessFs(dirHandle);
  if (await hasExistingRepo(candidateGitFs, "/")) {
    await ensureRepo(candidateGitFs, "/", gitAuthor);
    gitFs = candidateGitFs;
  }

  notesProvider = new NotesProvider(storageProvider, {
    onFlush: async (change) => {
      if (!gitFs) return;
      await commitChanged(gitFs, "/", change, gitAuthor);
    },
  });
  folderName = dirHandle.name;
}

async function ensureInitialized(opts: InitOptions): Promise<void> {
  if (notesProvider) return;
  if (!initPromise) {
    initPromise = runInitialize(opts).catch((e) => {
      initPromise = null;
      throw e;
    });
  }
  await initPromise;
}

function tearDown(): void {
  notesProvider = null;
  gitFs = null;
  dirHandleForGit = null;
  folderName = null;
  usingOPFS = false;
  initPromise = null;
}

async function handleRPCCall(
  msg: RPCMessage,
  port: MessagePort,
): Promise<void> {
  const { id, method, args } = msg;
  const respond = (
    data: unknown,
    transfer?: Transferable[],
  ): void => {
    port.postMessage(data, transfer ?? []);
  };

  if (method === "getCommitHistory") {
    if (!gitFs) {
      respond({ id, error: "Git not initialized" });
      return;
    }
    try {
      const [options] = args as [{ limit: number; offset: number }];
      const result = await getCommitHistory(gitFs, "/", options);
      respond({ id, result });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      respond({ id, error: message });
    }
    return;
  }

  if (method === "getCommitDiff") {
    if (!gitFs) {
      respond({ id, error: "Git not initialized" });
      return;
    }
    try {
      const [oid] = args as [string];
      const result = await getCommitDiff(gitFs, "/", oid);
      respond({ id, result });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      respond({ id, error: message });
    }
    return;
  }

  if (!notesProvider) {
    respond({ id, error: "NotesProvider not initialized" });
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn = (notesProvider as any)[method];
    if (typeof fn !== "function") {
      respond({ id, error: `Unknown method: ${method}` });
      return;
    }
    const result = await fn.apply(notesProvider, args);
    const transferables = getTransferables(result);
    respond({ id, result }, transferables);
    if (MUTATING_METHODS.has(method)) {
      broadcast({ event: "mutation" }, port);
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    respond({ id, error: message });
  }
}

function attachDispatch(port: MessagePort): void {
  port.addEventListener("message", (event: MessageEvent) => {
    const data = event.data;
    if (data && typeof data === "object" && "action" in data) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleAction(
        data as RPCAction,
        port,
        event.ports,
      );
      return;
    }
    if (data && typeof data === "object" && "id" in data) {
      handleRPCCall(data as RPCMessage, port);
    }
  });
  port.start();
}

function registerSubPort(port: MessagePort): void {
  subPorts.add(port);
  attachDispatch(port);
}

function registerTabPort(port: MessagePort): void {
  tabPorts.add(port);
  attachDispatch(port);
}

async function handleAction(
  action: RPCAction,
  port: MessagePort,
  ports: readonly MessagePort[],
): Promise<void> {
  if (action.action === "hello") {
    port.postMessage({
      action: "helloAck",
      initialized: notesProvider !== null,
      gitEnabled: gitFs !== null,
      folderName,
      usingOPFS,
      connectedTabCount: tabPorts.size,
    });
    return;
  }

  if (action.action === "initialize") {
    try {
      await ensureInitialized({
        folderHandle: action.folderHandle,
        useOPFS: action.useOPFS,
        createDummyNotes: action.createDummyNotes,
        gitAuthor: action.gitAuthor,
      });
      port.postMessage({
        action: "initialized",
        gitEnabled: gitFs !== null,
        folderName,
        usingOPFS,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      port.postMessage({ action: "initError", error: message });
    }
    return;
  }

  if (action.action === "addPort") {
    const newPort = ports[0];
    if (newPort) {
      registerSubPort(newPort);
    }
    return;
  }

  if (action.action === "setGitAuthor") {
    gitAuthor = action.author;
    return;
  }

  if (action.action === "enableGit") {
    if (gitFs) {
      port.postMessage({ action: "gitEnabled" });
      return;
    }
    if (!dirHandleForGit) {
      port.postMessage({
        action: "gitEnableFailed",
        error: "Worker not initialized",
      });
      return;
    }
    const candidateGitFs = new FileSystemAccessFs(dirHandleForGit);
    try {
      await ensureRepo(candidateGitFs, "/", gitAuthor);
      gitFs = candidateGitFs;
      port.postMessage({ action: "gitEnabled" });
      broadcast({ event: "gitEnabled" }, port);
    } catch (e) {
      port.postMessage({
        action: "gitEnableFailed",
        error: e instanceof Error ? e.message : String(e),
      });
    }
    return;
  }

  if (action.action === "reset") {
    const otherTabs = tabPorts.size - (tabPorts.has(port) ? 1 : 0);
    if (otherTabs > 0) {
      port.postMessage({
        action: "resetDenied",
        connectedTabCount: tabPorts.size,
      });
      return;
    }
    tearDown();
    port.postMessage({ action: "resetOk" });
    return;
  }

  if (action.action === "goodbye") {
    tabPorts.delete(port);
    return;
  }
}

// SharedWorker entry: one connect event per tab.
(globalThis as unknown as {
  onconnect: (event: MessageEvent) => void;
}).onconnect = (event: MessageEvent) => {
  const port = event.ports[0];
  registerTabPort(port);
};
