/*
  FileSystemAccessFs — node-fs-compatible adapter on top of a
  FileSystemDirectoryHandle. Provides the subset of the node `fs`
  module used by isomorphic-git.

  isomorphic-git probes for a `promises` namespace and uses that
  exclusively if present, so the top-level default export is itself
  the promise API with a `promises` alias pointing back at itself.
*/

const TEXT_DECODER = new TextDecoder();

const FILE_MODE = 0o100644;
const DIR_MODE = 0o040755;

type PathSegments = {
  segments: string[];
  basename: string;
};

type AnyHandle = FileSystemDirectoryHandle | FileSystemFileHandle;

export interface FsStat {
  type: "file" | "dir" | "symlink";
  mode: number;
  size: number;
  ino: number;
  mtimeMs: number;
  ctimeMs: number;
  uid: number;
  gid: number;
  dev: number;
  isFile(): boolean;
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

function splitPath(path: string): PathSegments {
  const normalized = normalizePath(path);
  const allSegments = normalized
    .split("/")
    .filter((s) => s.length > 0 && s !== ".");
  const basename = allSegments.length > 0
    ? allSegments[allSegments.length - 1]
    : "";
  return {
    segments: allSegments,
    basename,
  };
}

function hashPath(path: string): number {
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = ((hash << 5) - hash + path.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

function isNotFoundError(e: unknown): boolean {
  if (e instanceof DOMException) {
    return e.name === "NotFoundError" || e.name === "TypeMismatchError";
  }
  return false;
}

function makeEnoent(path: string): Error & { code: string } {
  const err = new Error(`ENOENT: no such file or directory, '${path}'`);
  (err as Error & { code: string }).code = "ENOENT";
  return err as Error & { code: string };
}

function makeEexist(path: string): Error & { code: string } {
  const err = new Error(`EEXIST: file already exists, '${path}'`);
  (err as Error & { code: string }).code = "EEXIST";
  return err as Error & { code: string };
}

async function getDirectoryHandleByPath(
  root: FileSystemDirectoryHandle,
  segments: string[],
  create: boolean,
): Promise<FileSystemDirectoryHandle> {
  let handle: FileSystemDirectoryHandle = root;
  for (const segment of segments) {
    handle = await handle.getDirectoryHandle(segment, { create });
  }
  return handle;
}

async function getParentAndName(
  root: FileSystemDirectoryHandle,
  path: string,
  createParents: boolean,
): Promise<{ parent: FileSystemDirectoryHandle; name: string }> {
  const { segments, basename } = splitPath(path);
  if (segments.length === 0) {
    throw makeEnoent(path);
  }
  const parentSegments = segments.slice(0, segments.length - 1);
  const parent = await getDirectoryHandleByPath(
    root,
    parentSegments,
    createParents,
  );
  return { parent, name: basename };
}

function makeStat(args: {
  type: "file" | "dir" | "symlink";
  size: number;
  mtimeMs: number;
  path: string;
}): FsStat {
  const { type, size, mtimeMs, path } = args;
  const mode = type === "dir" ? DIR_MODE : FILE_MODE;
  return {
    type,
    mode,
    size,
    ino: hashPath(path),
    mtimeMs,
    ctimeMs: mtimeMs,
    uid: 1,
    gid: 1,
    dev: 1,
    isFile: () => type === "file",
    isDirectory: () => type === "dir",
    isSymbolicLink: () => type === "symlink",
  };
}

async function getEntry(
  root: FileSystemDirectoryHandle,
  path: string,
): Promise<AnyHandle> {
  const { segments } = splitPath(path);
  if (segments.length === 0) {
    return root;
  }
  const { parent, name } = await getParentAndName(root, path, false);
  // Try as file first, then as directory.
  try {
    return await parent.getFileHandle(name);
  } catch (e) {
    if (!isNotFoundError(e) && !(e instanceof TypeError)) {
      throw e;
    }
  }
  return await parent.getDirectoryHandle(name);
}

export default class FileSystemAccessFs {
  #root: FileSystemDirectoryHandle;
  promises: FileSystemAccessFs;

  constructor(root: FileSystemDirectoryHandle) {
    this.#root = root;
    this.promises = this;
  }

  async readFile(
    path: string,
    options?: { encoding?: string } | string,
  ): Promise<Uint8Array | string> {
    const encoding = typeof options === "string"
      ? options
      : options?.encoding;
    let fileHandle: FileSystemFileHandle;
    try {
      const { parent, name } = await getParentAndName(
        this.#root,
        path,
        false,
      );
      fileHandle = await parent.getFileHandle(name);
    } catch (e) {
      if (isNotFoundError(e)) throw makeEnoent(path);
      throw e;
    }
    const file = await fileHandle.getFile();
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (encoding === "utf8" || encoding === "utf-8") {
      return TEXT_DECODER.decode(bytes);
    }
    return bytes;
  }

  async writeFile(
    path: string,
    data: Uint8Array | string,
    _options?: { encoding?: string; mode?: number } | string,
  ): Promise<void> {
    const { parent, name } = await getParentAndName(
      this.#root,
      path,
      true,
    );
    const fileHandle = await parent.getFileHandle(name, { create: true });
    const writable = await fileHandle.createWritable();
    if (typeof data === "string") {
      await writable.write(data);
    } else {
      const exact = data.buffer.slice(
        data.byteOffset,
        data.byteOffset + data.byteLength,
      ) as ArrayBuffer;
      await writable.write(exact);
    }
    await writable.close();
  }

  async unlink(path: string): Promise<void> {
    try {
      const { parent, name } = await getParentAndName(
        this.#root,
        path,
        false,
      );
      await parent.removeEntry(name);
    } catch (e) {
      if (isNotFoundError(e)) throw makeEnoent(path);
      throw e;
    }
  }

  async readdir(path: string): Promise<string[]> {
    let dir: FileSystemDirectoryHandle;
    try {
      const { segments } = splitPath(path);
      dir = await getDirectoryHandleByPath(this.#root, segments, false);
    } catch (e) {
      if (isNotFoundError(e)) throw makeEnoent(path);
      throw e;
    }
    const names: string[] = [];
    // @ts-ignore — async iterator for FileSystemDirectoryHandle
    for await (const entry of dir.values()) {
      names.push((entry as AnyHandle).name);
    }
    return names;
  }

  async mkdir(
    path: string,
    _options?: { recursive?: boolean; mode?: number },
  ): Promise<void> {
    const { segments, basename } = splitPath(path);
    if (segments.length === 0) return;
    const parentSegments = segments.slice(0, segments.length - 1);
    const parent = await getDirectoryHandleByPath(
      this.#root,
      parentSegments,
      true,
    );
    try {
      await parent.getDirectoryHandle(basename, { create: false });
      throw makeEexist(path);
    } catch (e) {
      if (!isNotFoundError(e)) {
        // Attempt to proceed — may already be a file, which we let bubble.
        if ((e as { code?: string }).code === "EEXIST") throw e;
      }
    }
    await parent.getDirectoryHandle(basename, { create: true });
  }

  async rmdir(path: string): Promise<void> {
    try {
      const { parent, name } = await getParentAndName(
        this.#root,
        path,
        false,
      );
      await parent.removeEntry(name);
    } catch (e) {
      if (isNotFoundError(e)) throw makeEnoent(path);
      throw e;
    }
  }

  async stat(path: string): Promise<FsStat> {
    let entry: AnyHandle;
    try {
      entry = await getEntry(this.#root, path);
    } catch (e) {
      if (isNotFoundError(e)) throw makeEnoent(path);
      throw e;
    }

    if (entry.kind === "file") {
      const file = await (entry as FileSystemFileHandle).getFile();
      return makeStat({
        type: "file",
        size: file.size,
        mtimeMs: file.lastModified,
        path,
      });
    }
    return makeStat({
      type: "dir",
      size: 0,
      mtimeMs: 0,
      path,
    });
  }

  async lstat(path: string): Promise<FsStat> {
    return this.stat(path);
  }

  async readlink(_path: string): Promise<string> {
    const err = new Error("ENOSYS: symlinks not supported");
    (err as Error & { code: string }).code = "ENOSYS";
    throw err;
  }

  async symlink(_target: string, _path: string): Promise<void> {
    const err = new Error("ENOSYS: symlinks not supported");
    (err as Error & { code: string }).code = "ENOSYS";
    throw err;
  }

  async chmod(_path: string, _mode: number): Promise<void> {
    // No-op: FSA API has no POSIX modes.
  }
}
