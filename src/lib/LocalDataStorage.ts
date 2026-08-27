import { getWritableStream, streamToBlob } from "./utils";
import MimeTypes from "./MimeTypes";
import NotesProviderProxy from "./notes-worker/NotesProviderProxy";
import { Slug } from "./notes/types/Slug";
import { FileInfo } from "./notes/types/FileInfo";
// @ts-ignore Vite worker URL import
import notesWorkerUrl from "./notes-worker/index.ts?worker&url";
import { getExtensionFromFilename } from "./notes/utils";
import { getBridge, isElectron } from "./electron/bridge";
import connectStorage from "./electron/connectStorage";

const GIT_USER_NAME_KEY = "git.user.name";
const GIT_USER_EMAIL_KEY = "git.user.email";
const GIT_USER_NAME_DEFAULT = "NENO";
const GIT_USER_EMAIL_DEFAULT = "noreply@neno.local";

/*
  The notes worker is a dedicated Worker: there is exactly one NENO
  window, so there is no cross-tab arbitration to do. `PortLike` keeps
  the rest of this file agnostic about whether it is talking to a Worker
  or a MessagePort.
*/
type PortLike = Pick<Worker, "postMessage" | "addEventListener"
  | "removeEventListener">;

let folderPath: string | null = null;
let notesProvider: NotesProviderProxy | null = null;
let workerPort: PortLike | null = null;
let gitEnabledFlag = false;
const gitEnabledSubscribers = new Set<() => void>();

const notifyGitEnabledSubscribers = (): void => {
  for (const cb of gitEnabledSubscribers) {
    cb();
  }
};

export const isGitEnabled = (): boolean => gitEnabledFlag;

export const subscribeGitEnabled = (cb: () => void): void => {
  gitEnabledSubscribers.add(cb);
};

export const unsubscribeGitEnabled = (cb: () => void): void => {
  gitEnabledSubscribers.delete(cb);
};

export const getGitAuthor = (): { name: string; email: string } => {
  return {
    name: localStorage.getItem(GIT_USER_NAME_KEY) || GIT_USER_NAME_DEFAULT,
    email: localStorage.getItem(GIT_USER_EMAIL_KEY) || GIT_USER_EMAIL_DEFAULT,
  };
};

export const setGitAuthor = (
  name: string,
  email: string,
): void => {
  localStorage.setItem(GIT_USER_NAME_KEY, name);
  localStorage.setItem(GIT_USER_EMAIL_KEY, email);
  if (notesProvider) {
    notesProvider.setGitAuthor({ name, email });
  }
};

export const enableGit = async (): Promise<void> => {
  if (!workerPort) {
    throw new Error("Notes worker not initialized");
  }
  const port = workerPort;
  await new Promise<void>((resolve, reject) => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.action === "gitEnabled") {
        port.removeEventListener("message", onMessage);
        resolve();
      } else if (data.action === "gitEnableFailed") {
        port.removeEventListener("message", onMessage);
        reject(new Error(data.error as string));
      }
    };
    port.addEventListener("message", onMessage);
    port.postMessage({ action: "enableGit" });
  });
  gitEnabledFlag = true;
  if (notesProvider) {
    notesProvider.setGitAuthor(getGitAuthor());
  }
  notifyGitEnabledSubscribers();
};


const getBasename = (path: string): string => {
  const segments = path.split("/").filter((segment) => segment.length > 0);
  return segments.length > 0 ? segments[segments.length - 1] : path;
};


/*
  The absolute path of the folder used last lives in the Electron main
  process ($HOME/.config/neno/config.json), so there is no permission
  prompt and no FileSystemDirectoryHandle round-trip through IndexedDB.
*/
const getExistingFolderPath = async (): Promise<string | null> => {
  if (folderPath) return folderPath;
  if (!isElectron()) return null;
  return await getBridge().getLastFolder();
};


/** Basename of the folder the start view can offer to reopen. */
export const getExistingFolderName = async (): Promise<string | null> => {
  const path = await getExistingFolderPath();
  return path === null ? null : getBasename(path);
};


type HelloAck = {
  initialized: boolean;
  gitEnabled: boolean;
  folderName: string | null;
  folderPath: string | null;
  usingOPFS: boolean;
};

type InitOk = {
  gitEnabled: boolean;
  folderName: string | null;
  folderPath: string | null;
  usingOPFS: boolean;
};

type InitMessage = {
  folderPath?: string;
  useOPFS?: boolean;
  createDummyNotes?: boolean;
  gitAuthor: { name: string; email: string };
};

function setupGlobalEventListener(port: PortLike): void {
  port.addEventListener("message", (e: MessageEvent) => {
    const data = e.data;
    if (!data || typeof data !== "object") return;
    if (data.event === "gitEnabled" && !gitEnabledFlag) {
      gitEnabledFlag = true;
      notifyGitEnabledSubscribers();
    }
  });
}

function ensureWorker(): PortLike {
  if (workerPort) return workerPort;
  workerPort = new Worker(notesWorkerUrl, { type: "module" });
  setupGlobalEventListener(workerPort);
  return workerPort;
}

function sendHello(port: PortLike): Promise<HelloAck> {
  return new Promise((resolve) => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.action !== "helloAck") return;
      port.removeEventListener("message", onMessage);
      resolve(data as HelloAck);
    };
    port.addEventListener("message", onMessage);
    port.postMessage({ action: "hello" });
  });
}

