# Plan: Auto-commit on save

## Goal

NENO creates a local git commit in the user's notes directory every time a
user-initiated write completes (note save, delete, rename, file upload).
Local commits only; no remotes, no branches, no history UI.

## Decisions (confirmed)

- **Git implementation:** `isomorphic-git` (pure JS, runs in worker).
- **Repo location:** inside the user's selected notes directory. If a
  `.git/` folder is already present, adopt as-is.
- **Author identity:** two new settings in SettingsView with defaults
  `NENO` and `noreply@neno.local`.
- **Commit cadence:** one commit per `flushChanges()` call. This covers
  note saves, deletes, renames, and file uploads — every user-initiated
  write produces a commit.
- **Commit message:** auto-generated from the flush's changed entities.
- **Scope:** local commits only, always on, no branches / merge / diff UI.
- **Default `.gitignore`:** written on init with `.DS_Store` as the only
  entry.
- **Settings changes:** next commit uses the new identity; existing git
  config is not rewritten.
- **Branch name:** hardcoded to `main` for v1.

## Architecture

### Dependency

Add `isomorphic-git` to `package.json`. No CORS proxy needed.

isomorphic-git expects a node-style `fs`. We build a small adapter on
top of the existing `FileSystemDirectoryHandle` held by the notes
worker so the `.git/` folder lives in the user's real directory (not
IndexedDB / lightning-fs).

### Settings (main thread, localStorage)

- `src/components/SettingsView.tsx:11` — add `<GitConfigSetting />`
  alongside `<ChangeLanguageSetting />`.
- New component `src/components/GitConfigSetting.tsx` with two text
  inputs bound to localStorage keys `git.user.name` / `git.user.email`.
- Defaults: `"NENO"` / `"noreply@neno.local"`.
- Read on mount; write-through on blur.
- Strings added to `src/intl/en-US.json` and `src/intl/de-DE.json`.

### FS adapter for isomorphic-git

New file `src/lib/notes-worker/FileSystemAccessFs.ts`.

**Relationship to `FileSystemAccessAPIStorageProvider`** — the two
adapters live side by side and do different jobs. The storage provider
is **not** replaced.

- **Working tree** (`.subtext` notes, attachments, aliases): written
  by `FileSystemAccessAPIStorageProvider`, exactly as today. That
  write path is untouched.
- **`.git/` folder** (objects, refs, index, HEAD): written by
  isomorphic-git via the new FS adapter.

isomorphic-git never writes to the working tree — it only *reads* it
when staging (to hash file contents into blobs) and then writes the
resulting objects into `.git/`. Note saves still go through the
existing provider; git just observes afterwards.

Why a separate adapter: isomorphic-git's public API expects a
node-`fs`-compatible object (`readFile`, `writeFile`, `unlink`,
`readdir`, …). The storage provider has a different, higher-level
shape (`writeObject`, `readObjectAsString`, `getReadableStream`, …)
used by `DatabaseIO`. Changing it to match node-fs would force an
intrusive refactor across the Notes module for no benefit. The FS
adapter is a small translation layer: node-fs calls in → FSA API
calls on the same `FileSystemDirectoryHandle` the storage provider
already holds. Both point at the same root directory, so when
isomorphic-git reads `/notes/my-note.subtext` it sees the bytes the
provider just wrote.

Implementation:

- Implements the subset of node `fs` that isomorphic-git uses:
  `readFile`, `writeFile`, `unlink`, `readdir`, `mkdir`, `rmdir`,
  `stat`, `lstat`.
- No-op / throw for `symlink`, `readlink`, `chmod` (FSA API has no
  symlinks).
- Maps POSIX paths (`/.git/HEAD`) to nested `getDirectoryHandle` /
  `getFileHandle` calls against the root handle held by the worker.
- Expose a `promises` namespace — isomorphic-git uses the promise
  API exclusively if present.
- `stat` / `lstat` return an object with `type` (`"file"` / `"dir"`
  / `"symlink"`), `mode` (`0o100644` for files, `0o040755` for
  dirs), `size`, `ino` (synthesized from path hash), `mtimeMs`,
  `ctimeMs` (= `mtimeMs`), `uid: 1`, `gid: 1`, `dev: 1`, plus
  `isFile()`, `isDirectory()`, `isSymbolicLink()` methods. Matches
  the `lightning-fs` reference implementation.
- `readdir` returns `string[]` (not `Dirent[]`).

### Repo init / detection

New file `src/lib/notes-worker/git.ts` exporting `ensureRepo(fs, dir)`
and `commitAll(fs, dir, summary, author)`.

Hook point: `src/lib/notes-worker/index.ts:84-85`, inside the
`"initialize"` action handler. After `FileSystemAccessAPIStorageProvider`
is created:

- Probe for `.git/HEAD` via the FS adapter.
- If missing → `git.init({ defaultBranch: "main" })`, write default
  `.gitignore` (`.DS_Store\n`), make an initial empty commit.
- If present → adopt as-is. No validation beyond "HEAD exists".

Failures surface as thrown errors up the RPC boundary so the UI can
show a toast. No `console.*` (per NENO lint rules).

