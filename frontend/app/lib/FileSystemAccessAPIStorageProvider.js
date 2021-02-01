export default class FileSystemAccessAPIStorageProvider {
  #directoryHandle;

  DS = "/";

  constructor(directoryHandle) {
    this.#directoryHandle = directoryHandle;
  }

  async writeObject(
    requestPath,
    data,
  ) {
    const subDirName = requestPath.substr(0, requestPath.indexOf(this.DS));
    const subDir = this.#directoryHandle.getDirectoryHandle(subDirName,
      { create: true },
    );
    const filename = requestPath.substr(requestPath.indexOf(this.DS) + 1);
    const fileHandle = subDir.getFileHandle(filename, { create: true });
    const writable = fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }

  async writeObjectFromReadable(
    requestPath,
    readableStream,
  ) {
    const subDirName = requestPath.substr(0, requestPath.indexOf(this.DS));
    const subDir = this.#directoryHandle.getDirectoryHandle(subDirName,
      { create: true },
    );
    const filename = requestPath.substr(requestPath.indexOf(this.DS) + 1);
    const fileHandle = subDir.getFileHandle(filename, { create: true });
    const writable = fileHandle.createWritable();
    await readableStream.pipeTo(writable);
  }

  async readObjectAsString(requestPath) { console.log("rpath", requestPath)
    const subDirName = requestPath.substr(0, requestPath.indexOf(this.DS));
    console.log("subdirname", subDirName)
    console.log("dir handle", this.#directoryHandle)
    const subDir = await this.#directoryHandle.getDirectoryHandle(
      subDirName,
      {
        create: true,
      },
    );
    console.log("subdir", subDir)
    const filename = requestPath.substr(requestPath.indexOf(this.DS) + 1);
    console.log("filename", filename)
    const fileHandle = await subDir.getFileHandle(filename);
    console.log("fileHandle", fileHandle)
    const file = await fileHandle.getFile(); console.log("File", file)
    const string = await file.text();
    return string;
  }

  getReadableStream(requestPath) {
    const subDirName = requestPath.substr(0, requestPath.indexOf("/"));
    const subDir = this.#directoryHandle.getDirectoryHandle(subDirName);
    const filename = requestPath.substr(requestPath.indexOf(this.DS) + 1);
    const fileHandle = subDir.getFileHandle(filename);
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
