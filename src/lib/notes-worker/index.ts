import FileSystemAccessAPIStorageProvider
  from "../FileSystemAccessAPIStorageProvider";
import NotesProvider from "../notes";

let notesProvider: NotesProvider | null = null;

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
} | {
  action: "addPort";
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

      notesProvider = new NotesProvider(storageProvider);
      postMessage({ action: "initialized" });
      return;
    }

    if (eventData.action === "addPort") {
      const port = event.ports[0];
      setupPortHandler(port);
      return;
    }

    return;
  }

  await handleRPCCall(
    eventData,
    (data, transfer) => postMessage(data, { transfer: transfer ?? [] }),
  );
};
