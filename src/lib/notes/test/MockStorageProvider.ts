import StorageProvider from "../interfaces/StorageProvider";

export default class MockStorageProvider implements StorageProvider {
  #files = new Map<string, Uint8Array>();

  readObjectAsString(
    requestPath: string,
  ): Promise<string> {
    if (this.#files.has(requestPath)) {
      const mapItem = this.#files.get(requestPath) as Uint8Array;
      return Promise.resolve(mapItem.toString());
    } else {
      throw new Error("File not found.");
    }
  }

  /* in this mock provider, we just return the string as such when requesting
  a stream */
  getReadableStream(
    requestPath: string,
  ): Promise<ReadableStream> {
    if (this.#files.has(requestPath)) {
      const mapItem = this.#files.get(requestPath) as Uint8Array;
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(mapItem);
          controller.close();
        },
      });
      return Promise.resolve(readableStream);
    } else {
      throw new Error("File not found.");
    }
  }


  removeObject(requestPath: string): Promise<void> {
    this.#files.delete(requestPath);
    return Promise.resolve();
  }


  writeObject(
    requestPath: string,
    data: string,
  ): Promise<void> {
    const strToUTF8 = (string: string) => {
      const encoder = new TextEncoder();
      return encoder.encode(string);
    };
    this.#files.set(requestPath, strToUTF8(data));
    return Promise.resolve();
  }

  async writeObjectFromReadable(
    requestPath: string,
    readableStream: ReadableStream,
  ): Promise<number> {
    const blob = new Uint8Array(
      await (await new Response(readableStream).blob()).arrayBuffer(),
    );
    this.#files.set(requestPath, blob);
    const size = blob.length;
    return Promise.resolve(size);
  }


  joinPath(...segments: string[]): string {
    return segments.join("/");
  }


  getFileSize(requestPath: string): Promise<number> {
    if (this.#files.has(requestPath)) {
      const value = this.#files.get(requestPath) as Uint8Array;
      const size = value.length;
      return Promise.resolve(size);
    } else {
      throw new Error("File not found.");
    }
  }


  listDirectory(): Promise<string[]> {
    return Promise.resolve([]);
  }


  getFolderSize(): Promise<number> {
    return Promise.resolve(0);
  }
}
