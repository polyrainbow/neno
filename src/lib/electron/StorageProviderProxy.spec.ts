import { describe, it, expect, beforeEach, vi } from "vitest";
import StorageProviderProxy from "./StorageProviderProxy";
import BridgeClient from "./BridgeClient";
import { BridgeRequest } from "./bridgeTypes";

/*
  Exercises the proxy over a real MessageChannel with a handler on the
  far end, the way the notes worker talks to the Electron main process.
  The chunked read/write stream paths are the only genuinely new
  protocol code in the bridge, so they get the most attention here.
*/

type Handler = (
  method: string,
  args: unknown[],
) => unknown;

const setupHandler = (port: MessagePort, handler: Handler): void => {
  port.onmessage = async (event: MessageEvent) => {
    const { id, method, args } = event.data as BridgeRequest;
    try {
      const result = await handler(method, args);
      port.postMessage({ id, result });
    } catch (e: unknown) {
      port.postMessage({
        id,
        error: e instanceof Error ? e.message : String(e),
        errorCode: (e as { code?: string })?.code,
      });
    }
  };
};

const collect = async (stream: ReadableStream): Promise<Uint8Array> => {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value as Uint8Array);
  }
  const size = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const out = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer =>
  bytes.slice().buffer as ArrayBuffer;


