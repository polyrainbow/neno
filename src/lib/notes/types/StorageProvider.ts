import ByteRange from "./ByteRange";

export default interface StorageProvider {
  readObjectAsString: (
    requestPath: string,
  ) => Promise<string>,
  /*
    Optional: many objects in one call, in the order asked for. Loading a
    graph reads every note, and when storage sits behind a process or
    language boundary one round-trip per note dominates the load time —
    5,000 notes take 125 ms in one Android bridge call against 855 ms in
    one call each. Rejects if any of them cannot be read.
  */
  readObjectsAsStrings?: (
    requestPaths: string[],
  ) => Promise<string[]>,
  getAllObjectNames: () => Promise<string[]>,
  getReadableStream: (
    requestPath: string,
    range?: ByteRange,
  ) => Promise<ReadableStream>,
  removeObject: (requestPath: string) => Promise<void>,
  writeObject: (
    requestPath: string,
    data: string,
  ) => Promise<void>,
  renameObject: (
    requestPath: string,
    newPath: string,
  ) => Promise<void>,
  writeObjectFromReadable: (
    requestPath: string,
    readableStream: ReadableStream,
  ) => Promise<number>,
  getTotalSize(): Promise<number>,
  getObjectSize(requestPath: string): Promise<number>,
}
