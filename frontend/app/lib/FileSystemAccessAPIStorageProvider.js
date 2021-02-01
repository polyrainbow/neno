export default class FileSystemAccessAPIStorageProvider {
  #directoryHandle;

  DS = "/";

  constructor(directoryHandle) {
    this.#directoryHandle = directoryHandle;
  }


  async getFileHandle(requestPath) {
    const subDirName = requestPath.substr(0, requestPath.indexOf(this.DS));
    const subDir = await this.#directoryHandle.getDirectoryHandle(
      subDirName,
      {
        create: true,
      },
    );
    const filename = requestPath.substr(requestPath.indexOf(this.DS) + 1);
    const fileHandle = await subDir.getFileHandle(
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
    const writable = fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }

  async writeObjectFromReadable(
    requestPath,
    readableStream,
  ) {
    const fileHandle = await this.getFileHandle(requestPath);
    const writable = fileHandle.createWritable();
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
    const file = fileHandle.getFile();
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
    return this.#directoryHandle.values();
  }

  async listDirectory(requestPath) {
    return this.#directoryHandle.values();
  }

  joinPath(...args) {
    return args.join(this.DS);
  }
}
