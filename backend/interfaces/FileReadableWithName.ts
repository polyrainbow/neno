import { Readable } from "stream";

export default interface FileReadableWithName {
    readableStream: Readable,
    filename: string,
};