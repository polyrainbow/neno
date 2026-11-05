/*
  Throwaway repositories for the git specs: real directories, driven by
  the real git CLI, so what the specs check is what a user's terminal
  would see.
*/

import { execFileSync } from "node:child_process";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

export const GIT = "/usr/bin/git";

export const AUTHOR = { name: "Test", email: "test@example.com" };

export async function makeTempDir(prefix: string): Promise<string> {
  // realpath: macOS hands out /var/…, which is a symlink to /private/var/….
  return fs.realpath(
    await fs.mkdtemp(path.join(os.tmpdir(), `neno-${prefix}-`)),
  );
}

/** Runs git in `cwd` and returns its trimmed stdout. */
export function git(cwd: string, ...args: string[]): string {
  return execFileSync(GIT, args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "CLI",
      GIT_AUTHOR_EMAIL: "cli@example.com",
      GIT_COMMITTER_NAME: "CLI",
      GIT_COMMITTER_EMAIL: "cli@example.com",
      GIT_CONFIG_NOSYSTEM: "1",
    },
  }).trim();
}

export async function writeFile(
  dir: string,
  relPath: string,
  content: string | Uint8Array,
): Promise<void> {
  const file = path.join(dir, relPath);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}

export async function readFile(
  dir: string,
  relPath: string,
): Promise<string> {
  return fs.readFile(path.join(dir, relPath), "utf8");
}

export async function exists(dir: string, relPath: string): Promise<boolean> {
  try {
    await fs.stat(path.join(dir, relPath));
    return true;
  } catch {
    return false;
  }
}
