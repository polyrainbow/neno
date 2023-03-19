import { GraphId } from "../interfaces/GraphId";
import StorageProvider from "../interfaces/StorageProvider";

export default class MockStorageProvider implements StorageProvider<string> {
  #files = new Map<string, string>;

  readObjectAsString(
    graphId: GraphId,
    requestPath: string,
  ): Promise<string> {
    const finalPath = this.joinPath(graphId, requestPath);
    if (this.#files.has(finalPath)) {
      return Promise.resolve(this.#files.get(finalPath) as string);
    } else {
      throw new Error("File not found.");
    }
  }

  /* in this mock provider, we just return the string as such when requesting
  a stream */
  getReadableStream(
    graphId: GraphId,
    requestPath: string,
  ): Promise<string> {
    const finalPath = this.joinPath(graphId, requestPath);
    if (this.#files.has(finalPath)) {
      return Promise.resolve(this.#files.get(finalPath) as string);
    } else {
      throw new Error("File not found.");
    }
  }


  removeObject(graphId: GraphId, requestPath: string): Promise<void> {
    const finalPath = this.joinPath(graphId, requestPath);
    this.#files.delete(finalPath);
    return Promise.resolve();
  }


  writeObject(
    graphId: GraphId,
    requestPath: string,
    data: string,
  ): Promise<void> {
    const finalPath = this.joinPath(graphId, requestPath);
    this.#files.set(finalPath, data);
    return Promise.resolve();
  }

  writeObjectFromReadable(
    graphId: GraphId,
    requestPath: string,
    readableStream: string,
  ): Promise<number> {
    const finalPath = this.joinPath(graphId, requestPath);
    this.#files.set(finalPath, readableStream);
    const size = new Blob([readableStream]).size;  
    return Promise.resolve(size);
  }


  joinPath(...segments: string[]): string {
    return segments.join("/");
  }


  getFileSize(graphId: GraphId, requestPath: string): Promise<number> {
    const finalPath = this.joinPath(graphId, requestPath);
    if (this.#files.has(finalPath)) {
      const value = this.#files.get(finalPath) as string;
      const size = new Blob([value]).size;
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