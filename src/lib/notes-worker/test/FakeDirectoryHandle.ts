/*
  Minimal in-memory fake of FileSystemDirectoryHandle /
  FileSystemFileHandle / FileSystemWritableFileStream covering the
  subset used by FileSystemAccessFs and
  FileSystemAccessAPIStorageProvider.

  Nodes are stored in a flat Map keyed by posix path so tree
  traversal stays trivial.
*/

interface FileNode {
  kind: "file";
  name: string;
  data: Uint8Array;
  lastModified: number;
}

interface DirNode {
  kind: "directory";
  name: string;
  children: Map<string, Node>;
}

type Node = FileNode | DirNode;

function makeDomException(name: string, message: string): DOMException {
  try {
    return new DOMException(message, name);
  } catch {
    const e = new Error(message) as Error & { name: string };
    e.name = name;
    return e as unknown as DOMException;
  }
}

class FakeFileSystemWritableFileStream {
  #chunks: Uint8Array[] = [];
  #target: FileNode;

  constructor(target: FileNode) {
    this.#target = target;
  }

  async write(data: unknown): Promise<void> {
    if (data === null || data === undefined) return;

    if (typeof data === "string") {
      this.#chunks.push(new TextEncoder().encode(data));
      return;
    }
    if (data instanceof ArrayBuffer) {
      this.#chunks.push(new Uint8Array(data));
      return;
    }
    if (ArrayBuffer.isView(data)) {
      const view = data as ArrayBufferView;
      this.#chunks.push(new Uint8Array(
        view.buffer.slice(
          view.byteOffset,
          view.byteOffset + view.byteLength,
        ),
      ));
      return;
    }
    if (data instanceof Blob) {
      const ab = await data.arrayBuffer();
      this.#chunks.push(new Uint8Array(ab));
      return;
    }
    throw new Error("Unsupported write data type");
  }

  async close(): Promise<void> {
    const total = this.#chunks.reduce((sum, c) => sum + c.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const c of this.#chunks) {
      out.set(c, offset);
      offset += c.length;
    }
    this.#target.data = out;
    this.#target.lastModified = Date.now();
  }

  getWriter(): never {
    throw new Error("Not implemented");
  }

  get locked(): boolean {
    return false;
  }
}

export class FakeFileHandle {
  kind = "file" as const;
  name: string;
  #node: FileNode;

  constructor(node: FileNode) {
    this.name = node.name;
    this.#node = node;
  }

  async getFile(): Promise<File> {
    const copy = this.#node.data.slice();
    const file = new File([copy], this.#node.name, {
      lastModified: this.#node.lastModified,
    });
    return file;
  }

  async createWritable(): Promise<FakeFileSystemWritableFileStream> {
    return new FakeFileSystemWritableFileStream(this.#node);
  }
}

export default class FakeDirectoryHandle {
  kind = "directory" as const;
  name: string;
  #node: DirNode;

  constructor(node?: DirNode) {
    if (node) {
      this.#node = node;
      this.name = node.name;
    } else {
      this.#node = { kind: "directory", name: "", children: new Map() };
      this.name = "";
    }
  }

  async getDirectoryHandle(
    name: string,
    options?: { create?: boolean },
  ): Promise<FakeDirectoryHandle> {
    const existing = this.#node.children.get(name);
    if (existing && existing.kind === "directory") {
      return new FakeDirectoryHandle(existing);
    }
    if (existing && existing.kind === "file") {
      throw makeDomException(
        "TypeMismatchError",
        `'${name}' is a file, not a directory`,
      );
    }
    if (options?.create) {
      const newDir: DirNode = {
        kind: "directory",
        name,
        children: new Map(),
      };
      this.#node.children.set(name, newDir);
      return new FakeDirectoryHandle(newDir);
    }
    throw makeDomException(
      "NotFoundError",
      `Directory '${name}' not found`,
    );
  }

  async getFileHandle(
    name: string,
    options?: { create?: boolean },
  ): Promise<FakeFileHandle> {
    const existing = this.#node.children.get(name);
    if (existing && existing.kind === "file") {
      return new FakeFileHandle(existing);
    }
    if (existing && existing.kind === "directory") {
      throw makeDomException(
        "TypeMismatchError",
        `'${name}' is a directory, not a file`,
      );
    }
    if (options?.create) {
      const newFile: FileNode = {
        kind: "file",
        name,
        data: new Uint8Array(0),
        lastModified: Date.now(),
      };
      this.#node.children.set(name, newFile);
      return new FakeFileHandle(newFile);
    }
    throw makeDomException(
      "NotFoundError",
      `File '${name}' not found`,
    );
  }

  async removeEntry(
    name: string,
    _options?: { recursive?: boolean },
  ): Promise<void> {
    if (!this.#node.children.has(name)) {
      throw makeDomException(
        "NotFoundError",
        `Entry '${name}' not found`,
      );
    }
    this.#node.children.delete(name);
  }

  async *values(): AsyncIterableIterator<
    FakeDirectoryHandle | FakeFileHandle
    > {
    for (const child of this.#node.children.values()) {
      if (child.kind === "file") {
        yield new FakeFileHandle(child);
      } else {
        yield new FakeDirectoryHandle(child);
      }
    }
  }

  async *entries(): AsyncIterableIterator<
    [string, FakeDirectoryHandle | FakeFileHandle]
    > {
    for (const [name, child] of this.#node.children.entries()) {
      if (child.kind === "file") {
        yield [name, new FakeFileHandle(child)];
      } else {
        yield [name, new FakeDirectoryHandle(child)];
      }
    }
  }
}
