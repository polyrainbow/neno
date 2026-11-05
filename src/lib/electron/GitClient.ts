/*
  The folder's repository, as seen from the notes worker. git itself
  runs in the Electron main process (electron/git/); this forwards the
  handful of operations the worker needs over the storage bridge.
*/

import BridgeClient from "./BridgeClient";
import {
  CommitHistoryOptions,
  CommitInfo,
  FileDiff,
  FlushChanges,
  GitAuthor,
} from "../git/types";

export default class GitClient {
  #client: BridgeClient;

  constructor(client: BridgeClient) {
    this.#client = client;
  }

  async hasRepo(): Promise<boolean> {
    return await this.#client.call("git.hasRepo", []) as boolean;
  }

  /** Who rebases replay local commits as, until the next commit says. */
  async setAuthor(author: GitAuthor): Promise<void> {
    await this.#client.call("git.setAuthor", [author]);
  }

  async init(author: GitAuthor): Promise<void> {
    await this.#client.call("git.init", [author]);
  }

  async commit(changes: FlushChanges, author: GitAuthor): Promise<void> {
    await this.#client.call("git.commit", [changes, author]);
  }

  async log(options: CommitHistoryOptions): Promise<CommitInfo[]> {
    return await this.#client.call("git.log", [options]) as CommitInfo[];
  }

  async diff(oid: string): Promise<FileDiff[]> {
    return await this.#client.call("git.diff", [oid]) as FileDiff[];
  }
}
