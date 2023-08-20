import * as IDB from "idb-keyval";
import FileSystemAccessAPIStorageProvider
  from "./FileSystemAccessAPIStorageProvider";
import { streamToBlob } from "./utils";
import MimeTypes from "./MimeTypes";
import NotesProvider from "./notes";
import { createDemoGraph, folderHasGraph } from "./DemoGraph";
import { Slug } from "./notes/interfaces/Slug";
import MockStorageProvider from "./notes/test/MockStorageProvider";

/*
  Notes:
  FileSystemHandle.requestPermission currently requires to be called
  from a user gesture: https://stackoverflow.com/a/69897694/3890888

  Persistent file handle permissions not yet implemented:
  https://bugs.chromium.org/p/chromium/issues/detail?id=1354695
  https://bugs.chromium.org/p/chromium/issues/detail?id=1373962
  https://bugs.chromium.org/p/chromium/issues/detail?id=1011533
  https://bugs.chromium.org/p/chromium/issues/detail?id=1467574
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
  // Check if permission was already granted. If so, return true.
  // @ts-ignore
  if ((await fileSystemHandle.queryPermission(options)) === "granted") {
    return;
  }
  // Request permission. If the user grants permission, return true.
  // @ts-ignore
  if ((await fileSystemHandle.requestPermission(options)) === "granted") {
    return;
  }
  // The user didn't grant permission
  throw new Error("User did not grant permission to " + fileSystemHandle.name);
}


const FOLDER_HANDLE_STORAGE_KEY = "LOCAL_DB_FOLDER_HANDLE";
let folderHandle: FileSystemDirectoryHandle | null = null;
let notesProvider: NotesProvider | null = null;


export const getFolderHandleName = async (): Promise<string | null> => {
  if (folderHandle) {
    return folderHandle.name;
  }

  const newFolderHandle = await IDB.get(FOLDER_HANDLE_STORAGE_KEY);
  if (!newFolderHandle) {
    return null;
  }

  folderHandle = newFolderHandle as FileSystemDirectoryHandle;
  return folderHandle.name;
};


export const getSavedFolderHandle = async (
): Promise<FileSystemDirectoryHandle> => {
  const folderHandle = await IDB.get(FOLDER_HANDLE_STORAGE_KEY);
  if (!folderHandle) {
    throw new Error("No folder handle saved");
  }
  return folderHandle as FileSystemDirectoryHandle;
};


export const initializeNotesProvider = async (
  newFolderHandle?: FileSystemDirectoryHandle,
): Promise<NotesProvider> => {
  if (!newFolderHandle) {
    const memoryStorageProvider = new MockStorageProvider();
    notesProvider = new NotesProvider(memoryStorageProvider);
    return notesProvider;
  }

  await verifyPermission(newFolderHandle, true);

  await IDB.set(
    FOLDER_HANDLE_STORAGE_KEY,
    newFolderHandle,
  );

  folderHandle = newFolderHandle;

  if (!(await folderHasGraph(folderHandle))) {
    await createDemoGraph(folderHandle);
  }

  const storageProvider = new FileSystemAccessAPIStorageProvider(folderHandle);
  notesProvider = new NotesProvider(storageProvider);
  return notesProvider;
};


export const initializeNotesProviderWithExistingFolderHandle = async (
): Promise<NotesProvider> => {
  const folderHandle = await getSavedFolderHandle();
  return initializeNotesProvider(folderHandle);
};

export const isInitialized = (): boolean => {
  return notesProvider instanceof NotesProvider;
};


export const removeAccess = async (): Promise<void> => {
  folderHandle = null;
  await IDB.del(FOLDER_HANDLE_STORAGE_KEY);
  notesProvider = null;
};


export const getNotesProvider = (): NotesProvider | null => {
  return notesProvider;
};


export const getUrlForSlug = async (slug: Slug) => {
  if (!notesProvider) {
    throw new Error("Notes provider not initialized");
  }

  const readable
    = await notesProvider.getReadableFileStream(
      slug,
    );
  const extension = NotesProvider.getExtensionFromFilename(slug);
  const mimeType = extension && MimeTypes.has(extension)
    ? MimeTypes.get(extension) as string
    : "application/neno-filestream";
  const blob = await streamToBlob(readable, mimeType);
  const url = URL.createObjectURL(blob);
  return url;
};
