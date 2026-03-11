import * as IDB from "idb-keyval";
import { getWritableStream, streamToBlob } from "./utils";
import MimeTypes from "./MimeTypes";
import NotesProviderProxy from "./notes-worker/NotesProviderProxy";
import { Slug } from "./notes/types/Slug";
import { FileInfo } from "./notes/types/FileInfo";
// @ts-ignore Vite worker URL import
import notesWorkerUrl from "./notes-worker/index.ts?worker&url";
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
let folderHandle: FileSystemDirectoryHandle | null = null;
let notesProvider: NotesProviderProxy | null = null;
let notesWorker: Worker | null = null;


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


function createNotesWorkerAndProxy(
  initMessage: Record<string, unknown>,
): Promise<NotesProviderProxy> {
  if (notesWorker) {
    notesWorker.terminate();
  }

  const worker = new Worker(notesWorkerUrl, { type: "module" });
  notesWorker = worker;

  return new Promise((resolve, reject) => {
    const onMessage = (e: MessageEvent) => {
      if (e.data.action === "initialized") {
        worker.removeEventListener("message", onMessage);
        const proxy = new NotesProviderProxy(worker);
        notesProvider = proxy;
        resolve(proxy);
      } else if (e.data.action === "error") {
        worker.removeEventListener("message", onMessage);
        reject(new Error(e.data.error as string));
      }
    };
    worker.addEventListener("message", onMessage);
    worker.postMessage({
      action: "initialize",
      ...initMessage,
    });
  });
}


export const initializeNotesProvider = async (
  newFolderHandle?: FileSystemDirectoryHandle,
  createDummyNotes?: boolean,
): Promise<NotesProviderProxy> => {
  if (!newFolderHandle) {
    return createNotesWorkerAndProxy({
      useOPFS: true,
      createDummyNotes: createDummyNotes ?? false,
    });
  }

  await verifyPermission(newFolderHandle, true);

  await IDB.set(
    FOLDER_HANDLE_STORAGE_KEY,
    newFolderHandle,
  );

  folderHandle = newFolderHandle;
  return createNotesWorkerAndProxy({
    folderHandle: newFolderHandle,
  });
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


export const getNotesWorker = (): Worker | null => {
  return notesWorker;
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
