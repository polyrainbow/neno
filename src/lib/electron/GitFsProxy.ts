/*
  isomorphic-git file system that forwards to node:fs/promises in the
  Electron main process. Shares the storage bridge's MessagePort;
  methods are namespaced with "git.".
*/

import { FsStat, GitFs, makeStatFromType } from "../notes-worker/GitFs";
import BridgeClient from "./BridgeClient";
import { SerializedStat } from "./bridgeTypes";

const TEXT_DECODER = new TextDecoder();

export default class GitFsProxy implements GitFs {
  #client: BridgeClient;
  promises: GitFsProxy;

  constructor(portOrClient: MessagePort | BridgeClient) {
    this.#client = portOrClient instanceof BridgeClient
      ? portOrClient
      : new BridgeClient(portOrClient);
    this.promises = this;
  }

  #call(method: string, args: unknown[] = []): Promise<unknown> {
    return this.#client.call("git." + method, args);
  }

  async readFile(
    path: string,
    options?: { encoding?: string } | string,
  ): Promise<Uint8Array | string> {
    const encoding = typeof options === "string"
      ? options
      : options?.encoding;
    const buffer = await this.#call("readFile", [path]) as ArrayBuffer;
    const bytes = new Uint8Array(buffer);
    if (encoding === "utf8" || encoding === "utf-8") {
      return TEXT_DECODER.decode(bytes);
    }
    return bytes;
  }

  async writeFile(
    path: string,
    data: Uint8Array | string,
    options?: { encoding?: string; mode?: number } | string,
  ): Promise<void> {
    if (typeof data === "string") {
      await this.#call("writeFile", [path, data, options]);
      return;
    }
    // Copy before sending: isomorphic-git reuses its buffers.
    const buffer = data.slice().buffer as ArrayBuffer;
    await this.#call("writeFile", [path, buffer, options]);
  }

  async unlink(path: string): Promise<void> {
    await this.#call("unlink", [path]);
  }

  async readdir(path: string): Promise<string[]> {
    return await this.#call("readdir", [path]) as string[];
  }

  async mkdir(
    path: string,
    options?: { recursive?: boolean; mode?: number },
  ): Promise<void> {
    await this.#call("mkdir", [path, options]);
  }

  async rmdir(path: string): Promise<void> {
    await this.#call("rmdir", [path]);
  }

  async stat(path: string): Promise<FsStat> {
    const stat = await this.#call("stat", [path]) as SerializedStat;
    return makeStatFromType(stat);
  }

  async lstat(path: string): Promise<FsStat> {
    const stat = await this.#call("lstat", [path]) as SerializedStat;
    return makeStatFromType(stat);
  }

  async readlink(path: string): Promise<string> {
    return await this.#call("readlink", [path]) as string;
  }

  async symlink(target: string, path: string): Promise<void> {
    await this.#call("symlink", [target, path]);
  }

  async chmod(path: string, mode: number): Promise<void> {
    await this.#call("chmod", [path, mode]);
  }
}