### Commit trigger

`src/lib/notes/DatabaseIO.ts:411-527` — `flushChanges()` is the single
chokepoint for every note / file / alias / delete / rename write path.
It already receives exactly what changed via its existing parameters:

```ts
flushChanges(
  graph: Graph,
  flushPins: boolean,
  canonicalNoteSlugsToFlush: Set<Slug> | "all",
  aliasesToFlush:            Set<Slug> | "all",
  arbitraryFilesToFlush:     Set<Slug> | "all",
): Promise<void>
```

After the final write (~line 527), invoke a post-flush callback and
pass these three sets (plus `flushPins`) through unchanged. No new
`ChangeSummary` type needed.

Wiring:

1. `NotesProvider` gains an optional post-flush callback, set during
   worker init.
2. `flushChanges()` calls the callback with the three sets.
3. In `src/lib/notes-worker/index.ts`, the worker wires the callback
   to `commitChanged(fs, "/", changes, author)`.
4. Author values are cached in the worker. Main thread sends them via
   a new `"setGitAuthor"` RPC action — once on init and again whenever
   settings change.

### Staging strategy (performance)

Do **not** call `git.statusMatrix()` on every save — it hashes the
entire working tree and would be O(N) in total notes for each save.

Instead, stage only the paths we just wrote:

- For each slug in the three sets, compute its on-disk path
  (`DatabaseIO.getSubtextGraphFilenameForSlug`, same helper
  `flushChanges` uses).
- Check whether the path still exists on disk (deletion vs
  create/update). If it exists → `git.add({ filepath })`. If it
  doesn't → `git.remove({ filepath })`.
- When a set is `"all"` (rare — whole-graph rewrites like import),
  fall back to `git.statusMatrix()` once for that flush.
- After staging, `git.commit({ author, message })`.

Cost per save is proportional to the number of changed files, not
total repo size.

### Commit message template

Derived from the three flush sets (and post-staging, from what was
actually staged as add vs remove):

- 1 note updated → `update: <slug>`
- 1 note created → `create: <slug>`
- 1 note deleted → `delete: <slug>`
- 1 file added → `add file: <filename>`
- 1 rename → `rename: <old> -> <new>`
- Mixed / multiple → `update: <N> notes, <M> files` with a body
  listing each entry.

### Edge cases

- **Empty flush** (no staged diff): skip the commit.
- **Commit fails** (permission revoked, adapter bug): surface via RPC
  error → toast. The write already succeeded; the note is saved.
  Do not roll back.
- **Large binary files** (attachments): isomorphic-git handles them,
  just slower. Acceptable for v1.
- **Existing repo with dirty working tree**: the first NENO commit
  sweeps them in. Document this behavior.
- **Init race**: author settings must reach the worker before any
  save. Forward them alongside `folderHandle` in the existing
  `"initialize"` action.

## Files touched

- `package.json` — add `isomorphic-git`.
- `src/components/SettingsView.tsx` — add setting.
- `src/components/GitConfigSetting.tsx` — **new**.
- `src/lib/notes-worker/FileSystemAccessFs.ts` — **new** (FSA →
  node-fs adapter).
- `src/lib/notes-worker/git.ts` — **new** (init + commit helpers).
- `src/lib/notes-worker/index.ts` — wire init, `setGitAuthor`
  action, post-flush callback.
- `src/lib/notes-worker/NotesProviderProxy.ts` — add `setGitAuthor`
  RPC and pass author on init.
- `src/lib/notes/DatabaseIO.ts` — invoke post-flush callback with
  the three existing flush sets plus `flushPins`.
- `src/lib/notes/index.ts` — thread the callback through
  `NotesProvider`.
- `src/lib/LocalDataStorage.ts` — read git author from localStorage,
  forward to worker init, fire `setGitAuthor` on settings changes.
- `src/intl/en-US.json`, `src/intl/de-DE.json` — strings for settings.

## Hook points (verified file:line refs)

For the next session — concrete locations to edit or hook into, so no
re-exploration is needed:

### Save path (trigger for commits)

- `src/components/NoteView.tsx:135-144` — `handleNoteSaveRequest()`
  calls `saveActiveNoteAndRefreshViews()`, which invokes
  `notesProvider.put(noteSaveRequest)` via the worker proxy.
- `src/components/NoteView.tsx:169-174` — `useKeyboardShortcuts`
  binds Ctrl+S to `handleNoteSaveRequest()`.

### Write chokepoint

- `src/lib/notes/DatabaseIO.ts:411-527` — `flushChanges()`. Single
  entry point for every write. Signature and behavior documented in
  the "Commit trigger" section above. Add the post-flush callback
  invocation at ~line 527, after all writes complete.
- Other write methods in `src/lib/notes/DatabaseIO.ts`:
  - `addFile()` at line 533 (file uploads)
  - `moveArbitraryGraphFile()` at line 550 (renames)
  - `deleteArbitraryGraphFile()` (deletes)
  All are called from `NotesProvider` methods that also call
  `flushChanges()` — so hooking `flushChanges` alone covers them.
