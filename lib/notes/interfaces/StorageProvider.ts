import { GraphId } from "./GraphId";
import ByteRange from "./ByteRange";
import { SomeReadableStream } from "./SomeReadableStream";

export default interface StorageProvider {
  readObjectAsString: (
    graphId: GraphId,
    requestPath: string,
  ) => Promise<string>,
  getReadableStream: (
    graphId: GraphId,
    requestPath: string,
    range?: ByteRange,
  ) => Promise<SomeReadableStream>,
  removeObject: (graphId: GraphId, requestPath: string) => Promise<void>,
  writeObject: (
    graphId: GraphId,
    requestPath: string,
    data: string,
  ) => Promise<void>,
  writeObjectFromReadable: (
    graphId: GraphId,
    requestPath: string,
    readableStream: SomeReadableStream,
  ) => Promise<number>,
  joinPath: (...segments: string[]) => string,
  getFileSize(graphId: GraphId, requestPath: string): Promise<number>,
  listDirectory(graphId: GraphId, requestPath: string): Promise<string[]>,
  getFolderSize(graphId: GraphId, requestPath: string): Promise<number>,

  // optional
  getArchiveStreamOfFolder?: (
    graphId: GraphId,
    requestPath: string,
  ) => Promise<SomeReadableStream>,
}