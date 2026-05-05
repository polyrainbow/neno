/*
  Helpers for per-flush commits against the user's notes directory.

  - `ensureRepo` — initializes a fresh repo if `.git/HEAD` is missing;
    otherwise adopts the existing one.
  - `commitChanged` — stages the paths named by the three flush sets
    (plus `.pins.neno` when pins changed) and creates a single commit
    with a generated message.
*/

import git from "isomorphic-git";
import FileSystemAccessFs from "./FileSystemAccessFs";
import { Slug } from "../notes/types/Slug";

const GITIGNORE_DEFAULT = ".DS_Store\n";
const GRAPH_FILE_EXTENSION = ".subtext";
const PINS_FILENAME = ".pins.neno";

export interface GitAuthor {
  name: string;
  email: string;
}

export interface FlushChangeSets {
  canonicalNoteSlugs: Set<Slug> | "all";
  aliases: Set<Slug> | "all";
  arbitraryFiles: Set<Slug> | "all";
  flushPins: boolean;
}

export interface ChangedFile {
  path: string;
  change: "add" | "modify" | "delete";
}

export interface CommitInfo {
  oid: string;
  message: string;
  author: { name: string; email: string };
  timestamp: number;
  timezoneOffset: number;
  changes: ChangedFile[];
}

export interface CommitHistoryOptions {
  limit: number;
  offset: number;
}

export interface DiffSegment {
  text: string;
  emphasized: boolean;
}

export interface DiffLine {
  type: "context" | "add" | "remove";
  text: string;
  segments?: DiffSegment[];
}

export interface FileDiff {
  path: string;
  change: "add" | "modify" | "delete";
  lines?: DiffLine[];
  binary?: boolean;
  tooLarge?: boolean;
}

const MAX_DIFF_BYTES = 200_000;

function getFilenameForSlug(slug: Slug): string {
  return `${slug}${GRAPH_FILE_EXTENSION}`;
}

async function fileExists(
  fs: FileSystemAccessFs,
  path: string,
): Promise<boolean> {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}

function getHeadPath(dir: string): string {
  return dir.endsWith("/")
    ? `${dir}.git/HEAD`
    : `${dir}/.git/HEAD`;
}

export async function hasExistingRepo(
  fs: FileSystemAccessFs,
  dir: string,
): Promise<boolean> {
  return fileExists(fs, getHeadPath(dir));
}

export async function ensureRepo(
  fs: FileSystemAccessFs,
  dir: string,
  author: GitAuthor,
): Promise<void> {
  if (await hasExistingRepo(fs, dir)) {
    return;
  }

  await git.init({ fs, dir, defaultBranch: "main" });
  await fs.writeFile(
    dir.endsWith("/") ? `${dir}.gitignore` : `${dir}/.gitignore`,
    GITIGNORE_DEFAULT,
  );
  const matrix = await git.statusMatrix({ fs, dir });
  for (const [filepath, , workdir] of matrix) {
    if (workdir === 0) continue;
    await git.add({ fs, dir, filepath });
  }
  await git.commit({
    fs,
    dir,
    author,
    message: "initial commit",
  });
}

function pathToSlug(path: string): string {
  return path.endsWith(GRAPH_FILE_EXTENSION)
    ? path.slice(0, -GRAPH_FILE_EXTENSION.length)
    : path;
}

