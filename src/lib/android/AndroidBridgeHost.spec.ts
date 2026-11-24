import { describe, it, expect } from "vitest";
import type { PluginListenerHandle } from "@capacitor/core";
import { handleRequest, serveBridge } from "./AndroidBridgeHost";
import { base64ToBytes, bytesToBase64, NenoNativePlugin } from "./nativePlugin";
import BridgeClient from "../electron/BridgeClient";
import StorageProviderProxy from "../electron/StorageProviderProxy";
import { BridgeEvent } from "../electron/bridgeTypes";
import { FileDiff } from "../git/types";
import { computeDiffLines } from "../git/diff";

/*
  A stand-in for the Kotlin plugin: `call` answers from a handler table,
  and `emit` plays native speaking first.
*/
const makePlugin = (
  handlers: Record<string, (args: unknown[]) => unknown>,
) => {
  const calls: { method: string; args: unknown[] }[] = [];
  let bridgeEventListener: ((event: BridgeEvent) => void) | null = null;
  let removed = false;

  const plugin = {
    call: async ({ method, args }: { method: string; args: unknown[] }) => {
      calls.push({ method, args });
      const handler = handlers[method];
      if (!handler) {
        throw Object.assign(new Error("Unknown bridge method: " + method), {
          code: "",
        });
      }
      return { result: await handler(args) };
    },
    addListener: async (
      eventName: string,
      listener: (event: BridgeEvent) => void,
    ): Promise<PluginListenerHandle> => {
      if (eventName === "bridgeEvent") bridgeEventListener = listener;
      return {
        remove: async () => {
          removed = true;
        },
      };
    },
  } as unknown as NenoNativePlugin;

  return {
    plugin,
    calls,
    emit: (event: BridgeEvent) => bridgeEventListener?.(event),
    wasRemoved: () => removed,
  };
};

describe("AndroidBridgeHost: handleRequest", () => {
  it("should pass the request through and keep its id", async () => {
    const { plugin, calls } = makePlugin({
      "storage.readObjectAsString": (args) => "content of " + args[0],
    });

    const response = await handleRequest(plugin, {
      id: 7,
      method: "storage.readObjectAsString",
      args: ["a.subtext"],
    });

    expect(response).toEqual({ id: 7, result: "content of a.subtext" });
    expect(calls).toEqual([
      { method: "storage.readObjectAsString", args: ["a.subtext"] },
    ]);
  });

  it("should carry the native error code", async () => {
    const { plugin } = makePlugin({
      "storage.readObjectAsString": () => {
        throw Object.assign(new Error("No such file: x"), { code: "ENOENT" });
      },
    });

    const response = await handleRequest(plugin, {
      id: 1,
      method: "storage.readObjectAsString",
      args: ["x"],
    });

    expect(response).toEqual({
      id: 1,
      error: "No such file: x",
      errorCode: "ENOENT",
    });
  });

  it("should leave out an empty error code", async () => {
    const { plugin } = makePlugin({});

    const response = await handleRequest(plugin, {
      id: 2,
      method: "storage.nope",
      args: [],
    });

    expect(response.error).toBe("Unknown bridge method: storage.nope");
    expect(response.errorCode).toBeUndefined();
  });

  it("should send binary arguments as base64", async () => {
    const { plugin, calls } = makePlugin({ "storage.writeChunk": () => null });
    const bytes = new Uint8Array([0, 1, 2, 254, 255]);

    await handleRequest(plugin, {
      id: 3,
      method: "storage.writeChunk",
      args: [4, bytes.buffer],
    });

    expect(calls[0].args).toEqual([4, { $b64: bytesToBase64(bytes) }]);
  });

  it("should turn a base64 result back into an ArrayBuffer", async () => {
    const bytes = new Uint8Array([9, 8, 7]);
    const { plugin } = makePlugin({
      "storage.readChunk": () => ({ $b64: bytesToBase64(bytes) }),
    });

    const response = await handleRequest(plugin, {
      id: 4,
      method: "storage.readChunk",
      args: [1],
    });

    expect(response.result).toBeInstanceOf(ArrayBuffer);
    expect([...new Uint8Array(response.result as ArrayBuffer)])
      .toEqual([9, 8, 7]);
  });
});

