// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getFilesFromUserSelection, getWritableStream } from "./utils";
import { NenoBridge } from "./electron/bridgeTypes";

/*
  The native dialogs cannot be driven from a test, so this covers the
  renderer half of both paths against a stubbed bridge: the File objects
  the open dialog turns into, and the WritableStream that chunks a save
  to the main process — including the string chunks that
  FrontendFunctions.exportNote writes.
*/

type WriteCall = { sessionId: number; bytes: number[] };

const makeBridge = (overrides: Partial<NenoBridge> = {}) => {
  const writes: WriteCall[] = [];
  const closed: number[] = [];
  const aborted: number[] = [];

  const bridge: NenoBridge = {
    pickFolder: async () => null,
    getLastFolder: async () => null,
    setLastFolder: async () => undefined,
    pickFilesToOpen: async () => [],
    pickFileToSave: async () => 5,
    writeChunk: async (sessionId, chunk) => {
      writes.push({ sessionId, bytes: [...new Uint8Array(chunk)] });
    },
    closeWrite: async (sessionId) => {
      closed.push(sessionId);
    },
    abortWrite: async (sessionId) => {
      aborted.push(sessionId);
    },
    connectStorage: async () => undefined,
    setUnsavedChanges: async () => undefined,
    ...overrides,
  };

  return { bridge, writes, closed, aborted };
};

const installBridge = (bridge: NenoBridge): void => {
  (window as Window & { neno?: NenoBridge }).neno = bridge;
};


describe("getFilesFromUserSelection", () => {
  afterEach(() => {
    delete (window as Window & { neno?: NenoBridge }).neno;
  });

  it("should wrap the bytes main sends back as File objects", async () => {
    const data = new TextEncoder().encode("file body").slice()
      .buffer as ArrayBuffer;
    const { bridge } = makeBridge({
      pickFilesToOpen: async () => [{ name: "note.subtext", data }],
    });
    installBridge(bridge);

    const files = await getFilesFromUserSelection(
      [{ name: "NENO note", extensions: ["subtext"] }],
      false,
    );

    expect(files.length).toBe(1);
    expect(files[0]).toBeInstanceOf(File);
    expect(files[0].name).toBe("note.subtext");
    expect(await files[0].text()).toBe("file body");
  });

  it("should forward the filters and the multiple flag", async () => {
    const pickFilesToOpen = vi.fn(async () => []);
    const { bridge } = makeBridge({ pickFilesToOpen });
    installBridge(bridge);

    const filters = [{ name: "Media file", extensions: ["png", "mp4"] }];
    await getFilesFromUserSelection(filters, true);

    expect(pickFilesToOpen).toHaveBeenCalledWith(filters, true);
  });

  it("should return an empty list when the user cancels", async () => {
    const { bridge } = makeBridge({ pickFilesToOpen: async () => [] });
    installBridge(bridge);

    expect(await getFilesFromUserSelection([], false)).toEqual([]);
  });

  it("should fail loudly when there is no bridge", async () => {
    await expect(getFilesFromUserSelection([], false))
      .rejects.toThrow("Electron bridge is unavailable");
  });
});


describe("getWritableStream", () => {
  beforeEach(() => {
    delete (window as Window & { neno?: NenoBridge }).neno;
  });

  afterEach(() => {
    delete (window as Window & { neno?: NenoBridge }).neno;
  });

  it("should resolve to null when the user cancels the dialog", async () => {
    const { bridge } = makeBridge({ pickFileToSave: async () => null });
    installBridge(bridge);

    expect(await getWritableStream({ suggestedName: "a.subtext" }))
      .toBe(null);
  });

  it("should chunk a piped stream to main and close the session",
    async () => {
      const { bridge, writes, closed } = makeBridge();
      installBridge(bridge);

      const writable = await getWritableStream({ suggestedName: "a.bin" });
      expect(writable).not.toBe(null);

      const readable = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(new Uint8Array([1, 2]));
          controller.enqueue(new Uint8Array([3]));
          controller.close();
        },
      });
      await readable.pipeTo(writable as WritableStream<Uint8Array>);

      expect(writes).toEqual([
        { sessionId: 5, bytes: [1, 2] },
        { sessionId: 5, bytes: [3] },
      ]);
      expect(closed).toEqual([5]);
    },
  );

  /* exportNote writes the serialized note as a string. */
  it("should encode string chunks as UTF-8", async () => {
    const { bridge, writes, closed } = makeBridge();
    installBridge(bridge);

    const writable = await getWritableStream({ suggestedName: "a.subtext" });
    const writer = (writable as WritableStream<Uint8Array | string>)
      .getWriter();
    await writer.write("grün");
    await writer.close();

    // "grün" precomposed: g r 0xC3 0xBC n
    expect(writes).toEqual([
      { sessionId: 5, bytes: [103, 114, 0xc3, 0xbc, 110] },
    ]);
    expect(closed).toEqual([5]);
  });

  it("should abort the session when the pipe fails", async () => {
    const { bridge, aborted } = makeBridge();
    installBridge(bridge);

    const writable = await getWritableStream({ suggestedName: "a.bin" });
    const readable = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([1]));
        controller.error(new Error("Source blew up"));
      },
    });

    await expect(
      readable.pipeTo(writable as WritableStream<Uint8Array>),
    ).rejects.toThrow("Source blew up");
    expect(aborted).toEqual([5]);
  });

  it("should pass the suggested name and filters through", async () => {
    const pickFileToSave = vi.fn(async () => 5);
    const { bridge } = makeBridge({ pickFileToSave });
    installBridge(bridge);

    const options = {
      suggestedName: "my-note.subtext",
      filters: [{ name: "NENO subtext note", extensions: ["subtext"] }],
    };
    await getWritableStream(options);

    expect(pickFileToSave).toHaveBeenCalledWith(options);
  });
});
