import { Buffer } from "buffer";
import FileSystemAccessAPIStorageProvider
  from "../FileSystemAccessAPIStorageProvider";
import NotesProvider from "../notes";
import StorageProvider from "../notes/types/StorageProvider";
import FileSystemAccessFs from "./FileSystemAccessFs";
import { GitFs } from "./GitFs";
import BridgeClient from "../electron/BridgeClient";
import StorageProviderProxy from "../electron/StorageProviderProxy";
import GitFsProxy from "../electron/GitFsProxy";
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
let gitFs: GitFs | null = null;
let createGitFs: (() => GitFs) | null = null;
let folderName: string | null = null;
let folderPath: string | null = null;
let usingOPFS = false;
let gitAuthor: GitAuthor = {
  name: "NENO",
  email: "noreply@neno.local",
};

type InitOptions = {
  folderHandle?: FileSystemDirectoryHandle;
  /*
    Electron: the graph lives at an absolute path on disk and is reached
    through a MessagePort to the main process, which owns the Node fs
    implementations. The port is transferred alongside the action.
  */
  folderPath?: string;
  useOPFS?: boolean;
  createDummyNotes?: boolean;
  gitAuthor?: GitAuthor;
};

let initPromise: Promise<void> | null = null;

/*
  The single window's port — the worker global itself, since this is a
  dedicated worker. Broadcast target for mutation events.
*/
const tabPorts = new Set<PortLike>();
/*
  Sub-ports: extra MessagePorts (e.g. script workers) attached via the
  `addPort` action. Receive RPC dispatch but no broadcasts.
*/
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
  | { action: "reset" };

/*
  Both the worker global and a MessagePort can carry the protocol; only
  a MessagePort has start().
*/
type PortLike = {
  /* Method syntax so the DOM's overloaded signatures remain assignable. */
  postMessage(message: unknown, transfer?: Transferable[]): void;
  addEventListener(
    type: "message",
    listener: (event: MessageEvent) => void,
  ): void;
  start?(): void;
};

function getTransferables(value: unknown): Transferable[] {
  if (value instanceof ReadableStream) {
    return [value];
  }
  return [];
}

function broadcast(
  message: { event: string; [key: string]: unknown },
  except?: PortLike,
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

function getBasename(folderPath: string): string {
  const segments = folderPath
    .split("/")
    .filter((segment) => segment.length > 0);
  return segments.length > 0 ? segments[segments.length - 1] : folderPath;
}

async function runInitialize(
  opts: InitOptions,
  storagePort?: MessagePort,
): Promise<void> {
  let storageProvider: StorageProvider;

  /*
    Two provider pairs: the Node fs implementations in the Electron main
    process, reached over a MessagePort, and the File System Access API
    provider used for the OPFS "try it out" mode.
  */
  if (opts.folderPath) {
    if (!storagePort) {
      throw new Error("No storage port transferred with folderPath");
    }
    /*
      One client for both proxies: they share a single port, so they must
      also share the request id sequence.
    */
    const bridgeClient = new BridgeClient(storagePort);
    storageProvider = new StorageProviderProxy(bridgeClient);
    createGitFs = () => new GitFsProxy(bridgeClient);
    folderPath = opts.folderPath;
    folderName = getBasename(opts.folderPath);
    usingOPFS = false;
  } else {
    let dirHandle: FileSystemDirectoryHandle;

    if (opts.useOPFS) {
      dirHandle = await navigator.storage.getDirectory();
      usingOPFS = true;
    } else if (opts.folderHandle) {
      dirHandle = opts.folderHandle;
      usingOPFS = false;
    } else {
      throw new Error("No folder path, folder handle or OPFS flag provided");
    }

    storageProvider = new FileSystemAccessAPIStorageProvider(dirHandle);
    createGitFs = () => new FileSystemAccessFs(dirHandle);
    folderName = dirHandle.name;
  }

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

  const candidateGitFs = createGitFs();
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
}

async function ensureInitialized(
  opts: InitOptions,
  storagePort?: MessagePort,
): Promise<void> {
  if (notesProvider) return;
  if (!initPromise) {
    initPromise = runInitialize(opts, storagePort).catch((e) => {
      initPromise = null;
      throw e;
    });
  }
  await initPromise;
}

function tearDown(): void {
  notesProvider = null;
  gitFs = null;
  createGitFs = null;
  folderName = null;
  folderPath = null;
  usingOPFS = false;
  initPromise = null;
}

async function handleRPCCall(
  msg: RPCMessage,
  port: PortLike,
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

function attachDispatch(port: PortLike): void {
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
  // The worker global has no start(); a MessagePort needs one because we
  // listen with addEventListener rather than onmessage.
  port.start?.();
}

function registerSubPort(port: MessagePort): void {
  subPorts.add(port);
  attachDispatch(port);
}

function registerTabPort(port: PortLike): void {
  tabPorts.add(port);
  attachDispatch(port);
}

async function handleAction(
  action: RPCAction,
  port: PortLike,
  ports: readonly MessagePort[],
): Promise<void> {
  if (action.action === "hello") {
    port.postMessage({
      action: "helloAck",
      initialized: notesProvider !== null,
      gitEnabled: gitFs !== null,
      folderName,
      folderPath,
      usingOPFS,
    });
    return;
  }

  if (action.action === "initialize") {
    try {
      await ensureInitialized(
        {
          folderHandle: action.folderHandle,
          folderPath: action.folderPath,
          useOPFS: action.useOPFS,
          createDummyNotes: action.createDummyNotes,
          gitAuthor: action.gitAuthor,
        },
        ports[0],
      );
      port.postMessage({
        action: "initialized",
        gitEnabled: gitFs !== null,
        folderName,
        folderPath,
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
    if (!createGitFs) {
      port.postMessage({
        action: "gitEnableFailed",
        error: "Worker not initialized",
      });
      return;
    }
    const candidateGitFs = createGitFs();
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
    // Still how a folder switch works.
    tearDown();
    port.postMessage({ action: "resetOk" });
    return;
  }
}

/*
  Dedicated worker entry: the worker global is the single window's port.
*/
registerTabPort(globalThis as unknown as PortLike);
