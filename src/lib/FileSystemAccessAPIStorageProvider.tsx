/*
  This class provides an adapter for the Notes module to manipulate files
  and folders on the user's local machine via the File System Access API.
  More info: https://web.dev/file-system-access/
*/

import ByteRange from "./notes/types/ByteRange";
import StorageProvider from "./notes/types/StorageProvider";

export default class FileSystemAccessAPIStorageProvider
implements StorageProvider {
  constructor(directoryHandle: FileSystemDirectoryHandle) {
    this.#directoryHandle = directoryHandle;
  }


  /** **************
    PRIVATE
  ****************/


  #MAX_OPEN_FILES = 512;
  #directoryHandle: FileSystemDirectoryHandle;
  #descendantFolderHandles: Map<string, FileSystemDirectoryHandle> = new Map();
  #jobsInProgress = 0;
  #jobPromiseQueue: Array<PromiseWithResolvers<void>> = [];

  /*
    Ensures that there are no more than #MAX_OPEN_FILES files opened in
    parallel, as the OS might have an upper limit (e.g. 1024 on Fedora).
    Every function that opens a file descriptor should call this
    function before starting with the main logic.
    Exceptions are functions that are not closing the file descriptor before the
    function is finished, e.g. when it is returning a Readable that can be
    read after the function is finished. We currently cannot track them.
  */
  async #scheduleJob(): Promise<void> {
    if (this.#jobsInProgress < this.#MAX_OPEN_FILES) {
      this.#jobsInProgress++;
    } else {
      const promiseWithResolvers = Promise.withResolvers<void>();
      this.#jobPromiseQueue.push(promiseWithResolvers);
      await promiseWithResolvers.promise;
    }
  }

  /*
    Every function that reads from or writes to a file should call this
    function after it is finished reading, or after an error occured.
  */
  #declareJobDone(): void {
    if (this.#jobPromiseQueue.length > 0) {
      const jobPromise = this.#jobPromiseQueue.shift()!;
      jobPromise.resolve();
    } else {
      this.#jobsInProgress--;
    }
  }

  async #getSubFolderHandle(
    folderHandle: FileSystemDirectoryHandle,
    subDirName: string,
  ): Promise<FileSystemDirectoryHandle> {
    const subDir = await folderHandle.getDirectoryHandle(
      subDirName,
      {
        create: true,
      },
    );
    return subDir;
  }


  async #getDescendantFolderHandle(
    folderHandle: FileSystemDirectoryHandle,
    descendantFolderPath?: string,
  ): Promise<FileSystemDirectoryHandle> {
    if (!descendantFolderPath) {
      return folderHandle;
    }

    if (this.#descendantFolderHandles.has(descendantFolderPath)) {
      return this.#descendantFolderHandles.get(
        descendantFolderPath,
      ) as FileSystemDirectoryHandle;
    }

    const pathSegments = descendantFolderPath.length > 0
      ? this.#splitPath(descendantFolderPath)
      : [];

    let dirHandle = folderHandle;

    for (const pathSegment of pathSegments) {
      dirHandle = await this.#getSubFolderHandle(
        dirHandle,
        pathSegment,
      );
    }

    this.#descendantFolderHandles.set(descendantFolderPath, dirHandle);

    return dirHandle;
  }


  async #getDescendantFileHandle(
    folderHandle: FileSystemDirectoryHandle,
    filePath: string,
    create: boolean,
  ): Promise<FileSystemFileHandle> {
    const pathSegments = this.#splitPath(filePath);
    const folderPathSegments = pathSegments.slice(0, pathSegments.length - 1);
    const filename = pathSegments[pathSegments.length - 1];

    const destinationFolderHandle = (folderPathSegments.length > 0)
      ? await this.#getDescendantFolderHandle(
        folderHandle,
        folderPathSegments.join(this.DS),
      )
      : folderHandle;

    const fileHandle = await destinationFolderHandle.getFileHandle(
      filename,
      {
        create,
      },
    );
    return fileHandle;
  }


  async #getFileHandle(
    requestPath: string,
    create: boolean,
  ): Promise<FileSystemFileHandle> {
    return await this.#getDescendantFileHandle(
      this.#directoryHandle,
      requestPath,
      create,
    );
  }


  /** **************
    PUBLIC
  ****************/

  DS = "/";


  async writeObject(
    requestPath: string,
    data: FileSystemWriteChunkType,
  ): Promise<void> {
    await this.#scheduleJob();
    try {
      const fileHandle = await this.#getFileHandle(requestPath, true);
      const writable = await fileHandle.createWritable();
      await writable.write(data);
      await writable.close();
    } finally {
      this.#declareJobDone();
    }
  }

  async renameObject(
    oldRequestPath: string,
    newRequestPath: string,
  ): Promise<void> {
    const oldFolder = oldRequestPath.substring(
      0,
      oldRequestPath.lastIndexOf("/"),
    );
    const newFolder = newRequestPath.substring(
      0,
      newRequestPath.lastIndexOf("/"),
    );

    if (oldFolder === newFolder) {
      const fileHandle = await this.#getFileHandle(oldRequestPath, true);
      const newEntryName = newRequestPath.substring(
        newRequestPath.indexOf("/") + 1,
      );
      // @ts-ignore not correctly typed
      await fileHandle.move(newEntryName);
    } else {
      await this.writeObjectFromReadable(
        newRequestPath,
        await this.getReadableStream(oldRequestPath),
      );
      await this.removeObject(oldRequestPath);
    }
  }

  async writeObjectFromReadable(
    requestPath: string,
    readableStream: ReadableStream,
  ): Promise<number> {
    await this.#scheduleJob();
    try {
      const fileHandle = await this.#getFileHandle(requestPath, true);
      const writable = await fileHandle.createWritable();
      await readableStream.pipeTo(writable);
      const size = await this.getObjectSize(requestPath);
      return size;
    } finally {
      this.#declareJobDone();
    }
  }


  async readObjectAsString(
    requestPath: string,
  ): Promise<string> {
    await this.#scheduleJob();
    try {
      const fileHandle = await this.#getFileHandle(requestPath, false);
      const file = await fileHandle.getFile();
      const string = await file.text();
      return string;
    } finally {
      this.#declareJobDone();
    }
  }


  async getReadableStream(
    requestPath: string,
    _range?: ByteRange, // to be implemented
  ): Promise<ReadableStream<Uint8Array>> {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const readable = file.stream();
    return readable;
  }


  async removeObject(
    requestPath: string,
  ) {
    const folderPath = requestPath.substring(
      0,
      requestPath.lastIndexOf(this.DS),
    );
    const dir = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      folderPath,
    );
    const filename = requestPath
      .substring(requestPath.lastIndexOf(this.DS) + 1);
    await dir.removeEntry(filename);
  }


  async listSubDirectories(
    requestPath: string,
  ): Promise<string[]> {
    const dirHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      requestPath,
    );

    const values: (FileSystemDirectoryHandle | FileSystemFileHandle)[] = [];
    // @ts-ignore not correctly typed
    for await (const handle of dirHandle.values()) {
      values.push(handle);
    }

    const directoryNames = values
      .filter((value) => value.kind === "directory")
      .map((dirHandle) => dirHandle.name);

    return directoryNames;
  }


  async #getFilenamesInFolder(folderPath: string): Promise<string[]> {
    const dirHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      folderPath,
    );

    const filenames: string[] = [];
    // @ts-ignore not correctly typed
    for await (const handle of dirHandle.values()) {
      if (handle.kind === "file") {
        filenames.push(handle.name);
      } else {
        const filesInSubFolder = await this.#getFilenamesInFolder(
          this.#joinPath(folderPath, handle.name),
        );
        const requestPaths = filesInSubFolder.map(filename => {
          return this.#joinPath(handle.name, filename);
        });
        filenames.push(...requestPaths);
      }
    }
    return filenames;
  }


  async getAllObjectNames(): Promise<string[]> {
    return this.#getFilenamesInFolder("");
  }


  #joinPath(...args: string[]): string {
    return args.filter((arg) => arg.length > 0).join(this.DS);
  }


  #splitPath(path: string): string[] {
    return path.split(this.DS);
  }


  async getObjectSize(
    requestPath: string,
  ): Promise<number> {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const size = file.size;
    return size;
  }


  async #getFolderSize(folderPath: string): Promise<number> {
    const folderHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      folderPath,
    );

    let sum = 0;

    // @ts-ignore not correctly typed
    for await (const handle of folderHandle.values()) {
      if (handle.kind === "file") {
        const file = await handle.getFile();
        const fileSize = file.size;
        sum += fileSize;
      } else {
        const folderSize = await this.#getFolderSize(
          this.#joinPath(folderPath, handle.name),
        );
        sum += folderSize;
      }
    }

    return sum;
  }


  async getTotalSize(): Promise<number> {
    return this.#getFolderSize("");
  }
}
