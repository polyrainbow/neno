/*
  StorageProvider implementation backed by node:fs/promises, rooted at an
  absolute path on the user's disk. This is the Electron counterpart of
  src/lib/FileSystemAccessAPIStorageProvider.tsx and mirrors its
  behaviour, including the open-file-descriptor semaphore and the NFC
  normalization of names read from disk.
*/

import * as fs from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import * as path from "node:path";
import { Readable, Writable } from "node:stream";
import ByteRange from "../../src/lib/notes/types/ByteRange";
import StorageProvider from "../../src/lib/notes/types/StorageProvider";

export default class NodeFsStorageProvider implements StorageProvider {
  constructor(rootPath: string) {
    this.#rootPath = rootPath;
  }


  /** **************
    PRIVATE
  ****************/

  /*
    Ensures that there are no more than #MAX_OPEN_FILES files opened in
    parallel, as the OS might have an upper limit (e.g. 1024 on Fedora).
    Every function that opens a file descriptor should call this
    function before starting with the main logic.
    Exceptions are functions that are not closing the file descriptor before
    the function is finished, e.g. when it is returning a Readable that can
    be read after the function is finished. We currently cannot track them.
  */
  #MAX_OPEN_FILES = 512;
  #rootPath: string;
  #jobsInProgress = 0;
  #jobPromiseQueue: Array<PromiseWithResolvers<void>> = [];

  async #scheduleJob(): Promise<void> {
    if (this.#jobsInProgress < this.#MAX_OPEN_FILES) {
      this.#jobsInProgress++;
    } else {
      const promiseWithResolvers = Promise.withResolvers<void>();
      this.#jobPromiseQueue.push(promiseWithResolvers);
      await promiseWithResolvers.promise;
    }
  }

  #declareJobDone(): void {
    if (this.#jobPromiseQueue.length > 0) {
      const jobPromise = this.#jobPromiseQueue.shift()!;
      jobPromise.resolve();
    } else {
      this.#jobsInProgress--;
    }
  }

  /*
    Resolves a graph-relative request path to an absolute path, rejecting
    anything that would escape the graph folder.
  */
  #resolve(requestPath: string): string {
    const segments = requestPath
      .split("/")
      .filter((segment) => segment.length > 0);

    if (segments.some((segment) => segment === "." || segment === "..")) {
      throw new Error("Invalid request path: " + requestPath);
    }

    const resolved = path.join(this.#rootPath, ...segments);

    if (
      resolved !== this.#rootPath
      && !resolved.startsWith(this.#rootPath + path.sep)
    ) {
      throw new Error("Invalid request path: " + requestPath);
    }

    return resolved;
  }


  async #ensureParentDirectory(absolutePath: string): Promise<void> {
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  }


  async #getFilenamesInFolder(folderPath: string): Promise<string[]> {
    const absolutePath = this.#resolve(folderPath);

    let entries;
    try {
      entries = await fs.readdir(absolutePath, { withFileTypes: true });
    } catch (e) {
      if ((e as { code?: string }).code === "ENOENT") return [];
      throw e;
    }

    const filenames: string[] = [];

    for (const entry of entries) {
      /*
        macOS returns directory listings in NFD; the rest of the app
        assumes NFC, so normalize as early as possible.
      */
      const name = entry.name.normalize("NFC");
      if (entry.isDirectory()) {
        const filesInSubFolder = await this.#getFilenamesInFolder(
          this.#joinPath(folderPath, name),
        );
        filenames.push(
          ...filesInSubFolder.map(
            (filename) => this.#joinPath(name, filename),
          ),
        );
      } else {
        filenames.push(name);
      }
    }

    return filenames;
  }


  async #getFolderSize(folderPath: string): Promise<number> {
    const absolutePath = this.#resolve(folderPath);

    let entries;
    try {
      entries = await fs.readdir(absolutePath, { withFileTypes: true });
    } catch (e) {
      if ((e as { code?: string }).code === "ENOENT") return 0;
      throw e;
    }

    let sum = 0;

    for (const entry of entries) {
      const name = entry.name.normalize("NFC");
      if (entry.isDirectory()) {
        sum += await this.#getFolderSize(this.#joinPath(folderPath, name));
      } else {
        const stats = await fs.stat(path.join(absolutePath, entry.name));
        sum += stats.size;
      }
    }

    return sum;
  }


  #joinPath(...args: string[]): string {
    return args.filter((arg) => arg.length > 0).join(this.DS);
  }


  /** **************
    PUBLIC
  ****************/

  DS = "/";


  async writeObject(
    requestPath: string,
    data: string | Uint8Array,
  ): Promise<void> {
    await this.#scheduleJob();
    try {
      const absolutePath = this.#resolve(requestPath);
      await this.#ensureParentDirectory(absolutePath);
      await fs.writeFile(absolutePath, data);
    } finally {
      this.#declareJobDone();
    }
  }


  async renameObject(
    oldRequestPath: string,
    newRequestPath: string,
  ): Promise<void> {
    const oldAbsolutePath = this.#resolve(oldRequestPath);
    const newAbsolutePath = this.#resolve(newRequestPath);
    await this.#ensureParentDirectory(newAbsolutePath);
    await fs.rename(oldAbsolutePath, newAbsolutePath);
  }


  async writeObjectFromReadable(
    requestPath: string,
    readableStream: ReadableStream,
  ): Promise<number> {
    await this.#scheduleJob();
    try {
      const absolutePath = this.#resolve(requestPath);
      await this.#ensureParentDirectory(absolutePath);
      await readableStream.pipeTo(
        Writable.toWeb(createWriteStream(absolutePath)) as WritableStream,
      );
      const stats = await fs.stat(absolutePath);
      return stats.size;
    } finally {
      this.#declareJobDone();
    }
  }


  async readObjectAsString(requestPath: string): Promise<string> {
    await this.#scheduleJob();
    try {
      return await fs.readFile(this.#resolve(requestPath), "utf8");
    } finally {
      this.#declareJobDone();
    }
  }


  async getReadableStream(
    requestPath: string,
    range?: ByteRange,
  ): Promise<ReadableStream<Uint8Array>> {
    const absolutePath = this.#resolve(requestPath);
    // Touch the file first so a missing file rejects here rather than
    // asynchronously inside the stream.
    await fs.stat(absolutePath);
    const nodeReadable = createReadStream(
      absolutePath,
      range ? { start: range.start, end: range.end } : undefined,
    );
    return Readable.toWeb(nodeReadable) as ReadableStream<Uint8Array>;
  }


  async removeObject(requestPath: string): Promise<void> {
    await fs.rm(this.#resolve(requestPath));
  }


  async listSubDirectories(requestPath: string): Promise<string[]> {
    const absolutePath = this.#resolve(requestPath);
    const entries = await fs.readdir(absolutePath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name.normalize("NFC"));
  }


  async getAllObjectNames(): Promise<string[]> {
    return this.#getFilenamesInFolder("");
  }


  async getObjectSize(requestPath: string): Promise<number> {
    const stats = await fs.stat(this.#resolve(requestPath));
    return stats.size;
  }


  async getTotalSize(): Promise<number> {
    return this.#getFolderSize("");
  }
}