function formatMessage(
  creates: string[],
  modifies: string[],
  removes: string[],
): string {
  const total = creates.length + modifies.length + removes.length;

  if (total === 0) {
    return "update";
  }

  if (total === 1) {
    if (creates.length === 1) {
      const path = creates[0];
      if (path.endsWith(GRAPH_FILE_EXTENSION)) {
        return `create: ${pathToSlug(path)}`;
      }
      return `create file: ${path}`;
    }
    if (modifies.length === 1) {
      const path = modifies[0];
      if (path.endsWith(GRAPH_FILE_EXTENSION)) {
        return `update: ${pathToSlug(path)}`;
      }
      return `update file: ${path}`;
    }
    const path = removes[0];
    if (path.endsWith(GRAPH_FILE_EXTENSION)) {
      return `delete: ${pathToSlug(path)}`;
    }
    return `delete file: ${path}`;
  }

  const all = [...creates, ...modifies, ...removes];
  const noteCount = all.filter(
    (p) => p.endsWith(GRAPH_FILE_EXTENSION),
  ).length;
  const fileCount = total - noteCount;

  const header = [
    noteCount > 0
      ? `${noteCount} note${noteCount === 1 ? "" : "s"}`
      : null,
    fileCount > 0
      ? `${fileCount} file${fileCount === 1 ? "" : "s"}`
      : null,
  ]
    .filter((s): s is string => s !== null)
    .join(", ");

  const verb = modifies.length === 0 && removes.length === 0
    ? "create"
    : creates.length === 0 && modifies.length === 0
      ? "delete"
      : "update";

  const body = [
    ...creates.map((p) => `+ ${p}`),
    ...modifies.map((p) => `~ ${p}`),
    ...removes.map((p) => `- ${p}`),
  ].join("\n");

  return `${verb}: ${header}\n\n${body}`;
}

async function stagePath(
  fs: FileSystemAccessFs,
  dir: string,
  relPath: string,
  headOid: string | null,
  creates: string[],
  modifies: string[],
  removes: string[],
): Promise<void> {
  const absPath = dir.endsWith("/")
    ? `${dir}${relPath}`
    : `${dir}/${relPath}`;

  if (await fileExists(fs, absPath)) {
    let inHead = false;
    if (headOid) {
      try {
        await git.readBlob({ fs, dir, oid: headOid, filepath: relPath });
        inHead = true;
      } catch {
        inHead = false;
      }
    }
    await git.add({ fs, dir, filepath: relPath });
    if (inHead) {
      modifies.push(relPath);
    } else {
      creates.push(relPath);
    }
  } else {
    try {
      await git.remove({ fs, dir, filepath: relPath });
      removes.push(relPath);
    } catch {
      // Not tracked and no longer on disk — nothing to do.
    }
  }
}

async function stageAll(
  fs: FileSystemAccessFs,
  dir: string,
  creates: string[],
  modifies: string[],
  removes: string[],
): Promise<void> {
  const matrix = await git.statusMatrix({ fs, dir });
  for (const row of matrix) {
    const [filepath, head, workdir, stage] = row;
    if (workdir === head && stage === head) {
      continue;
    }
    if (workdir === 0) {
      try {
        await git.remove({ fs, dir, filepath });
        removes.push(filepath);
      } catch {
        // ignore
      }
    } else {
      await git.add({ fs, dir, filepath });
      if (head === 0) {
        creates.push(filepath);
      } else {
        modifies.push(filepath);
      }
    }
  }
}

export async function commitChanged(
  fs: FileSystemAccessFs,
  dir: string,
  changes: FlushChangeSets,
  author: GitAuthor,
): Promise<void> {
  const creates: string[] = [];
  const modifies: string[] = [];
  const removes: string[] = [];

  let headOid: string | null;
  try {
    headOid = await git.resolveRef({ fs, dir, ref: "HEAD" });
  } catch {
    headOid = null;
  }

  const allSetsAreSets
    = changes.canonicalNoteSlugs instanceof Set
    && changes.aliases instanceof Set
    && changes.arbitraryFiles instanceof Set;

  if (!allSetsAreSets) {
    await stageAll(fs, dir, creates, modifies, removes);
  } else {
    const noteSlugs = changes.canonicalNoteSlugs as Set<Slug>;
    const aliasSlugs = changes.aliases as Set<Slug>;
    const fileSlugs = changes.arbitraryFiles as Set<Slug>;

    for (const slug of noteSlugs) {
      await stagePath(
        fs, dir, getFilenameForSlug(slug), headOid,
        creates, modifies, removes,
      );
    }
    for (const slug of aliasSlugs) {
      await stagePath(
        fs, dir, getFilenameForSlug(slug), headOid,
        creates, modifies, removes,
      );
    }
    for (const slug of fileSlugs) {
      await stagePath(
        fs, dir, getFilenameForSlug(slug), headOid,
        creates, modifies, removes,
      );
      await stagePath(
        fs, dir, slug, headOid,
        creates, modifies, removes,
      );
    }
  }

  if (changes.flushPins) {
    await stagePath(
      fs, dir, PINS_FILENAME, headOid,
      creates, modifies, removes,
    );
  }

  if (
    creates.length === 0
    && modifies.length === 0
    && removes.length === 0
  ) {
    return;
  }

  await git.commit({
    fs,
    dir,
    author,
    message: formatMessage(creates, modifies, removes),
  });
}

