/*
  Line diff with word-level emphasis for the history view. Pure: it
  takes the two versions of a file and knows nothing about git.
*/

import { DiffLine, DiffSegment } from "./types";

export const MAX_DIFF_BYTES = 200_000;

export function isBinary(bytes: Uint8Array): boolean {
  const limit = Math.min(bytes.length, 8000);
  for (let i = 0; i < limit; i++) {
    if (bytes[i] === 0) return true;
  }
  return false;
}

export function decode(bytes: Uint8Array): string {
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

export function computeDiffLines(
  oldText: string,
  newText: string,
): DiffLine[] {
  return pairLines(diffLines(oldText, newText));
}
