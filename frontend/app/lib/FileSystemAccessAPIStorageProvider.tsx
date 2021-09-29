export default class FileSystemAccessAPIStorageProvider {
  #directoryHandle;

  DS = "/";

  constructor(directoryHandle) {
    this.#directoryHandle = directoryHandle;
  }


  async getSubFolderHandle(folderHandle, subDirName) {
    const subDir = await folderHandle.getDirectoryHandle(
      subDirName,
      {
        create: true,
      },
    );
    return subDir;
  }


  async getFileHandle(requestPath) {
    const pathSegments = this.splitPath(requestPath);

    let dirHandle = this.#directoryHandle;

    for (let i = 0; i < pathSegments.length - 1; i++) {
      dirHandle = await this.getSubFolderHandle(
        dirHandle,
        pathSegments[i],
      );
    }

    const filename = pathSegments[pathSegments.length - 1];
    const fileHandle = await dirHandle.getFileHandle(
      filename,
      {
        create: true,
      },
    );
    return fileHandle;
  }


  async writeObject(
    requestPath,
    data,
  ) {
    const fileHandle = await this.getFileHandle(requestPath);
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }


  async writeObjectFromReadable(
    requestPath,
    readableStream,
  ) {
    const fileHandle = await this.getFileHandle(requestPath);
    const writable = await fileHandle.createWritable();
    await readableStream.pipeTo(writable);
  }


  async readObjectAsString(requestPath) {
    const fileHandle = await this.getFileHandle(requestPath);
    const file = await fileHandle.getFile();
    const string = await file.text();
    return string;
  }


  async getReadableStream(requestPath) {
    const fileHandle = await this.getFileHandle(requestPath);
    const file = await fileHandle.getFile();
    const readable = file.stream();
    return readable;
  }


  async removeObject(requestPath) {
    const subDirName = requestPath.substr(0, requestPath.indexOf(this.DS));
    const subDir = this.#directoryHandle.getDirectoryHandle(subDirName);
    const filename = requestPath.substr(requestPath.indexOf(this.DS) + 1);
    await subDir.removeEntry(filename);
  }


  async listSubDirectories(requestPath) {
    let dirHandle = this.#directoryHandle;

    if (requestPath.length > 0) {
      const subfolders = this.splitPath(requestPath);

      for (let i = 0; i < subfolders.length; i++) {
        dirHandle = await this.getSubFolderHandle(
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
        //@ts-ignore
        values.push(iteration.value);
      } else {
        done = true;
      }
    }

    const directoryNames = values
      //@ts-ignore
      .filter((value) => value.kind === "directory")
      //@ts-ignore
      .map((dirHandle) => dirHandle.name);

    return directoryNames;
  }


  async listDirectory(requestPath) {
    const subfolders = this.splitPath(requestPath);

    let dirHandle = this.#directoryHandle;

    for (let i = 0; i < subfolders.length; i++) {
      dirHandle = await this.getSubFolderHandle(
        dirHandle,
        subfolders[i],
      );
    }

    const iterator = dirHandle.values();
    const values = [];
    let done = false;

    while (!done) {
      const iteration = await iterator.next();
      if (!iteration.done) {
        //@ts-ignore
        values.push(iteration.value);
      } else {
        done = true;
      }
    }

    const entryNames = values
      //@ts-ignore
      .map((dirHandle) => dirHandle.name);

    return entryNames;
  }

  joinPath(...args) {
    return args.join(this.DS);
  }

  splitPath(path) {
    return path.split(this.DS);
  }
}
