import { Readable } from "./Readable";

export default interface ReadableWithMimeType {
  readonly readable: Readable,
  readonly mimeType: string,
}