describe("StorageProviderProxy over MessagePort", () => {
  let proxy: StorageProviderProxy;
  let serverPort: MessagePort;

  beforeEach(() => {
    const channel = new MessageChannel();
    serverPort = channel.port1;
    proxy = new StorageProviderProxy(channel.port2);
  });

  /*
    Browsers require explicit start() on a MessagePort when listening
    with addEventListener (Node.js auto-starts, so this test ensures the
    call is present regardless of environment).
  */
  it("should call start() on the MessagePort", () => {
    const channel = new MessageChannel();
    const startSpy = vi.spyOn(channel.port2, "start");
    new StorageProviderProxy(channel.port2);
    expect(startSpy).toHaveBeenCalled();
  });

  it("should namespace method names with \"storage.\"", async () => {
    const seen: string[] = [];
    setupHandler(serverPort, (method) => {
      seen.push(method);
      return "content";
    });

    await proxy.readObjectAsString("a.subtext");
    expect(seen).toEqual(["storage.readObjectAsString"]);
  });

  it("should forward plain calls and their arguments", async () => {
    setupHandler(serverPort, (method, args) => {
      if (method === "storage.readObjectAsString") {
        return "content of " + (args[0] as string);
      }
      throw new Error("Unknown method: " + method);
    });

    expect(await proxy.readObjectAsString("note.subtext"))
      .toBe("content of note.subtext");
  });

  it("should handle multiple concurrent calls", async () => {
    setupHandler(serverPort, (_method, args) => "size:" + args[0]);

    const results = await Promise.all([
      proxy.readObjectAsString("a"),
      proxy.readObjectAsString("b"),
      proxy.readObjectAsString("c"),
    ]);

    expect(results).toEqual(["size:a", "size:b", "size:c"]);
  });

  it("should propagate errors from the far end", async () => {
    setupHandler(serverPort, () => {
      throw new Error("File not found.");
    });

    await expect(proxy.readObjectAsString("x"))
      .rejects.toThrow("File not found.");
  });

  it("should attach the POSIX error code to rejected calls", async () => {
    setupHandler(serverPort, () => {
      const err = new Error("ENOENT: no such file") as Error & {
        code: string;
      };
      err.code = "ENOENT";
      throw err;
    });

    await expect(proxy.getObjectSize("x")).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  describe("chunked reads", () => {
    it("should assemble a stream from one chunk per pull", async () => {
      const source = new TextEncoder().encode("abcdefghij");
      const chunkSize = 4;
      let offset = 0;
      const pulls: number[] = [];

      setupHandler(serverPort, (method, args) => {
        if (method === "storage.openRead") {
          expect(args[0]).toBe("a.txt");
          return { streamId: 1, size: source.byteLength };
        }
        if (method === "storage.readChunk") {
          if (offset >= source.byteLength) return null;
          const chunk = source.slice(offset, offset + chunkSize);
          offset += chunk.byteLength;
          pulls.push(chunk.byteLength);
          return toArrayBuffer(chunk);
        }
        throw new Error("Unknown method: " + method);
      });

      const bytes = await collect(await proxy.getReadableStream("a.txt"));
      expect(new TextDecoder().decode(bytes)).toBe("abcdefghij");
      expect(pulls).toEqual([4, 4, 2]);
    });

    it("should forward a ByteRange to openRead", async () => {
      let receivedRange: unknown = "not called";
      setupHandler(serverPort, (method, args) => {
        if (method === "storage.openRead") {
          receivedRange = args[1];
          return { streamId: 1, size: 0 };
        }
        if (method === "storage.readChunk") return null;
        throw new Error("Unknown method: " + method);
      });

      await collect(
        await proxy.getReadableStream("a.txt", { start: 1, end: 3 }),
      );
      expect(receivedRange).toEqual({ start: 1, end: 3 });
    });

    it("should error the stream when a chunk request fails", async () => {
      setupHandler(serverPort, (method) => {
        if (method === "storage.openRead") {
          return { streamId: 1, size: 10 };
        }
        throw new Error("Disk went away");
      });

      const stream = await proxy.getReadableStream("a.txt");
      await expect(collect(stream)).rejects.toThrow("Disk went away");
    });

    it("should close the far-end session when the reader cancels",
      async () => {
        const closed: number[] = [];
        setupHandler(serverPort, (method, args) => {
          if (method === "storage.openRead") {
            return { streamId: 42, size: 10 };
          }
          if (method === "storage.readChunk") {
            return toArrayBuffer(new Uint8Array([1]));
          }
          if (method === "storage.closeRead") {
            closed.push(args[0] as number);
            return undefined;
          }
          throw new Error("Unknown method: " + method);
        });

        const stream = await proxy.getReadableStream("a.txt");
        const reader = stream.getReader();
        await reader.read();
        await reader.cancel();

        await vi.waitFor(() => {
          expect(closed).toEqual([42]);
        });
      },
    );
  });

  describe("chunked writes", () => {
    it("should send one chunk per source chunk and return the size",
      async () => {
        const written: number[][] = [];

        setupHandler(serverPort, (method, args) => {
          if (method === "storage.openWrite") {
            expect(args[0]).toBe("files/blob.bin");
            return { streamId: 7 };
          }
          if (method === "storage.writeChunk") {
            expect(args[0]).toBe(7);
            written.push([...new Uint8Array(args[1] as ArrayBuffer)]);
            return undefined;
          }
          if (method === "storage.closeWrite") {
            return written.reduce((sum, chunk) => sum + chunk.length, 0);
          }
          throw new Error("Unknown method: " + method);
        });

        const readable = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new Uint8Array([1, 2]));
            controller.enqueue(new Uint8Array([3, 4, 5]));
            controller.close();
          },
        });

        const size = await proxy.writeObjectFromReadable(
          "files/blob.bin",
          readable,
        );

        expect(written).toEqual([[1, 2], [3, 4, 5]]);
        expect(size).toBe(5);
      },
    );

    it("should encode string chunks as UTF-8", async () => {
      const written: number[][] = [];

      setupHandler(serverPort, (method, args) => {
        if (method === "storage.openWrite") return { streamId: 1 };
        if (method === "storage.writeChunk") {
          written.push([...new Uint8Array(args[1] as ArrayBuffer)]);
          return undefined;
        }
        if (method === "storage.closeWrite") return 2;
        throw new Error("Unknown method: " + method);
      });

      const readable = new ReadableStream<string>({
        start(controller) {
          controller.enqueue("ü");
          controller.close();
        },
      });

      await proxy.writeObjectFromReadable(
        "a.txt",
        readable as unknown as ReadableStream,
      );

      expect(written).toEqual([[0xc3, 0xbc]]);
    });

    it("should abort the far-end session if the source errors",
      async () => {
        const aborted: number[] = [];

        setupHandler(serverPort, (method, args) => {
          if (method === "storage.openWrite") return { streamId: 9 };
          if (method === "storage.writeChunk") return undefined;
          if (method === "storage.abortWrite") {
            aborted.push(args[0] as number);
            return undefined;
          }
          throw new Error("Unknown method: " + method);
        });

        const readable = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new Uint8Array([1]));
            controller.error(new Error("Source blew up"));
          },
        });

        await expect(
          proxy.writeObjectFromReadable("a.bin", readable),
        ).rejects.toThrow("Source blew up");

        expect(aborted).toEqual([9]);
      },
    );
  });

  it("should share one id sequence when the client is shared", async () => {
    const channel = new MessageChannel();
    const client = new BridgeClient(channel.port2);
    const proxyA = new StorageProviderProxy(client);
    const proxyB = new StorageProviderProxy(client);

    const ids: number[] = [];
    setupHandler(channel.port1, () => "ok");
    channel.port1.addEventListener("message", (event: MessageEvent) => {
      ids.push((event.data as BridgeRequest).id);
    });
    channel.port1.start();

    await Promise.all([
      proxyA.readObjectAsString("a"),
      proxyB.readObjectAsString("b"),
    ]);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
