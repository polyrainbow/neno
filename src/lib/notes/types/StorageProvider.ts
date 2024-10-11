import ByteRange from "./ByteRange";

export default interface StorageProvider {
  readObjectAsString: (
    requestPath: string,
  ) => Promise<string>,
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