- `NotesProvider` write methods in `src/lib/notes/index.ts`:
  `put()` (~line 199), `remove()` (line 224), `addFile()` (line 265),
  `renameFileSlug()` (line 346), `deleteFile()` (line 435). All
  route through `flushChanges()`.

### Worker init (where to init / adopt the git repo)

- `src/lib/notes-worker/index.ts:84-85` — inside the `"initialize"`
  action handler, right after `FileSystemAccessAPIStorageProvider` is
  constructed. Call `ensureRepo(fs, "/")` here.
- `src/lib/notes-worker/index.ts:29-54` — RPC dispatch pattern
  (`handleRPCCall`). Add a `"setGitAuthor"` action alongside the
  existing ones.
- `src/lib/notes-worker/index.ts:65-114` — top-level `onmessage`
  handlers for `"initialize"` and `"addPort"`. Extend `"initialize"`
  payload with `gitAuthor` fields.

### Main thread → worker wiring

- `src/lib/LocalDataStorage.ts:115-137` — `initializeNotesProvider()`.
  Read git author from localStorage here and forward into the worker's
  `"initialize"` message.
- `src/lib/LocalDataStorage.ts:84-112` — `createNotesWorkerAndProxy()`.
  This is where the `"initialize"` message is posted to the worker.
- `src/lib/notes-worker/NotesProviderProxy.ts:71-89` — RPC `#call()`
  implementation. Add a `setGitAuthor` method alongside the other RPC
  forwarders at lines 120-161.

### Settings UI

- `src/components/SettingsView.tsx:11` — add `<GitConfigSetting />`
  alongside `<ChangeLanguageSetting />`.
- `src/lib/intl.tsx` lines ~20, ~30, ~107 — reference for the
  localStorage-direct settings pattern (no settings context exists).
- `src/intl/en-US.json`, `src/intl/de-DE.json` — flat JSON keyed by
  dotted strings. Add `git-config.user-name.label` etc.

### Storage provider (no changes, just reference)

- `src/lib/FileSystemAccessAPIStorageProvider.tsx:12-14` — constructor
  takes a `FileSystemDirectoryHandle`. The notes worker already holds
  this handle; pass the same handle to the git FS adapter at init.
- `src/lib/FileSystemAccessAPIStorageProvider.tsx:152-253` — public
  methods (`writeObject`, `writeObjectFromReadable`, `renameObject`,
  `readObjectAsString`, `getReadableStream`, `removeObject`). The git
  adapter does **not** wrap these — it talks to the
  `FileSystemDirectoryHandle` directly.

### Existing test primitives to reuse

- `src/lib/notes/test/MockStorageProvider.ts` — in-memory
  `StorageProvider` with a journal. Use for the post-flush callback
  test.
- `src/lib/notes/index.spec.ts:1-80` — reference for the pattern
  (global worker/encoder stubs, `describe`/`it` shape).

## Tests

Alignment with the existing suite: the project mocks at the
`StorageProvider` abstraction (`src/lib/notes/test/MockStorageProvider.ts`)
and has never faked `FileSystemDirectoryHandle` directly — that layer
is covered only by Playwright integration tests.

The git FS adapter sits *below* `StorageProvider` (it speaks node-fs
on top of a raw `FileSystemDirectoryHandle`), so `MockStorageProvider`
cannot stand in for it. This introduces one net-new testing primitive:
a minimal `FileSystemDirectoryHandle` fake, co-located with existing
test utilities and following the same pattern as `MockStorageProvider`
(in-memory `Map<string, Uint8Array>`, optional journal).

- `src/lib/notes-worker/test/FakeDirectoryHandle.ts` — **new** fake
  implementing the subset of `FileSystemDirectoryHandle` /
  `FileSystemFileHandle` / `FileSystemWritableFileStream` used by
  the FS adapter (`getDirectoryHandle`, `getFileHandle`,
  `removeEntry`, `values()`, `getFile`, `createWritable`,
  `write`, `close`). Deterministic, no browser APIs.
- `src/lib/notes-worker/FileSystemAccessFs.spec.ts` — round-trip fs
  ops (write / read / unlink / readdir / stat / mkdir / rmdir) plus
  path-translation edge cases (leading `/`, nested `.git/` paths),
  all against the fake handle.
- `src/lib/notes-worker/git.spec.ts` — drives isomorphic-git through
  the FS adapter against the fake handle: init from scratch (creates
  `.git/` and `.gitignore`), adopt existing repo (no re-init),
  commit after staging selected paths, read log back to verify
  author + message.
- `src/lib/notes/DatabaseIO.spec.ts` *(extended)* or
  `src/lib/notes/index.spec.ts` *(extended)* — add a test that
  exercises the post-flush callback using the existing
  `MockStorageProvider` + a spy callback. Verifies the three flush
  sets and `flushPins` reach the callback correctly. Fully aligned
  with the existing test pattern — no new primitives.
- Integration (`tests/integration/`) — open a directory, save a
  note, assert `.git/` appears and a new commit exists with the
  expected message. Playwright drives the real browser FSA API,
  matching the existing integration structure.
