import NoteToTransmit from "../notes/types/NoteToTransmit";
import GraphStats from "../notes/types/GraphStats";
import GraphObject from "../notes/types/Graph";
import GraphStatsRetrievalOptions
  from "../notes/types/GraphStatsRetrievalOptions";
import { FileInfo } from "../notes/types/FileInfo";
import { NoteSaveRequest } from "../notes/types/NoteSaveRequest";
import DatabaseQuery from "../notes/types/DatabaseQuery";
import NoteListPage from "../notes/types/NoteListPage";
import ByteRange from "../notes/types/ByteRange";
import { Slug } from "../notes/types/Slug";
import {
  getExtensionFromFilename,
} from "../notes/utils";
import {
  parseSerializedNewNote,
  serializeNewNote,
} from "../notes/noteUtils";
import {
  isValidSlug,
  isValidSlugOrEmpty,
  isValidNoteSlugOrEmpty,
} from "../notes/slugUtils";
import {
  ChangedFile,
  CommitInfo,
  CommitHistoryOptions,
  DiffLine,
  DiffSegment,
  FileDiff,
} from "./git";

export type {
  ChangedFile,
  CommitInfo,
  CommitHistoryOptions,
  DiffLine,
  DiffSegment,
  FileDiff,
};

type RPCTarget = Worker | MessagePort;

interface PendingCall {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
}

export type WorkerEvent
  = { event: "mutation" }
  | { event: "gitEnabled" };

export type WorkerEventListener = (event: WorkerEvent) => void;

export default class NotesProviderProxy {
  /* STATIC — pure functions, no worker needed */

  static getExtensionFromFilename = getExtensionFromFilename;
  static parseSerializedNewNote = parseSerializedNewNote;
  static serializeNewNote = serializeNewNote;
  static isValidSlug = isValidSlug;
  static isValidSlugOrEmpty = isValidSlugOrEmpty;
  static isValidNoteSlugOrEmpty = isValidNoteSlugOrEmpty;

  #target: RPCTarget;
  #pendingCalls = new Map<number, PendingCall>();
  #nextId = 0;
  #listeners = new Set<WorkerEventListener>();

  constructor(target: RPCTarget) {
    this.#target = target;

    const handler = (event: Event) => {
      const data = (event as MessageEvent).data;
      if (!data || typeof data !== "object") return;
      if ("event" in data) {
        for (const listener of this.#listeners) {
          listener(data as WorkerEvent);
        }
        return;
      }
      const { id, result, error } = data;
      if (id === undefined) return;
      const pending = this.#pendingCalls.get(id as number);
      if (!pending) return;
      this.#pendingCalls.delete(id as number);
      if (error) {
        pending.reject(new Error(error as string));
      } else {
        pending.resolve(result);
      }
    };

    target.addEventListener("message", handler);
    // MessagePort requires an explicit start() when using
    // addEventListener (as opposed to onmessage which auto-starts).
    if ("start" in target) {
      (target as MessagePort).start();
    }
  }

  subscribe(listener: WorkerEventListener): void {
    this.#listeners.add(listener);
  }

  unsubscribe(listener: WorkerEventListener): void {
    this.#listeners.delete(listener);
  }

