import * as IDB from "idb-keyval";
import { getWritableStream, streamToBlob } from "./utils";
import MimeTypes from "./MimeTypes";
import NotesProviderProxy from "./notes-worker/NotesProviderProxy";
import { Slug } from "./notes/types/Slug";
import { FileInfo } from "./notes/types/FileInfo";
// @ts-ignore Vite worker URL import
import notesWorkerUrl from "./notes-worker/index.ts?sharedworker&url";
import { getExtensionFromFilename } from "./notes/utils";

/*
  Notes:
  FileSystemHandle.requestPermission currently requires to be called
  from a user gesture: https://stackoverflow.com/a/69897694/3890888
*/

async function verifyPermission(
  fileSystemHandle: FileSystemHandle,
  readWrite: boolean,
): Promise<void> {
  // @ts-ignore
  const options: FileSystemHandlePermissionDescriptor = {};
  if (readWrite) {
    options.mode = "readwrite";
  }
  // Check if permission was already granted. If so, resolve.
  // @ts-ignore
  if ((await fileSystemHandle.queryPermission(options)) === "granted") {
    return;
  }
  // Request permission. If the user grants permission, resolve.
  // @ts-ignore
  if ((await fileSystemHandle.requestPermission(options)) === "granted") {
    return;
  }
  // The user didn't grant permission
  throw new Error(
    "User did not grant permission to " + fileSystemHandle.name,
  );
}


const FOLDER_HANDLE_STORAGE_KEY = "LOCAL_DB_FOLDER_HANDLE";
const GIT_USER_NAME_KEY = "git.user.name";
const GIT_USER_EMAIL_KEY = "git.user.email";
const GIT_USER_NAME_DEFAULT = "NENO";
const GIT_USER_EMAIL_DEFAULT = "noreply@neno.local";

let folderHandle: FileSystemDirectoryHandle | null = null;
let notesProvider: NotesProviderProxy | null = null;
let sharedWorker: SharedWorker | null = null;
let workerPort: MessagePort | null = null;
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


export const getExistingFolderHandleName
  = async (): Promise<string | null> => {
    if (folderHandle) {
      return folderHandle.name;
    }

    const folderHandleFromStorage
      = await IDB.get<FileSystemDirectoryHandle>(
        FOLDER_HANDLE_STORAGE_KEY,
      );
    if (folderHandleFromStorage) {
      return folderHandleFromStorage.name;
    }

    return null;
  };


export const getActiveFolderHandle
  = (): FileSystemDirectoryHandle | null => {
    return folderHandle;
  };

export const getFolderHandleFromStorage = async (
): Promise<FileSystemDirectoryHandle> => {
  const folderHandle = await IDB.get<FileSystemDirectoryHandle>(
    FOLDER_HANDLE_STORAGE_KEY,
  );
  if (!folderHandle) {
    throw new Error("No folder handle in storage");
  }
  return folderHandle;
};


type HelloAck = {
  initialized: boolean;
  gitEnabled: boolean;
  folderName: string | null;
  usingOPFS: boolean;
  connectedTabCount: number;
};

type InitOk = {
  gitEnabled: boolean;
  folderName: string | null;
  usingOPFS: boolean;
};

type InitMessage = {
  folderHandle?: FileSystemDirectoryHandle;
  useOPFS?: boolean;
  createDummyNotes?: boolean;
  gitAuthor: { name: string; email: string };
};

function setupGoodbye(port: MessagePort): void {
  window.addEventListener("pagehide", (e) => {
    if (e.persisted) return;
    try {
      port.postMessage({ action: "goodbye" });
    } catch {
      // port already closed; nothing to do
    }
  });
}

function setupGlobalEventListener(port: MessagePort): void {
  port.addEventListener("message", (e: MessageEvent) => {
    const data = e.data;
    if (!data || typeof data !== "object") return;
    if (data.event === "gitEnabled" && !gitEnabledFlag) {
      gitEnabledFlag = true;
      notifyGitEnabledSubscribers();
    }
  });
}

function ensureSharedWorker(): MessagePort {
  if (workerPort) return workerPort;
  sharedWorker = new SharedWorker(notesWorkerUrl, { type: "module" });
  const port = sharedWorker.port;
  port.start();
  workerPort = port;
  setupGoodbye(port);
  setupGlobalEventListener(port);
  return port;
}

