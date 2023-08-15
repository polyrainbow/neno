/*
  This class provides an adapter for the Notes module to manipulate files
  and folders on the user's local machina via the File System Access API.
  More info: https://web.dev/file-system-access/
*/

import ByteRange from "../lib/notes/interfaces/ByteRange";
import StorageProvider from "../lib/notes/interfaces/StorageProvider";

export default class FileSystemAccessAPIStorageProvider
implements StorageProvider {
  constructor(directoryHandle: FileSystemDirectoryHandle) {
    this.#directoryHandle = directoryHandle;
  }


  /** **************
    PRIVATE
  ****************/


  #directoryHandle: FileSystemDirectoryHandle;
  #descendantFolderHandles: Map<string, FileSystemDirectoryHandle> = new Map();


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
      ? this.splitPath(descendantFolderPath)
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
    const pathSegments = this.splitPath(filePath);
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
    const fileHandle = await this.#getFileHandle(requestPath, true);
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }

  async renameFile(
    requestPath: string,
    newName: string,
  ): Promise<void> {
    const fileHandle = await this.#getFileHandle(requestPath, true);
    // @ts-ignore not correctly typed
    await fileHandle.move(newName);
  }

  async writeObjectFromReadable(
    requestPath: string,
    readableStream: ReadableStream,
  ): Promise<number> {
    const fileHandle = await this.#getFileHandle(requestPath, true);
    const writable = await fileHandle.createWritable();
    await readableStream.pipeTo(writable);
    const size = await this.getFileSize(requestPath);
    return size;
  }


  async readObjectAsString(
    requestPath: string,
  ): Promise<string> {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const string = await file.text();
    return string;
  }


  async getReadableStream(
    requestPath: string,
    // eslint-disable-next-line
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


  async listDirectory(
    requestPath?: string,
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

    const entryNames = values
      .map((dirHandle) => dirHandle.name);

    return entryNames;
  }


  joinPath(...args: string[]): string {
    return args.filter((arg) => arg.length > 0).join(this.DS);
  }


  splitPath(path: string): string[] {
    return path.split(this.DS);
  }


  async getFileSize(
    requestPath: string,
  ): Promise<number> {
    const fileHandle = await this.#getFileHandle(requestPath, false);
    const file = await fileHandle.getFile();
    const size = file.size;
    return size;
  }


  async getFolderSize(
    requestPath?: string,
  ): Promise<number> {
    const folderHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      requestPath,
    );

    const values: (FileSystemDirectoryHandle | FileSystemFileHandle)[] = [];
    // @ts-ignore not correctly typed
    for await (const handle of folderHandle.values()) {
      values.push(handle);
    }

    const entryNames = values
      .filter((value): value is FileSystemFileHandle => value.kind === "file");

    const filePromises = entryNames
      .map((fileHandle) => {
        return fileHandle.getFile();
      });

    const files = await Promise.all(filePromises);
    const fileSizes = files.map((file) => file.size);
    const folderSize = fileSizes.reduce((accumulator, size) => {
      return accumulator + size;
    }, 0);

    return folderSize;
  }
}
