/*
  This class provides an adapter for the Notes module to manipulate files
  and folders on the user's local machina via the File System Access API.
  More info: https://web.dev/file-system-access/
*/

export default class FileSystemAccessAPIStorageProvider {
  constructor(directoryHandle:FileSystemDirectoryHandle) {
    this.#directoryHandle = directoryHandle;
  }


  /** **************
    PRIVATE
  ****************/


  #directoryHandle:FileSystemDirectoryHandle;


  async #getSubFolderHandle(
    folderHandle:FileSystemDirectoryHandle,
    subDirName:string,
  ):Promise<FileSystemDirectoryHandle> {
    const subDir = await folderHandle.getDirectoryHandle(
      subDirName,
      {
        create: true,
      },
    );
    return subDir;
  }


  async #getDescendantFolderHandle(
    folderHandle:FileSystemDirectoryHandle,
    descendantFolderPath:string,
  ):Promise<FileSystemDirectoryHandle> {
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

    return dirHandle;
  }


  async #getDescendantFileHandle(
    folderHandle:FileSystemDirectoryHandle,
    filePath:string,
  ):Promise<FileSystemFileHandle> {
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
        create: true,
      },
    );
    return fileHandle;
  }


  async #getFileHandle(requestPath:string):Promise<FileSystemFileHandle> {
    return await this.#getDescendantFileHandle(
      this.#directoryHandle,
      requestPath,
    );
  }


  /** **************
    PUBLIC
  ****************/

  DS = "/";


  async writeObject(
    graphId: string,
    requestPath: string,
    data,
  ):Promise<void> {
    const fileHandle = await this.#getFileHandle(requestPath);
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }


  async writeObjectFromReadable(
    graphId: string,
    requestPath:string,
    readableStream,
  ):Promise<number> {
    const fileHandle = await this.#getFileHandle(requestPath);
    const writable = await fileHandle.createWritable();
    await readableStream.pipeTo(writable);
    const size = await this.getFileSize(graphId, requestPath);
    return size;
  }


  async readObjectAsString(
    graphId: string,
    requestPath: string,
  ):Promise<string> {
    const fileHandle = await this.#getFileHandle(requestPath);
    const file = await fileHandle.getFile();
    const string = await file.text();
    return string;
  }


  async getReadableStream(
    graphId: string,
    requestPath: string,
    // eslint-disable-next-line
    range, // to be implemented
  ) {
    const fileHandle = await this.#getFileHandle(requestPath);
    const file = await fileHandle.getFile();
    const readable = file.stream();
    return readable;
  }


  async removeObject(
    graphId: string,
    requestPath: string,
  ) {
    const subDirName = requestPath.substring(0, requestPath.indexOf(this.DS));
    const subDir = await this.#directoryHandle.getDirectoryHandle(subDirName);
    const filename = requestPath
      .substring(requestPath.indexOf(this.DS) + 1);
    await subDir.removeEntry(filename);
  }


  async listSubDirectories(
    graphId: string,
    requestPath: string,
  ):Promise<string[]> {
    let dirHandle = this.#directoryHandle;

    if (requestPath.length > 0) {
      const subfolders = this.splitPath(requestPath);

      for (let i = 0; i < subfolders.length; i++) {
        dirHandle = await this.#getSubFolderHandle(
          dirHandle,
          subfolders[i],
        );
      }
    }

    const values:(FileSystemDirectoryHandle | FileSystemFileHandle)[] = [];
    for await (const handle of dirHandle.values()) {
      values.push(handle);
    }

    const directoryNames = values
      .filter((value) => value.kind === "directory")
      .map((dirHandle) => dirHandle.name);

    return directoryNames;
  }


  async listDirectory(
    graphId: string,
    requestPath: string,
  ):Promise<string[]> {
    const dirHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      requestPath,
    );

    const values:(FileSystemDirectoryHandle | FileSystemFileHandle)[] = [];
    for await (const handle of dirHandle.values()) {
      values.push(handle);
    }

    const entryNames = values
      .map((dirHandle) => dirHandle.name);

    return entryNames;
  }


  joinPath(...args:string[]):string {
    return args.join(this.DS);
  }


  splitPath(path:string):string[] {
    return path.split(this.DS);
  }


  async getFileSize(
    graphId: string,
    requestPath: string,
  ):Promise<number> {
    const fileHandle = await this.#getFileHandle(requestPath);
    const file = await fileHandle.getFile();
    const size = file.size;
    return size;
  }


  async getFolderSize(
    graphId: string,
    requestPath: string,
  ):Promise<number> {
    const folderHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      requestPath,
    );

    const values:(FileSystemDirectoryHandle | FileSystemFileHandle)[] = [];
    for await (const handle of folderHandle.values()) {
      values.push(handle);
    }

    const entryNames = values
      .filter((value):value is FileSystemFileHandle => value.kind === "file");

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
