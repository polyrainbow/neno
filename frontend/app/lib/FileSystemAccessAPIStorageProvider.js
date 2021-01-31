export default class FileSystemAccessAPIStorageProvider {
  #directoryHandle;

  constructor(directoryHandle) {
    this.#directoryHandle = directoryHandle;
  }

  async writeObject(
    requestPath,
    data,
  ) {
    const subDirName = requestPath.substr(0, requestPath.indexOf("/"));
    const subDir = this.#directoryHandle.getDirectoryHandle(subDirName,
      { create: true },
    );
    const filename = requestPath.substr(requestPath.indexOf("/") + 1);
    const fileHandle = subDir.getFileHandle(filename, { create: true });
    const writable = fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }

  async writeObjectFromReadable(
    requestPath,
    readableStream,
  ) {
    const subDirName = requestPath.substr(0, requestPath.indexOf("/"));
    const subDir = this.#directoryHandle.getDirectoryHandle(subDirName,
      { create: true },
    );
    const filename = requestPath.substr(requestPath.indexOf("/") + 1);
    const fileHandle = subDir.getFileHandle(filename, { create: true });
    const writable = fileHandle.createWritable();
    await readableStream.pipeTo(writable);
  }

  async readObject(requestPath) {
    const subDirName = requestPath.substr(0, requestPath.indexOf("/"));
    const subDir = this.#directoryHandle.getDirectoryHandle(subDirName);
    const filename = requestPath.substr(requestPath.indexOf("/") + 1);
    const fileHandle = subDir.getFileHandle(filename);
    const file = fileHandle.getFile();
    return file;
  }

  getReadableStream(requestPath) {
    const subDirName = requestPath.substr(0, requestPath.indexOf("/"));
    const subDir = this.#directoryHandle.getDirectoryHandle(subDirName);
    const filename = requestPath.substr(requestPath.indexOf("/") + 1);
    const fileHandle = subDir.getFileHandle(filename);
    const file = fileHandle.getFile();
    const readable = file.stream();
    return readable;
  }

  async removeObject(requestPath) {
    const subDirName = requestPath.substr(0, requestPath.indexOf("/"));
    const subDir = this.#directoryHandle.getDirectoryHandle(subDirName);
    const filename = requestPath.substr(requestPath.indexOf("/") + 1);
    await subDir.removeEntry(filename);
  }

  async listSubDirectories(requestPath) {
    return this.#directoryHandle.values();
  }

  async listDirectory(requestPath) {
    return this.#directoryHandle.values();
  }

  joinPath(...args) {
    return args.split("/");
  }
}