  #call(
    method: string,
    args: unknown[],
  ): Promise<unknown> {
    const id = this.#nextId++;
    const transferables: Transferable[] = [];
    for (const arg of args) {
      if (arg instanceof ReadableStream) {
        transferables.push(arg);
      }
    }
    return new Promise((resolve, reject) => {
      this.#pendingCalls.set(id, { resolve, reject });
      this.#target.postMessage(
        { id, method, args },
        transferables,
      );
    });
  }

  async reIndexGraph(): Promise<void> {
    await this.#call("reIndexGraph", []);
  }

  async get(
    slug: Slug,
    options?: { includeParsedContent?: boolean },
  ): Promise<NoteToTransmit> {
    return await this.#call("get", [slug, options]) as NoteToTransmit;
  }

  async getRandom(): Promise<NoteToTransmit> {
    return await this.#call("getRandom", []) as NoteToTransmit;
  }

  async getRawNote(slug: Slug): Promise<string> {
    return await this.#call("getRawNote", [slug]) as string;
  }

  async getNotesList(query: DatabaseQuery): Promise<NoteListPage> {
    return await this.#call("getNotesList", [query]) as NoteListPage;
  }

  async getStats(
    options: GraphStatsRetrievalOptions,
  ): Promise<GraphStats> {
    return await this.#call("getStats", [options]) as GraphStats;
  }

  async put(
    noteSaveRequest: NoteSaveRequest,
  ): Promise<NoteToTransmit> {
    return await this.#call("put", [noteSaveRequest]) as NoteToTransmit;
  }

  async remove(slug: Slug): Promise<void> {
    await this.#call("remove", [slug]);
  }

  async addFile(
    readable: ReadableStream,
    namespace: string,
    originalFilename: string,
  ): Promise<FileInfo> {
    return await this.#call(
      "addFile",
      [readable, namespace, originalFilename],
    ) as FileInfo;
  }

  async updateFile(
    readable: ReadableStream,
    slug: Slug,
  ): Promise<FileInfo> {
    return await this.#call("updateFile", [readable, slug]) as FileInfo;
  }

  async renameFileSlug(
    oldSlug: Slug,
    newSlug: Slug,
    updateReferences: boolean,
  ): Promise<FileInfo> {
    return await this.#call(
      "renameFileSlug",
      [oldSlug, newSlug, updateReferences],
    ) as FileInfo;
  }

  async deleteFile(slug: Slug): Promise<void> {
    await this.#call("deleteFile", [slug]);
  }

  async getFiles(): Promise<FileInfo[]> {
    return await this.#call("getFiles", []) as FileInfo[];
  }

  async getSlugsOfDanglingFiles(): Promise<Slug[]> {
    return await this.#call("getSlugsOfDanglingFiles", []) as Slug[];
  }

  async getReadableArbitraryGraphFileStream(
    slug: Slug,
    range?: ByteRange,
  ): Promise<ReadableStream> {
    return await this.#call(
      "getReadableArbitraryGraphFileStream",
      [slug, range],
    ) as ReadableStream;
  }

  async getFileInfo(slug: Slug): Promise<FileInfo> {
    return await this.#call("getFileInfo", [slug]) as FileInfo;
  }

  async getPins(): Promise<NoteToTransmit[]> {
    return await this.#call("getPins", []) as NoteToTransmit[];
  }

  async pin(slug: Slug): Promise<NoteToTransmit[]> {
    return await this.#call("pin", [slug]) as NoteToTransmit[];
  }

  async movePinPosition(
    slug: Slug,
    offset: number,
  ): Promise<NoteToTransmit[]> {
    return await this.#call(
      "movePinPosition",
      [slug, offset],
    ) as NoteToTransmit[];
  }

  async unpin(slugToRemove: Slug): Promise<NoteToTransmit[]> {
    return await this.#call("unpin", [slugToRemove]) as NoteToTransmit[];
  }

  async getGraph(): Promise<GraphObject> {
    return await this.#call("getGraph", []) as GraphObject;
  }

  async graphExistsInStorage(): Promise<boolean> {
    return await this.#call("graphExistsInStorage", []) as boolean;
  }

  async getCommitHistory(
    options: CommitHistoryOptions,
  ): Promise<CommitInfo[]> {
    return await this.#call(
      "getCommitHistory",
      [options],
    ) as CommitInfo[];
  }

  async getCommitDiff(oid: string): Promise<FileDiff[]> {
    return await this.#call("getCommitDiff", [oid]) as FileDiff[];
  }

  setGitAuthor(author: { name: string; email: string }): void {
    this.#target.postMessage({
      action: "setGitAuthor",
      author,
    });
  }
}