function sendInitialize(
  port: PortLike,
  message: InitMessage,
  transfer: Transferable[] = [],
): Promise<InitOk> {
  return new Promise((resolve, reject) => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.action === "initialized") {
        port.removeEventListener("message", onMessage);
        resolve({
          gitEnabled: Boolean(data.gitEnabled),
          folderName: data.folderName ?? null,
          folderPath: data.folderPath ?? null,
          usingOPFS: Boolean(data.usingOPFS),
        });
      } else if (data.action === "initError") {
        port.removeEventListener("message", onMessage);
        reject(new Error(data.error as string));
      }
    };
    port.addEventListener("message", onMessage);
    port.postMessage({ action: "initialize", ...message }, transfer);
  });
}

function adoptInitialState(
  port: PortLike,
  ack: { gitEnabled: boolean },
): NotesProviderProxy {
  if (ack.gitEnabled !== gitEnabledFlag) {
    gitEnabledFlag = ack.gitEnabled;
    notifyGitEnabledSubscribers();
  }
  const proxy = new NotesProviderProxy(port as Worker);
  notesProvider = proxy;
  return proxy;
}


async function initFresh(
  port: PortLike,
  newFolderPath: string | undefined,
  createDummyNotes: boolean,
): Promise<NotesProviderProxy> {
  if (!newFolderPath) {
    const init = await sendInitialize(port, {
      useOPFS: true,
      createDummyNotes,
      gitAuthor: getGitAuthor(),
    });
    return adoptInitialState(port, init);
  }

  /*
    The Node fs implementations live in the Electron main process; the
    worker reaches them through this port.
  */
  const storagePort = await connectStorage(newFolderPath);
  await getBridge().setLastFolder(newFolderPath);
  folderPath = newFolderPath;
  const init = await sendInitialize(
    port,
    {
      folderPath: newFolderPath,
      gitAuthor: getGitAuthor(),
    },
    [storagePort],
  );
  return adoptInitialState(port, init);
}


function describesSameSetup(
  ack: HelloAck,
  newFolderPath: string | undefined,
): boolean {
  if (!newFolderPath) {
    // Caller wants OPFS — match only if the worker is using OPFS too.
    return ack.usingOPFS;
  }
  // Full paths, so two folders that merely share a basename do not match.
  return !ack.usingOPFS && ack.folderPath === newFolderPath;
}


export function requestFolderSwitch(): Promise<void> {
  if (!workerPort) {
    return Promise.reject(new Error("Notes worker not initialized"));
  }
  const port = workerPort;
  return new Promise((resolve) => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.action !== "resetOk") return;
      port.removeEventListener("message", onMessage);
      notesProvider = null;
      folderPath = null;
      if (gitEnabledFlag) {
        gitEnabledFlag = false;
        notifyGitEnabledSubscribers();
      }
      resolve();
    };
    port.addEventListener("message", onMessage);
    port.postMessage({ action: "reset" });
  });
}


export const initializeNotesProvider = async (
  newFolderPath?: string,
  createDummyNotes?: boolean,
): Promise<NotesProviderProxy> => {
  const port = ensureWorker();
  const ack = await sendHello(port);

  if (ack.initialized) {
    if (describesSameSetup(ack, newFolderPath)) {
      if (newFolderPath) {
        await getBridge().setLastFolder(newFolderPath);
        folderPath = newFolderPath;
      }
      return adoptInitialState(port, ack);
    }
    // Caller wants a different setup than the worker is running.
    await requestFolderSwitch();
  }

  return initFresh(port, newFolderPath, createDummyNotes ?? false);
};


export const initializeNotesProviderWithLastFolder
  = async (): Promise<NotesProviderProxy> => {
    const lastFolder = await getBridge().getLastFolder();
    if (!lastFolder) {
      throw new Error("No folder path in storage");
    }
    return initializeNotesProvider(lastFolder);
  };


export const isInitialized = (): boolean => {
  return notesProvider !== null;
};


export const getNotesProvider = (): NotesProviderProxy | null => {
  return notesProvider;
};


export const getNotesWorkerPort = (): PortLike | null => {
  return workerPort;
};


export const getObjectUrlForArbitraryGraphFile = async (
  fileInfo: FileInfo,
): Promise<string> => {
  if (!notesProvider) {
    throw new Error("Notes provider not initialized");
  }

  const readable
    = await notesProvider.getReadableArbitraryGraphFileStream(
      fileInfo.slug,
    );
  const extension = getExtensionFromFilename(fileInfo.filename);
  const mimeType = extension && MimeTypes.has(extension)
    ? MimeTypes.get(extension) as string
    : "application/neno-filestream";
  const blob = await streamToBlob(readable, mimeType);
  const url = URL.createObjectURL(blob);
  return url;
};


export const saveFile = async (slug: Slug) => {
  if (!notesProvider) {
    throw new Error("Notes provider not initialized");
  }

  const fileInfo = await notesProvider.getFileInfo(slug);

  const readable
    = await notesProvider.getReadableArbitraryGraphFileStream(
      slug,
    );
  const extension = getExtensionFromFilename(slug);

  const writable = await getWritableStream({
    suggestedName: fileInfo.filename,
    filters: extension
      ? [{ name: extension.toUpperCase() + " file", extensions: [extension] }]
      : [],
  });

  // The user cancelled the save dialog.
  if (!writable) return;

  await readable.pipeTo(writable);
};
