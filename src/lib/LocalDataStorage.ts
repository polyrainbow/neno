import * as IDB from "idb-keyval";
import FileSystemAccessAPIStorageProvider
  from "./FileSystemAccessAPIStorageProvider";
import { getWritableStream, streamToBlob } from "./utils";
import MimeTypes from "./MimeTypes";
import NotesProvider from "./notes";
import { Slug } from "./notes/types/Slug";
import { createDemoGraph } from "./DemoGraph";
import { FileInfo } from "./notes/types/FileInfo";

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
  throw new Error("User did not grant permission to " + fileSystemHandle.name);
}


const FOLDER_HANDLE_STORAGE_KEY = "LOCAL_DB_FOLDER_HANDLE";
let folderHandle: FileSystemDirectoryHandle | null = null;
let notesProvider: NotesProvider | null = null;


export const getExistingFolderHandleName = async (): Promise<string | null> => {
  if (folderHandle) {
    return folderHandle.name;
  }

  const folderHandleFromStorage = await IDB.get<FileSystemDirectoryHandle>(
    FOLDER_HANDLE_STORAGE_KEY,
  );
  if (folderHandleFromStorage) {
    return folderHandleFromStorage.name;
  }

  return null;
};


export const getActiveFolderHandle = (): FileSystemDirectoryHandle | null => {
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

/*
  Creates a NotesProvider that stores all data in the Origin private file system
*/
const createOPFSNotesProvider = async (
  createDummyNotes: boolean,
): Promise<NotesProvider> => {
  const opfsDirectory = await navigator.storage.getDirectory();
  const memoryStorageProvider = new FileSystemAccessAPIStorageProvider(
    opfsDirectory,
  );
  if (createDummyNotes) {
    for (let i = 1; i <= 1000; i++) {
      await memoryStorageProvider.writeObject(
        "note-" + i + ".subtext",
        "Test note " + i,
      );
    }
  }
  notesProvider = new NotesProvider(memoryStorageProvider);
  return notesProvider;
};


export const initializeNotesProvider = async (
  newFolderHandle?: FileSystemDirectoryHandle,
  createDummyNotes?: boolean,
): Promise<NotesProvider> => {
  if (!newFolderHandle) {
    return createOPFSNotesProvider(createDummyNotes ?? false);
  }

  await verifyPermission(newFolderHandle, true);

  await IDB.set(
    FOLDER_HANDLE_STORAGE_KEY,
    newFolderHandle,
  );

  folderHandle = newFolderHandle;

  const storageProvider = new FileSystemAccessAPIStorageProvider(folderHandle);
  notesProvider = new NotesProvider(storageProvider);

  if (!(await notesProvider.graphExistsInStorage())) {
    await createDemoGraph(notesProvider);
  }
  return notesProvider;
};


export const initializeNotesProviderWithFolderHandleFromStorage = async (
): Promise<NotesProvider> => {
  const folderHandleFromStorage = await getFolderHandleFromStorage();
  return initializeNotesProvider(folderHandleFromStorage);
};


export const isInitialized = (): boolean => {
  return notesProvider instanceof NotesProvider;
};


export const getNotesProvider = (): NotesProvider | null => {
  return notesProvider;
};


export const invalidateNotesProvider = async (): Promise<NotesProvider> => {
  if (!folderHandle) {
    throw new Error("No folder handle available");
  }
  const notesProvider = await initializeNotesProvider(folderHandle);
  return notesProvider;
};


export const getObjectUrlForArbitraryGraphFile = async (
  fileInfo: FileInfo,
): Promise<string> => {
  if (!notesProvider) {
    throw new Error("Notes provider not initialized");
  }

  const readable
    = await notesProvider.getReadableArbitraryGraphFileStream(fileInfo.slug);
  const extension = NotesProvider.getExtensionFromFilename(fileInfo.filename);
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
  const extension = NotesProvider.getExtensionFromFilename(slug);
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
