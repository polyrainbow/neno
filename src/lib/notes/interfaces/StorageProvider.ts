import ByteRange from "./ByteRange";

export default interface StorageProvider {
  readObjectAsString: (
    requestPath: string,
  ) => Promise<string>,
  getReadableStream: (
    requestPath: string,
    range?: ByteRange,
  ) => Promise<ReadableStream>,
  removeObject: (requestPath: string) => Promise<void>,
  writeObject: (
    requestPath: string,
    data: string,
  ) => Promise<void>,
  writeObjectFromReadable: (
    requestPath: string,
    readableStream: ReadableStream,
  ) => Promise<number>,
  joinPath: (...segments: string[]) => string,
  getFileSize(requestPath: string): Promise<number>,
  listDirectory(requestPath?: string): Promise<string[]>,
  getFolderSize(requestPath?: string): Promise<number>,
}
