import fs from "fs/promises";
import fsClassic from "fs";
import * as path from "path";
import mkdirp from "mkdirp";
import { Readable } from "stream";


async function asyncFilter<T>(
  arr:Array<T>,
  callback,
):Promise<Array<T>> {
  const fail: unique symbol = Symbol();

  const values: Array<T | symbol> = await Promise.all(
    arr.map(
      async (item:T) => (await callback(item)) ? item : fail
    ),
  );

  const passedValues:Array<T> = values.filter(
    (val: T | symbol):boolean => {
      return val !== fail;
    },
  ) as Array<T>;

  return passedValues;
}


export default class FileSystemStorageProvider {
  #dataPath;

  constructor(dataPath: string) {
    this.#dataPath = dataPath;
    mkdirp.sync(path.dirname(dataPath));
  }

  async writeObject(
    requestPath: string,
    data: string | Buffer,
  ):Promise<void> {
    const finalPath = this.joinPath(this.#dataPath, requestPath);
    mkdirp.sync(path.dirname(finalPath));
    await fs.writeFile(finalPath, data);
  }

  async writeObjectFromReadable(
    requestPath: string,
    readableStream: Readable,
  ):Promise<void> {
    const finalPath = this.joinPath(this.#dataPath, requestPath);
    mkdirp.sync(path.dirname(finalPath));
    const writableStream = fsClassic.createWriteStream(finalPath);
    readableStream.pipe(writableStream);
    return await new Promise((resolve, reject) => {
      writableStream.on('finish', () => {
        resolve();
      });

      writableStream.on('error', (e) => {
        reject(e);
      });

      readableStream.on('error', (e) => {
        reject(e);
      });
    })
  }

  async readObject(requestPath:string):Promise<Buffer> {
    const finalPath = this.joinPath(this.#dataPath, requestPath);
    const content = await fs.readFile(finalPath);
    return content;
  }

  getReadableStream(requestPath:string):Readable {
    const finalPath = this.joinPath(this.#dataPath, requestPath);
    const readableStream = fsClassic.createReadStream(finalPath);
    return readableStream;
  }

  async removeObject(requestPath:string):Promise<void> {
    const finalPath = this.joinPath(this.#dataPath, requestPath);
    await fs.unlink(finalPath);
  }

  async listSubDirectories(requestPath):Promise<string[]> {
    const finalPath = this.joinPath(this.#dataPath, requestPath);
    const filenames:string[] = await fs.readdir(finalPath);
    
    const directories:string[] = await asyncFilter(
      filenames,
      async (objectName:string):Promise<boolean> => {
        const stat = await fs.stat(this.joinPath(finalPath, objectName));
        return stat.isDirectory();
      },
    );

    return directories;
  }

  async listDirectory(requestPath) {
    const finalPath = this.joinPath(this.#dataPath, requestPath);
    const filenames = await fs.readdir(finalPath);
    return filenames;
  }

  joinPath(...args) {
    return path.join(...args);
  }
}