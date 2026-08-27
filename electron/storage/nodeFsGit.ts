/*
  nodeFsGit — the subset of the node `fs` module that isomorphic-git
  uses, delegated to node:fs/promises and rooted at an absolute path.
  Essentially the identity mapping that
  src/lib/notes-worker/FileSystemAccessFs.ts had to fake on top of the
  File System Access API.

  isomorphic-git probes for a `promises` namespace and uses that
  exclusively if present, so the instance carries a `promises` alias
  pointing back at itself.
*/

import * as fs from "node:fs/promises";
import type { Stats } from "node:fs";
import * as path from "node:path";
import { SerializedStat } from "../../src/lib/electron/bridgeTypes";
import {
  FsStat,
  GitFs,
  makeStatFromType,
} from "../../src/lib/notes-worker/GitFs";

const TEXT_DECODER = new TextDecoder();

function toFsStat(stats: Stats): FsStat {
  return makeStatFromType({
    type: stats.isSymbolicLink()
      ? "symlink"
      : stats.isDirectory()
        ? "dir"
        : "file",
    mode: stats.mode,
    size: stats.size,
    ino: Number(stats.ino),
    mtimeMs: stats.mtimeMs,
    ctimeMs: stats.ctimeMs,
    uid: stats.uid,
    gid: stats.gid,
    dev: Number(stats.dev),
  });
}

export function isFsStat(value: unknown): value is FsStat {
  return Boolean(value)
    && typeof value === "object"
    && typeof (value as FsStat).isFile === "function";
}

/**
 * Drops the predicates, which a structured clone cannot carry. The proxy
 * rebuilds them on the far side.
 */
export function serializeStat(stat: FsStat): SerializedStat {
  const {
    type, mode, size, ino, mtimeMs, ctimeMs, uid, gid, dev,
  } = stat;
  return { type, mode, size, ino, mtimeMs, ctimeMs, uid, gid, dev };
}


export default class NodeFsGit implements GitFs {
  #rootPath: string;
  promises: NodeFsGit;

  constructor(rootPath: string) {
    this.#rootPath = rootPath;
    this.promises = this;
  }

  /*
    isomorphic-git is initialized with dir "/", so every path it passes
    is absolute relative to the graph root. Strip the leading slash and
    resolve inside the root, refusing anything that would escape it.
  */
  #resolve(requestPath: string): string {
    const segments = requestPath
      .replace(/\\/g, "/")
      .split("/")
      .filter((segment) => segment.length > 0 && segment !== ".");

    if (segments.includes("..")) {
      throw new Error("Invalid path: " + requestPath);
    }

    return path.join(this.#rootPath, ...segments);
  }

  async readFile(
    requestPath: string,
    options?: { encoding?: string } | string,
  ): Promise<Uint8Array | string> {
    const encoding = typeof options === "string"
      ? options
      : options?.encoding;
    const bytes = await fs.readFile(this.#resolve(requestPath));
    if (encoding === "utf8" || encoding === "utf-8") {
      return TEXT_DECODER.decode(bytes);
    }
    return new Uint8Array(bytes);
  }

  async writeFile(
    requestPath: string,
    // Bytes arrive from the proxy as an ArrayBuffer, which node's
    // writeFile does not accept.
    data: ArrayBuffer | Uint8Array | string,
    options?: { encoding?: string; mode?: number } | string,
  ): Promise<void> {
    const absolutePath = this.#resolve(requestPath);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    const mode = typeof options === "object" ? options?.mode : undefined;
    const payload = data instanceof ArrayBuffer
      ? new Uint8Array(data)
      : data;
    await fs.writeFile(absolutePath, payload, mode ? { mode } : undefined);
  }

  async unlink(requestPath: string): Promise<void> {
    await fs.unlink(this.#resolve(requestPath));
  }

  async readdir(requestPath: string): Promise<string[]> {
    const names = await fs.readdir(this.#resolve(requestPath));
    return names.map((name) => name.normalize("NFC"));
  }

  async mkdir(
    requestPath: string,
    options?: { recursive?: boolean; mode?: number },
  ): Promise<void> {
    await fs.mkdir(this.#resolve(requestPath), {
      recursive: options?.recursive ?? false,
      mode: options?.mode,
    });
  }

  async rmdir(requestPath: string): Promise<void> {
    await fs.rmdir(this.#resolve(requestPath));
  }

  async stat(requestPath: string): Promise<FsStat> {
    return toFsStat(await fs.stat(this.#resolve(requestPath)));
  }

  async lstat(requestPath: string): Promise<FsStat> {
    return toFsStat(await fs.lstat(this.#resolve(requestPath)));
  }

  async readlink(requestPath: string): Promise<string> {
    return await fs.readlink(this.#resolve(requestPath));
  }

  async symlink(target: string, requestPath: string): Promise<void> {
    await fs.symlink(target, this.#resolve(requestPath));
  }

  async chmod(requestPath: string, mode: number): Promise<void> {
    await fs.chmod(this.#resolve(requestPath), mode);
  }
}
