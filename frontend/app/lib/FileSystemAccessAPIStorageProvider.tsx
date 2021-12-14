/*
  This class provides an adapter for the Notes module to manipulate files
  and folders on the user's local machina via the File System Access API.
  More info: https://web.dev/file-system-access/
*/

export default class FileSystemAccessAPIStorageProvider {
  constructor(directoryHandle) {
    this.#directoryHandle = directoryHandle;
  }


  /** **************
    PRIVATE
  ****************/


  #directoryHandle;


  async #getSubFolderHandle(folderHandle, subDirName:string) {
    const subDir = await folderHandle.getDirectoryHandle(
      subDirName,
      {
        create: true,
      },
    );
    return subDir;
  }


  async #getDescendantFolderHandle(folderHandle, descendantFolderPath) {
    const pathSegments = this.splitPath(descendantFolderPath);

    let dirHandle = folderHandle;

    for (const pathSegment of pathSegments) {
      dirHandle = await this.#getSubFolderHandle(
        dirHandle,
        pathSegment,
      );
    }

    return dirHandle;
  }


  async #getDescendantFileHandle(folderHandle, filePath:string) {
    const pathSegments = this.splitPath(filePath);
    const folderPathSegments = pathSegments.slice(0, pathSegments.length - 1);
    const filename = pathSegments[pathSegments.length - 1];
    const destinationFolderHandle
      = await this.#getDescendantFolderHandle(
        folderHandle,
        folderPathSegments.join(this.DS),
      );
    const fileHandle = await destinationFolderHandle.getFileHandle(
      filename,
      {
        create: true,
      },
    );
    return fileHandle;
  }


  async #getFileHandle(requestPath) {
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
  ) {
    const fileHandle = await this.#getFileHandle(requestPath);
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }


  async writeObjectFromReadable(
    graphId: string,
    requestPath,
    readableStream,
  ) {
    const fileHandle = await this.#getFileHandle(requestPath);
    const writable = await fileHandle.createWritable();
    await readableStream.pipeTo(writable);
    const size = await this.getFileSize(graphId, requestPath);
    return size;
  }


  async readObjectAsString(
    graphId: string,
    requestPath: string,
  ) {
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
    const subDir = this.#directoryHandle.getDirectoryHandle(subDirName);
    const filename = requestPath
      .substring(requestPath.indexOf(this.DS) + 1);
    await subDir.removeEntry(filename);
  }


  async listSubDirectories(
    graphId: string,
    requestPath: string,
  ) {
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

    const iterator = dirHandle.values();
    const values = [];
    let done = false;

    while (!done) {
      const iteration = await iterator.next();
      if (!iteration.done) {
        // @ts-ignore
        values.push(iteration.value);
      } else {
        done = true;
      }
    }

    const directoryNames = values
      // @ts-ignore
      .filter((value) => value.kind === "directory")
      // @ts-ignore
      .map((dirHandle) => dirHandle.name);

    return directoryNames;
  }


  async listDirectory(
    graphId: string,
    requestPath: string,
  ) {
    const dirHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      requestPath,
    );

    const iterator = dirHandle.values();
    const values = [];
    let done = false;

    while (!done) {
      const iteration = await iterator.next();
      if (!iteration.done) {
        // @ts-ignore
        values.push(iteration.value);
      } else {
        done = true;
      }
    }

    const entryNames = values
      // @ts-ignore
      .map((dirHandle) => dirHandle.name);

    return entryNames;
  }

  joinPath(...args) {
    return args.join(this.DS);
  }

  splitPath(path) {
    return path.split(this.DS);
  }


  async getFileSize(
    graphId: string,
    requestPath: string,
  ) {
    const fileHandle = await this.#getFileHandle(requestPath);
    // @ts-ignore
    const file = await fileHandle.getFile();
    const size = file.size;
    return size;
  }


  async getFolderSize(
    graphId: string,
    requestPath: string,
  ) {
    const folderHandle = await this.#getDescendantFolderHandle(
      this.#directoryHandle,
      requestPath,
    );

    const iterator = folderHandle.values();
    const values = [];
    let done = false;

    while (!done) {
      const iteration = await iterator.next();
      if (!iteration.done) {
        // @ts-ignore
        values.push(iteration.value);
      } else {
        done = true;
      }
    }

    const entryNames = values
      // @ts-ignore
      .filter((value) => value.kind === "file");

    const filePromises = entryNames
      .map((fileHandle) => {
        // @ts-ignore
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
