/*
  StorageProvider that forwards every call to the Node fs implementation
  in the Electron main process.

  A ReadableStream is transferable between renderer contexts but not
  across the main-process boundary, so both stream methods are chunked:
  reads pull one ArrayBuffer at a time, writes push one at a time and
  finish with a byte count. Chunks are copied out of the source before
  they go on the wire, so a detached buffer can never surprise the
  producer.
*/

import ByteRange from "../notes/types/ByteRange";
import StorageProvider from "../notes/types/StorageProvider";
import BridgeClient from "./BridgeClient";
import { OpenReadResult, OpenWriteResult } from "./bridgeTypes";

export default class StorageProviderProxy implements StorageProvider {
  #client: BridgeClient;

  constructor(portOrClient: MessagePort | BridgeClient) {
    this.#client = portOrClient instanceof BridgeClient
      ? portOrClient
      : new BridgeClient(portOrClient);
  }

  #call(method: string, args: unknown[] = []): Promise<unknown> {
    return this.#client.call("storage." + method, args);
  }

  async readObjectAsString(requestPath: string): Promise<string> {
    return await this.#call("readObjectAsString", [requestPath]) as string;
  }

  async getAllObjectNames(): Promise<string[]> {
    return await this.#call("getAllObjectNames") as string[];
  }

  async removeObject(requestPath: string): Promise<void> {
    await this.#call("removeObject", [requestPath]);
  }

  async writeObject(requestPath: string, data: string): Promise<void> {
    await this.#call("writeObject", [requestPath, data]);
  }

  async renameObject(requestPath: string, newPath: string): Promise<void> {
    await this.#call("renameObject", [requestPath, newPath]);
  }

  async getObjectSize(requestPath: string): Promise<number> {
    return await this.#call("getObjectSize", [requestPath]) as number;
  }

  async getTotalSize(): Promise<number> {
    return await this.#call("getTotalSize") as number;
  }

  async listSubDirectories(requestPath: string): Promise<string[]> {
    return await this.#call("listSubDirectories", [requestPath]) as string[];
  }

  async getReadableStream(
    requestPath: string,
    range?: ByteRange,
  ): Promise<ReadableStream<Uint8Array>> {
    const { streamId } = await this.#call(
      "openRead",
      [requestPath, range],
    ) as OpenReadResult;

    const client = this.#client;

    return new ReadableStream<Uint8Array>({
      /*
        One request per pull: the stream's own backpressure decides how
        fast main is asked for the next chunk.
      */
      async pull(controller) {
        try {
          const chunk = await client.call(
            "storage.readChunk",
            [streamId],
          ) as ArrayBuffer | null;
          if (!chunk) {
            controller.close();
            return;
          }
          controller.enqueue(new Uint8Array(chunk));
        } catch (e) {
          controller.error(e);
        }
      },
      async cancel() {
        await client.call("storage.closeRead", [streamId]).catch(() => {
          // The session may already be gone.
        });
      },
    });
  }

  async writeObjectFromReadable(
    requestPath: string,
    readableStream: ReadableStream,
  ): Promise<number> {
    const { streamId } = await this.#call(
      "openWrite",
      [requestPath],
    ) as OpenWriteResult;

    const reader = (readableStream as ReadableStream<Uint8Array | string>)
      .getReader();
    const encoder = new TextEncoder();

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value === undefined || value === null) continue;
        const bytes = typeof value === "string"
          ? encoder.encode(value)
          : value;
        const buffer = bytes.slice().buffer as ArrayBuffer;
        await this.#client.call("storage.writeChunk", [streamId, buffer]);
      }
    } catch (e) {
      await this.#client.call("storage.abortWrite", [streamId]).catch(() => {
        // Nothing more we can do.
      });
      throw e;
    } finally {
      reader.releaseLock();
    }

    return await this.#client.call(
      "storage.closeWrite",
      [streamId],
    ) as number;
  }
}
