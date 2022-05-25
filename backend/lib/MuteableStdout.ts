import { stdout } from "process";
import { Writable } from "stream";

export default class MuteableStdout extends Writable{
  muted = false;

  write(chunk: any, callback?: (error: Error | null | undefined) => void): boolean;
  write(
    chunk: any,
    encoding: BufferEncoding,
    callback?: (error: Error | null | undefined) => void
  ): boolean;
  write(
    chunk: any,
    // @ts-ignore
    encoding?: BufferEncoding | ((error: Error | null | undefined) => void),
    callback?: (error: Error | null | undefined) => void
  ): boolean {
    if (!this.muted)
      stdout.write(chunk);
    if (callback) callback(null);
    return true;
  }
}