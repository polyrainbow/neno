import { GraphId } from "./GraphId";
import ByteRange from "./ByteRange";

export default interface StorageProvider<ReadableStreamImplementation> {
  readObjectAsString: (
    graphId: GraphId,
    requestPath: string,
  ) => Promise<string>,
  getReadableStream: (
    graphId: GraphId,
    requestPath: string,
    range?: ByteRange,
  ) => Promise<ReadableStreamImplementation>,
  removeObject: (graphId: GraphId, requestPath: string) => Promise<void>,
  writeObject: (
    graphId: GraphId,
    requestPath: string,
    data: string,
  ) => Promise<void>,
  writeObjectFromReadable: (
    graphId: GraphId,
    requestPath: string,
    readableStream: ReadableStreamImplementation,
  ) => Promise<number>,
  joinPath: (...segments: string[]) => string,
  getFileSize(graphId: GraphId, requestPath: string): Promise<number>,
  listDirectory(graphId: GraphId, requestPath: string): Promise<string[]>,
  getFolderSize(graphId: GraphId, requestPath: string): Promise<number>,

  // optional
  getArchiveStreamOfFolder?: (
    graphId: GraphId,
    requestPath: string,
  ) => Promise<ReadableStreamImplementation>,
}