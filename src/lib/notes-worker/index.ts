import { Buffer } from "buffer";
import FileSystemAccessAPIStorageProvider
  from "../FileSystemAccessAPIStorageProvider";
import NotesProvider from "../notes";
import FileSystemAccessFs from "./FileSystemAccessFs";
import {
  commitChanged,
  ensureRepo,
  getCommitDiff,
  getCommitHistory,
  GitAuthor,
  hasExistingRepo,
} from "./git";

// isomorphic-git uses Node's Buffer internally; make it available
// to the worker's global scope.
(globalThis as { Buffer?: typeof Buffer }).Buffer = Buffer;

let notesProvider: NotesProvider | null = null;
let gitFs: FileSystemAccessFs | null = null;
let dirHandleForGit: FileSystemDirectoryHandle | null = null;
let gitAuthor: GitAuthor = {
  name: "NENO",
  email: "noreply@neno.local",
};

type RPCMessage = {
  id: number;
  method: string;
  args: unknown[];
};

type RPCAction = {
  action: "initialize";
  folderHandle?: FileSystemDirectoryHandle;
  useOPFS?: boolean;
  createDummyNotes?: boolean;
  gitAuthor?: GitAuthor;
} | {
  action: "addPort";
} | {
  action: "setGitAuthor";
  author: GitAuthor;
} | {
  action: "enableGit";
};

function getTransferables(value: unknown): Transferable[] {
  if (value instanceof ReadableStream) {
    return [value];
  }
  return [];
}

async function handleRPCCall(
  msg: RPCMessage,
  respond: (data: unknown, transfer?: Transferable[]) => void,
): Promise<void> {
  const { id, method, args } = msg;

  if (method === "getCommitHistory") {
    if (!gitFs) {
      respond({ id, error: "Git not initialized" });
      return;
    }
    try {
      const [options] = args as [{ limit: number; offset: number }];
      const result = await getCommitHistory(gitFs, "/", options);
      respond({ id, result });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      respond({ id, error: message });
    }
    return;
  }

  if (method === "getCommitDiff") {
    if (!gitFs) {
      respond({ id, error: "Git not initialized" });
      return;
    }
    try {
      const [oid] = args as [string];
      const result = await getCommitDiff(gitFs, "/", oid);
      respond({ id, result });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      respond({ id, error: message });
    }
    return;
  }

  if (!notesProvider) {
    respond({ id, error: "NotesProvider not initialized" });
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn = (notesProvider as any)[method];
    if (typeof fn !== "function") {
      respond({ id, error: `Unknown method: ${method}` });
      return;
    }
    const result = await fn.apply(notesProvider, args);
    const transferables = getTransferables(result);
    respond({ id, result }, transferables);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    respond({ id, error: message });
  }
}

function setupPortHandler(port: MessagePort): void {
  port.onmessage = async (event: MessageEvent) => {
    await handleRPCCall(
      event.data as RPCMessage,
      (data, transfer) => port.postMessage(data, transfer ?? []),
    );
  };
}

onmessage = async (event: MessageEvent<RPCMessage | RPCAction>) => {
  const eventData = event.data;

  if ("action" in eventData) {
    if (eventData.action === "initialize") {
      let dirHandle: FileSystemDirectoryHandle;

      if (eventData.useOPFS) {
        dirHandle = await navigator.storage.getDirectory();
      } else if (eventData.folderHandle) {
        dirHandle = eventData.folderHandle;
      } else {
        postMessage({
          action: "error",
          error: "No folder handle or OPFS flag provided",
        });
        return;
      }

      const storageProvider
        = new FileSystemAccessAPIStorageProvider(dirHandle);

      if (eventData.createDummyNotes) {
        for (let i = 1; i <= 1000; i++) {
          await storageProvider.writeObject(
            "note-" + i + ".subtext",
            "Test note " + i,
          );
        }
      }

      if (eventData.gitAuthor) {
        gitAuthor = eventData.gitAuthor;
      }

      dirHandleForGit = dirHandle;
      const candidateGitFs = new FileSystemAccessFs(dirHandle);
      if (await hasExistingRepo(candidateGitFs, "/")) {
        try {
          await ensureRepo(candidateGitFs, "/", gitAuthor);
          gitFs = candidateGitFs;
        } catch (e) {
          postMessage({
            action: "error",
            error: e instanceof Error ? e.message : String(e),
          });
          return;
        }
      }

      notesProvider = new NotesProvider(storageProvider, {
        onFlush: async (change) => {
          if (!gitFs) return;
          await commitChanged(gitFs, "/", change, gitAuthor);
        },
      });
      postMessage({
        action: "initialized",
        gitEnabled: gitFs !== null,
      });
      return;
    }

    if (eventData.action === "addPort") {
      const port = event.ports[0];
      setupPortHandler(port);
      return;
    }

    if (eventData.action === "setGitAuthor") {
      gitAuthor = eventData.author;
      return;
    }

    if (eventData.action === "enableGit") {
      if (gitFs) {
        postMessage({ action: "gitEnabled" });
        return;
      }
      if (!dirHandleForGit) {
        postMessage({
          action: "gitEnableFailed",
          error: "Worker not initialized",
        });
        return;
      }
      const candidateGitFs = new FileSystemAccessFs(dirHandleForGit);
      try {
        await ensureRepo(candidateGitFs, "/", gitAuthor);
        gitFs = candidateGitFs;
        postMessage({ action: "gitEnabled" });
      } catch (e) {
        postMessage({
          action: "gitEnableFailed",
          error: e instanceof Error ? e.message : String(e),
        });
      }
      return;
    }

    return;
  }

  await handleRPCCall(
    eventData,
    (data, transfer) => postMessage(data, { transfer: transfer ?? [] }),
  );
};
