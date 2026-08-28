/*
  The subset of the node `fs` module that isomorphic-git uses. Two
  implementations exist: FileSystemAccessFs (File System Access API /
  OPFS) and GitFsProxy (Node fs in the Electron main process, over RPC).
*/

export interface FsStat {
  type: "file" | "dir" | "symlink";
  mode: number;
  size: number;
  ino: number;
  mtimeMs: number;
  ctimeMs: number;
  uid: number;
  gid: number;
  dev: number;
  isFile(): boolean;
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
}

export interface GitFs {
  readFile(
    path: string,
    options?: { encoding?: string } | string,
  ): Promise<Uint8Array | string>;
  writeFile(
    path: string,
    data: Uint8Array | string,
    options?: { encoding?: string; mode?: number } | string,
  ): Promise<void>;
  unlink(path: string): Promise<void>;
  readdir(path: string): Promise<string[]>;
  mkdir(
    path: string,
    options?: { recursive?: boolean; mode?: number },
  ): Promise<void>;
  rmdir(path: string): Promise<void>;
  stat(path: string): Promise<FsStat>;
  lstat(path: string): Promise<FsStat>;
  readlink(path: string): Promise<string>;
  symlink(target: string, path: string): Promise<void>;
  chmod(path: string, mode: number): Promise<void>;
  /*
    isomorphic-git probes for a `promises` namespace and uses it
    exclusively if present, so implementations alias it to themselves.
  */
  promises: GitFs;
}

/**
 * Rebuilds the isFile/isDirectory/isSymbolicLink predicates that cannot
 * survive a structured clone.
 */
export function makeStatFromType(args: {
  type: "file" | "dir" | "symlink";
  mode: number;
  size: number;
  ino: number;
  mtimeMs: number;
  ctimeMs: number;
  uid: number;
  gid: number;
  dev: number;
}): FsStat {
  const { type } = args;
  return {
    ...args,
    isFile: () => type === "file",
    isDirectory: () => type === "dir",
    isSymbolicLink: () => type === "symlink",
  };
}