function sendHello(port: MessagePort): Promise<HelloAck> {
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
  port: MessagePort,
  message: InitMessage,
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
          usingOPFS: Boolean(data.usingOPFS),
        });
      } else if (data.action === "initError") {
        port.removeEventListener("message", onMessage);
        reject(new Error(data.error as string));
      }
    };
    port.addEventListener("message", onMessage);
    port.postMessage({ action: "initialize", ...message });
  });
}

function adoptInitialState(
  port: MessagePort,
  ack: { gitEnabled: boolean },
): NotesProviderProxy {
  if (ack.gitEnabled !== gitEnabledFlag) {
    gitEnabledFlag = ack.gitEnabled;
    notifyGitEnabledSubscribers();
  }
  const proxy = new NotesProviderProxy(port);
  notesProvider = proxy;
  return proxy;
}


async function initFresh(
  port: MessagePort,
  newFolderHandle: FileSystemDirectoryHandle | undefined,
  createDummyNotes: boolean,
): Promise<NotesProviderProxy> {
  if (!newFolderHandle) {
    const init = await sendInitialize(port, {
      useOPFS: true,
      createDummyNotes,
      gitAuthor: getGitAuthor(),
    });
    return adoptInitialState(port, init);
  }

  await verifyPermission(newFolderHandle, true);
  await IDB.set(FOLDER_HANDLE_STORAGE_KEY, newFolderHandle);
  folderHandle = newFolderHandle;
  const init = await sendInitialize(port, {
    folderHandle: newFolderHandle,
    gitAuthor: getGitAuthor(),
  });
  return adoptInitialState(port, init);
}


function describesSameSetup(
  ack: HelloAck,
  newFolderHandle: FileSystemDirectoryHandle | undefined,
): boolean {
  if (!newFolderHandle) {
    // Caller wants OPFS — match only if the worker is using OPFS too.
    return ack.usingOPFS;
  }
  return !ack.usingOPFS && ack.folderName === newFolderHandle.name;
}


export function requestFolderSwitch(): Promise<void> {
  if (!workerPort) {
    return Promise.reject(new Error("Notes worker not initialized"));
  }
  const port = workerPort;
  return new Promise((resolve, reject) => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.action === "resetOk") {
        port.removeEventListener("message", onMessage);
        notesProvider = null;
        folderHandle = null;
        if (gitEnabledFlag) {
          gitEnabledFlag = false;
          notifyGitEnabledSubscribers();
        }
        resolve();
      } else if (data.action === "resetDenied") {
        port.removeEventListener("message", onMessage);
        reject(new Error("OTHER_TABS_OPEN"));
      }
    };
    port.addEventListener("message", onMessage);
    port.postMessage({ action: "reset" });
  });
}


export const initializeNotesProvider = async (
  newFolderHandle?: FileSystemDirectoryHandle,
  createDummyNotes?: boolean,
): Promise<NotesProviderProxy> => {
  const port = ensureSharedWorker();
  const ack = await sendHello(port);

  if (ack.initialized) {
    if (describesSameSetup(ack, newFolderHandle)) {
      if (newFolderHandle) {
        await IDB.set(FOLDER_HANDLE_STORAGE_KEY, newFolderHandle);
        folderHandle = newFolderHandle;
      }
      return adoptInitialState(port, ack);
    }
    // Caller wants a different setup than the worker is running.
    if (ack.connectedTabCount > 1) {
      throw new Error("OTHER_TABS_OPEN");
    }
    // Sole tab — reset the worker and re-initialize.
    await requestFolderSwitch();
  }

  return initFresh(port, newFolderHandle, createDummyNotes ?? false);
};


export const initializeNotesProviderWithFolderHandleFromStorage
  = async (): Promise<NotesProviderProxy> => {
    const folderHandleFromStorage = await getFolderHandleFromStorage();
    return initializeNotesProvider(folderHandleFromStorage);
  };


export const isInitialized = (): boolean => {
  return notesProvider !== null;
};


export const getNotesProvider = (): NotesProviderProxy | null => {
  return notesProvider;
};


export const getNotesWorkerPort = (): MessagePort | null => {
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
  const mimeType = extension && MimeTypes.has(extension)
    ? MimeTypes.get(extension) as string
    : "application/neno-filestream";

  const writable = await getWritableStream({
    types: [{
      accept: {
        [mimeType]: ["." + extension],
      },
    }],
    suggestedName: fileInfo.filename,
  });

  await readable.pipeTo(writable);
};