async function getChangedPaths(
  fs: FileSystemAccessFs,
  dir: string,
  oid: string,
  parentOid: string | undefined,
): Promise<ChangedFile[]> {
  const trees = parentOid
    ? [git.TREE({ ref: oid }), git.TREE({ ref: parentOid })]
    : [git.TREE({ ref: oid })];

  const changes: ChangedFile[] = [];

  await git.walk({
    fs,
    dir,
    trees,
    map: async (filepath, entries) => {
      if (filepath === ".") return;
      if (!entries) return;

      const A = entries[0];
      const B = entries.length > 1 ? entries[1] : null;

      const aType = A ? await A.type() : null;
      const bType = B ? await B.type() : null;

      if (aType === "tree" || bType === "tree") return;

      const aOid = A ? await A.oid() : null;
      const bOid = B ? await B.oid() : null;

      if (parentOid) {
        if (aOid === bOid) return;
        if (!A) {
          changes.push({ path: filepath, change: "delete" });
        } else if (!B) {
          changes.push({ path: filepath, change: "add" });
        } else {
          changes.push({ path: filepath, change: "modify" });
        }
      } else if (A) {
        changes.push({ path: filepath, change: "add" });
      }
    },
  });

  changes.sort((a, b) => a.path.localeCompare(b.path));
  return changes;
}

export async function getCommitHistory(
  fs: FileSystemAccessFs,
  dir: string,
  options: CommitHistoryOptions,
): Promise<CommitInfo[]> {
  const { limit, offset } = options;

  const allCommits = await git.log({
    fs,
    dir,
    depth: offset + limit,
  });
  const page = allCommits.slice(offset, offset + limit);

  const result: CommitInfo[] = [];

  for (const entry of page) {
    const parentOid: string | undefined = entry.commit.parent[0];
    const changes = await getChangedPaths(fs, dir, entry.oid, parentOid);

    result.push({
      oid: entry.oid,
      message: entry.commit.message,
      author: {
        name: entry.commit.author.name,
        email: entry.commit.author.email,
      },
      timestamp: entry.commit.author.timestamp,
      timezoneOffset: entry.commit.author.timezoneOffset,
      changes,
    });
  }

  return result;
}

function isBinary(bytes: Uint8Array): boolean {
  const limit = Math.min(bytes.length, 8000);
  for (let i = 0; i < limit; i++) {
    if (bytes[i] === 0) return true;
  }
  return false;
}

function decode(bytes: Uint8Array): string {
  return new TextDecoder("utf-8").decode(bytes);
}

function tokenize(text: string): string[] {
  return text.match(/\w+|\s+|[^\s\w]/gu) ?? [];
}

function pushSegment(
  arr: DiffSegment[],
  text: string,
  emphasized: boolean,
): void {
  const last = arr[arr.length - 1];
  if (last && last.emphasized === emphasized) {
    last.text += text;
  } else {
    arr.push({ text, emphasized });
  }
}

