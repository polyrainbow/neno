/*
  Shared message types for the storage bridge between the Electron main
  process and the notes worker. Imported by both `electron/` and `src/`
  so the two sides of the protocol cannot drift apart.

  The wire shape is the same request/response id protocol that
  `src/lib/notes-worker/NotesProviderProxy.ts` uses to talk to the notes
  worker: `{ id, method, args }` in, `{ id, result | error }` out.
  Method names are namespaced (`storage.…`, `git.…`) because a single
  MessagePort carries both the StorageProvider and the isomorphic-git
  file system.
*/

export type BridgeRequest = {
  id: number;
  method: string;
  args: unknown[];
};

export type BridgeResponse = {
  id: number;
  result?: unknown;
  /** Human-readable message; presence of this field marks a failure. */
  error?: string;
  /** POSIX error code (ENOENT, EEXIST, …). isomorphic-git branches on it. */
  errorCode?: string;
};

/*
  ReadableStream is transferable between renderer contexts but not across
  the main-process boundary, so streams are chunked: the reader asks for
  one chunk per pull, and the writer sends one chunk at a time.
*/
export type OpenReadResult = {
  streamId: number;
  size: number;
};

export type OpenWriteResult = {
  streamId: number;
};

/** Serializable stand-in for a node `fs.Stats`. */
export type SerializedStat = {
  type: "file" | "dir" | "symlink";
  mode: number;
  size: number;
  ino: number;
  mtimeMs: number;
  ctimeMs: number;
  uid: number;
  gid: number;
  dev: number;
};

export type PickerFilter = {
  name: string;
  extensions: string[];
};

export type PickedFile = {
  name: string;
  data: ArrayBuffer;
};

export type SaveDialogOptions = {
  suggestedName?: string;
  filters?: PickerFilter[];
};

/**
 * The surface `electron/preload.ts` exposes on `window.neno`. Everything
 * the renderer can ask the main process to do goes through here.
 */
export interface NenoBridge {
  /** Native folder dialog. Resolves to an absolute path, or null on cancel. */
  pickFolder(): Promise<string | null>;
  /** Absolute path of the folder used last, or null if there is none. */
  getLastFolder(): Promise<string | null>;
  setLastFolder(folderPath: string | null): Promise<void>;
  pickFilesToOpen(
    filters: PickerFilter[],
    multiple: boolean,
  ): Promise<PickedFile[]>;
  /**
   * Native save dialog. Resolves to a write session id, or null on cancel.
   * Feed the session with `writeChunk` and finish it with `closeWrite`.
   */
  pickFileToSave(options: SaveDialogOptions): Promise<number | null>;
  writeChunk(sessionId: number, chunk: ArrayBuffer): Promise<void>;
  closeWrite(sessionId: number): Promise<void>;
  abortWrite(sessionId: number): Promise<void>;
  /**
   * Asks main for a storage bridge rooted at `folderPath`. The
   * MessagePort itself cannot cross the context bridge, so it arrives as
   * a `window.postMessage` transfer — use `connectStorage()` from
   * `src/lib/electron/connectStorage.ts` instead of calling this directly.
   */
  connectStorage(folderPath: string): Promise<void>;
  /** Whether closing the window should ask for confirmation first. */
  setUnsavedChanges(hasUnsavedChanges: boolean): Promise<void>;
}

/** Message the preload uses to hand the storage MessagePort to the page. */
export const STORAGE_PORT_MESSAGE = "neno:storage-port";