describe("AndroidBridgeHost: git.diff", () => {
  it("should compute the line diff from both versions", async () => {
    const { plugin, calls } = makePlugin({
      "git.fileVersions": () => [
        {
          path: "a.subtext",
          change: "modify",
          oldText: "same\nold words\n",
          newText: "same\nnew words\n",
        },
        { path: "files/x.png", change: "add", binary: true },
        { path: "big.subtext", change: "modify", tooLarge: true },
      ],
    });

    const response = await handleRequest(plugin, {
      id: 9,
      method: "git.diff",
      args: ["abc123"],
    });

    expect(calls).toEqual([{ method: "git.fileVersions", args: ["abc123"] }]);
    const [text, binary, large] = response.result as FileDiff[];
    // The desktop's own diff, so both apps show a change alike.
    expect(text).toEqual({
      path: "a.subtext",
      change: "modify",
      lines: computeDiffLines("same\nold words\n", "same\nnew words\n"),
    });
    expect(binary).toEqual({
      path: "files/x.png",
      change: "add",
      binary: true,
    });
    expect(large).toEqual({
      path: "big.subtext",
      change: "modify",
      tooLarge: true,
    });
  });
});

describe("AndroidBridgeHost: serveBridge", () => {
  it("should serve the worker's own StorageProviderProxy", async () => {
    const files: Record<string, string> = {
      "a.subtext": "A",
      "b.subtext": "B",
    };
    const { plugin } = makePlugin({
      "storage.getAllObjectNames": () => Object.keys(files),
      "storage.readObjectsAsStrings": (args) =>
        (args[0] as string[]).map((name) => files[name]),
      "storage.readObjectAsString": (args) => {
        const content = files[args[0] as string];
        if (content === undefined) {
          throw Object.assign(new Error("missing"), { code: "ENOENT" });
        }
        return content;
      },
    });
    const channel = new MessageChannel();
    const stop = await serveBridge(plugin, channel.port1);
    const proxy = new StorageProviderProxy(new BridgeClient(channel.port2));

    expect(await proxy.getAllObjectNames()).toEqual(["a.subtext", "b.subtext"]);
    expect(await proxy.readObjectsAsStrings(["b.subtext", "a.subtext"]))
      .toEqual(["B", "A"]);
    await expect(proxy.readObjectAsString("c.subtext"))
      .rejects.toMatchObject({ code: "ENOENT" });

    stop();
    channel.port2.close();
  });

  it("should stream a file in chunks", async () => {
    const chunks = [new Uint8Array([1, 2]), new Uint8Array([3])];
    let next = 0;
    const { plugin } = makePlugin({
      "storage.openRead": () => ({ streamId: 1, size: 3 }),
      "storage.readChunk": () => next < chunks.length
        ? { $b64: bytesToBase64(chunks[next++]) }
        : null,
    });
    const channel = new MessageChannel();
    const stop = await serveBridge(plugin, channel.port1);
    const proxy = new StorageProviderProxy(new BridgeClient(channel.port2));

    const stream = await proxy.getReadableStream("file.bin");
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());

    expect([...bytes]).toEqual([1, 2, 3]);
    stop();
    channel.port2.close();
  });

  it("should relay native events to the worker", async () => {
    const { plugin, emit, wasRemoved } = makePlugin({});
    const channel = new MessageChannel();
    const stop = await serveBridge(plugin, channel.port1);
    const client = new BridgeClient(channel.port2);

    const received = new Promise<BridgeEvent>((resolve) => {
      client.onEvent(resolve);
    });
    emit({ event: "pathsChanged", paths: ["a.subtext"] });

    expect(await received).toEqual({
      event: "pathsChanged",
      paths: ["a.subtext"],
    });

    stop();
    expect(wasRemoved()).toBe(true);
    channel.port2.close();
  });
});

describe("nativePlugin: base64", () => {
  it("should round-trip every byte value", () => {
    const bytes = new Uint8Array(256).map((_, i) => i);
    expect([...base64ToBytes(bytesToBase64(bytes))]).toEqual([...bytes]);
  });

  it("should handle more bytes than fit in one argument list", () => {
    const bytes = new Uint8Array(200_000).map((_, i) => i % 251);
    expect(base64ToBytes(bytesToBase64(bytes))).toEqual(bytes);
  });
});