function diffTokens(
  oldText: string,
  newText: string,
): { removeSegments: DiffSegment[]; addSegments: DiffSegment[] } {
  const a = tokenize(oldText);
  const b = tokenize(newText);
  const m = a.length;
  const n = b.length;

  const lcs: number[][] = Array.from(
    { length: m + 1 },
    () => new Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }

  const ops: Array<{ type: "context" | "add" | "remove"; text: string }> = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      ops.unshift({ type: "context", text: a[i - 1] });
      i--;
      j--;
    } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
      ops.unshift({ type: "remove", text: a[i - 1] });
      i--;
    } else {
      ops.unshift({ type: "add", text: b[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    i--;
    ops.unshift({ type: "remove", text: a[i] });
  }
  while (j > 0) {
    j--;
    ops.unshift({ type: "add", text: b[j] });
  }

  const removeSegments: DiffSegment[] = [];
  const addSegments: DiffSegment[] = [];
  for (const op of ops) {
    if (op.type === "context") {
      pushSegment(removeSegments, op.text, false);
      pushSegment(addSegments, op.text, false);
    } else if (op.type === "remove") {
      pushSegment(removeSegments, op.text, true);
    } else {
      pushSegment(addSegments, op.text, true);
    }
  }
  return { removeSegments, addSegments };
}

function pairLines(lines: DiffLine[]): DiffLine[] {
  const result = [...lines];
  let i = 0;
  while (i < result.length) {
    if (result[i].type === "context") {
      i++;
      continue;
    }
    const runStart = i;
    while (i < result.length && result[i].type !== "context") i++;
    const runEnd = i;

    const removeIndexes: number[] = [];
    const addIndexes: number[] = [];
    for (let k = runStart; k < runEnd; k++) {
      if (result[k].type === "remove") {
        removeIndexes.push(k);
      } else {
        addIndexes.push(k);
      }
    }

    const pairCount = Math.min(removeIndexes.length, addIndexes.length);
    for (let p = 0; p < pairCount; p++) {
      const removeIdx = removeIndexes[p];
      const addIdx = addIndexes[p];
      const { removeSegments, addSegments } = diffTokens(
        result[removeIdx].text,
        result[addIdx].text,
      );
      result[removeIdx] = { ...result[removeIdx], segments: removeSegments };
      result[addIdx] = { ...result[addIdx], segments: addSegments };
    }
  }
  return result;
}

function diffLines(oldText: string, newText: string): DiffLine[] {
  const a = oldText.length === 0 ? [] : oldText.split("\n");
  const b = newText.length === 0 ? [] : newText.split("\n");
  const m = a.length;
  const n = b.length;

  const lcs: number[][] = Array.from(
    { length: m + 1 },
    () => new Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift({ type: "context", text: a[i - 1] });
      i--;
      j--;
    } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
      result.unshift({ type: "remove", text: a[i - 1] });
      i--;
    } else {
      result.unshift({ type: "add", text: b[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    i--;
    result.unshift({ type: "remove", text: a[i] });
  }
  while (j > 0) {
    j--;
    result.unshift({ type: "add", text: b[j] });
  }
  return result;
}

export async function getCommitDiff(
  fs: FileSystemAccessFs,
  dir: string,
  oid: string,
): Promise<FileDiff[]> {
  const { commit } = await git.readCommit({ fs, dir, oid });
  const parentOid: string | undefined = commit.parent[0];
  const changedPaths = await getChangedPaths(fs, dir, oid, parentOid);

  const result: FileDiff[] = [];

  for (const cp of changedPaths) {
    const fileDiff: FileDiff = { path: cp.path, change: cp.change };

    let oldBytes: Uint8Array | null = null;
    let newBytes: Uint8Array | null = null;

    try {
      if (cp.change !== "add" && parentOid) {
        const { blob } = await git.readBlob({
          fs,
          dir,
          oid: parentOid,
          filepath: cp.path,
        });
        oldBytes = blob;
      }
      if (cp.change !== "delete") {
        const { blob } = await git.readBlob({
          fs,
          dir,
          oid,
          filepath: cp.path,
        });
        newBytes = blob;
      }
    } catch {
      result.push(fileDiff);
      continue;
    }

    if (
      (oldBytes && isBinary(oldBytes))
      || (newBytes && isBinary(newBytes))
    ) {
      fileDiff.binary = true;
      result.push(fileDiff);
      continue;
    }

    const oldSize = oldBytes ? oldBytes.length : 0;
    const newSize = newBytes ? newBytes.length : 0;
    if (oldSize > MAX_DIFF_BYTES || newSize > MAX_DIFF_BYTES) {
      fileDiff.tooLarge = true;
      result.push(fileDiff);
      continue;
    }

    const oldText = oldBytes ? decode(oldBytes) : "";
    const newText = newBytes ? decode(newBytes) : "";
    fileDiff.lines = pairLines(diffLines(oldText, newText));
    result.push(fileDiff);
  }

  return result;
}
