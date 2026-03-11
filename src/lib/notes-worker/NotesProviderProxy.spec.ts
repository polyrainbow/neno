import { describe, it, expect, vi, beforeEach } from "vitest";
import NotesProviderProxy from "./NotesProviderProxy";

/*
  These tests exercise the RPC proxy over a real MessageChannel,
  which is the same transport used between the script worker and
  the notes worker. The MessagePort path requires an explicit
  start() call when using addEventListener — a regression here
  would silently break inline script execution in the browser.
*/

const setupMockHandler = (
  port: MessagePort,
  handler: (
    msg: { id: number; method: string; args: unknown[] },
  ) => unknown,
) => {
  port.onmessage = async (event: MessageEvent) => {
    const { id, method, args } = event.data;
    try {
      const result = await handler({ id, method, args });
      port.postMessage({ id, result });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      port.postMessage({ id, error: message });
    }
  };
};


describe("NotesProviderProxy over MessagePort", () => {
  let proxy: NotesProviderProxy;
  let serverPort: MessagePort;

  beforeEach(() => {
    const channel = new MessageChannel();
    serverPort = channel.port1;
    proxy = new NotesProviderProxy(channel.port2);
  });

  /*
    Browsers require explicit start() on MessagePort when using
    addEventListener (Node.js auto-starts, so this test ensures
    the call is present regardless of environment).
  */
  it("should call start() on MessagePort targets", () => {
    const channel = new MessageChannel();
    const startSpy = vi.spyOn(channel.port2, "start");
    new NotesProviderProxy(channel.port2);
    expect(startSpy).toHaveBeenCalled();
  });

  it("should complete an RPC call via MessagePort", async () => {
    setupMockHandler(serverPort, ({ method, args }) => {
      if (method === "getRawNote") {
        return "Note content for " + (args[0] as string);
      }
      throw new Error("Unknown method");
    });

    const result = await proxy.getRawNote("test-slug");
    expect(result).toBe("Note content for test-slug");
  });


  it("should handle multiple concurrent calls", async () => {
    setupMockHandler(serverPort, ({ method, args }) => {
      if (method === "getRawNote") {
        return "content:" + (args[0] as string);
      }
      throw new Error("Unknown method");
    });

    const [r1, r2, r3] = await Promise.all([
      proxy.getRawNote("a"),
      proxy.getRawNote("b"),
      proxy.getRawNote("c"),
    ]);

    expect(r1).toBe("content:a");
    expect(r2).toBe("content:b");
    expect(r3).toBe("content:c");
  });


  it("should propagate errors from the worker", async () => {
    setupMockHandler(serverPort, () => {
      throw new Error("Something went wrong");
    });

    await expect(proxy.getRawNote("x"))
      .rejects
      .toThrow("Something went wrong");
  });


  it("should resolve getGraph call", async () => {
    const fakeGraph = {
      notes: new Map(),
      aliases: new Map(),
      files: new Map(),
      pinnedNotes: [],
      indexes: {
        blocks: new Map(),
        outgoingLinks: new Map(),
        backlinks: new Map(),
      },
    };

    setupMockHandler(serverPort, ({ method }) => {
      if (method === "getGraph") {
        return fakeGraph;
      }
      throw new Error("Unknown method");
    });

    const graph = await proxy.getGraph();
    expect(graph.pinnedNotes).toEqual([]);
    expect(graph.notes).toBeInstanceOf(Map);
  });
});
