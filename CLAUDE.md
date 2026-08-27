# NENO

Privacy-first note-taking app built on the Subtext markup language.
NENO is a macOS desktop app built on Electron. Users own their data —
notes are stored as plain-text `.subtext` files in a folder the user
picks through a native dialog, read and written by Node's `fs` in the
Electron main process.

## Commands

```sh
npm run dev              # Vite dev server on localhost:5173 (renderer only)
npm run electron:dev     # Vite dev server + Electron window
npm run build            # TypeScript check (src + electron) + Vite build
npm run build:electron   # Build the main/preload bundles to dist-electron/
npm run electron:build   # Full build + electron-builder --mac (unsigned .dmg)
npm run lint             # ESLint (src/, electron/, tests/)
npm run lint-fix         # ESLint with --fix
npm run stylelint        # CSS linting
npm run test             # Unit tests (Vitest) + i18n tests
npm run unit-test        # Vitest only (src/ and electron/)
npm run integration-test # Playwright integration tests (needs browsers)
npm run all-checks       # stylelint + lint + test + integration-test + build
```

## Code Style

- **Indentation:** 2 spaces
- **Quotes:** double quotes
- **Semicolons:** always
- **Max line length:** 80 characters
- **Naming:** camelCase (PascalCase for React components/types)
- **Linebreaks:** Unix (LF)
- **Trailing commas:** always in multiline
- **Equality:** strict (`===`), no `== null`
- **Variables:** `const`/`let` only, no `var`, prefer `const`
- **Console:** no `console.*` statements
- **Unused vars:** prefix with `_` (e.g. `_unused`)
- **TypeScript:** strict mode, no unused locals/parameters, no implicit any
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (`feat:`, `fix:`, `chore:`, `refactor:`, etc.)

## Architecture

```
electron/                     # Electron main process (compiled separately)
  main.ts                     #   Window, neno:// protocol, CSP, menu
  preload.ts                  #   contextBridge surface (window.neno)
  config.ts                   #   userData/config.json (last folder)
  dialogs.ts                  #   Native folder/open/save dialogs
  unsavedChanges.ts           #   Native confirm on window close
  storage/
    NodeFsStorageProvider.ts  #   StorageProvider on node:fs/promises
    nodeFsGit.ts              #   isomorphic-git fs on node:fs/promises
    bridge.ts                 #   RPC dispatch on a MessagePortMain

src/
  main.tsx                    # App entry point
  components/                 # React components
  hooks/                      # Custom hooks (primary state management)
  contexts/                   # Context providers: Confirmation, Notes,
                              #   UnsavedChanges
  lib/
    editor/                   # Lexical-based rich text editor
      nodes/                  #   Custom Lexical node types
      plugins/                #   Custom Lexical plugins
    notes/                    # Core module: CRUD, graph, indexing, search
      types/                  #   Note, graph, and relationship types
    subwaytext/               # Subtext parser & serializer
    notes-worker/             # Dedicated worker hosting NotesProvider
    script-worker/            # Sandboxed worker for user script execution
    electron/                 # Renderer/worker side of the storage bridge
    FileSystemAccessAPIStorageProvider.tsx
                              # File System Access API integration (OPFS mode)
  types/                      # Shared TypeScript types
  intl/                       # Internationalization
```

### Key modules

- **Notes** (`src/lib/notes/`) — Heart of the app. Manages note CRUD,
  graph relationships, indexes, and search. Depends on the Subwaytext
  parser and on whichever StorageProvider the worker was initialized
  with.
- **Subwaytext** (`src/lib/subwaytext/`) — Parses Subtext markup strings
  into block arrays and serializes them back. See the
  [Subtext Graph Specification](https://polyrainbow.github.io/neno/docs/subtext-graph-specification.html).
- **Editor** (`src/lib/editor/`) — Built on [Lexical](https://lexical.dev).
  Custom nodes and plugins extend the editor for Subtext content.
- **StorageProvider** — a 9-method contract
  (`src/lib/notes/types/StorageProvider.ts`) with two implementations.
  `electron/storage/NodeFsStorageProvider.ts` (Node `fs`, the real graph
  folder) is the one users see; `src/lib/FileSystemAccessAPIStorageProvider.tsx`
  wraps a `FileSystemDirectoryHandle` and backs the OPFS "try it out"
  mode, which is also what the Playwright suite drives.

### Worker architecture

All note data lives in a single dedicated **notes worker** thread.
The main thread and script workers never instantiate `NotesProvider`
directly — they use `NotesProviderProxy`, which forwards every method
call as an RPC message and returns a Promise for the result.

```
Main Thread (UI)              Notes Worker              Script Worker
┌──────────────┐            ┌──────────────┐          ┌──────────────┐
│ Proxy (RPC)  │──postMsg──▶│ NotesProvider │◀──port──│ Proxy (RPC)  │
│              │◀──postMsg──│ (single)      │──port──▶│ Script eval  │
└──────────────┘            └──────────────┘          └──────────────┘
```

**Why:** A single `NotesProvider` instance means a single in-memory
graph cache. Before this design, each thread had its own instance and
its own cache, so changes made in one thread were invisible to the
others until a full disk re-read.

There is exactly one NENO window, so the notes worker is a plain
dedicated `Worker` and the worker global itself is the window's port.
There is no cross-tab arbitration; the `reset` action remains, because
that is how a folder switch works.

**How it connects:**

1. `LocalDataStorage.initializeNotesProvider()` spawns the notes
   worker and creates a `NotesProviderProxy` that the React app uses
   via `NotesProviderContext`.
2. When a script worker is needed (`useScriptExecutor`, `ScriptView`),
   the main thread creates a `MessageChannel`, sends one port to the
   notes worker (`addPort` action) and the other to the script worker
   (`initialize` action). The script worker wraps its port in another
   `NotesProviderProxy`.
3. `ReadableStream` arguments and return values are automatically
   transferred (not cloned) across the boundary.

**Key files:**

| File | Role |
|---|---|
| `src/lib/notes-worker/index.ts` | Worker that owns `NotesProvider`; handles RPC + `MessagePort` clients |
| `src/lib/notes-worker/NotesProviderProxy.ts` | Proxy with the same public API as `NotesProvider`; sends RPC over `Worker` or `MessagePort` |
| `src/lib/script-worker/index.ts` | Sandboxed script execution worker; receives a `MessagePort` to the notes worker |
| `src/lib/LocalDataStorage.ts` | Creates the notes worker, exposes `getNotesWorkerPort()` for `MessageChannel` setup |
| `src/lib/electron/bridgeTypes.ts` | Message types shared by `electron/` and `src/` so the bridge cannot drift |
| `src/lib/electron/BridgeClient.ts` | Request/response id bookkeeping for the storage bridge |
| `src/lib/electron/StorageProviderProxy.ts` | `StorageProvider` over the bridge, with chunked streams |
| `src/lib/electron/GitFsProxy.ts` | isomorphic-git fs over the bridge |

**Gotcha — `MessagePort.start()`:** When listening on a `MessagePort`
with `addEventListener` (as opposed to setting `onmessage`), the port
must be explicitly started with `port.start()`. The proxy handles this
automatically. There is a regression test in
`NotesProviderProxy.spec.ts`.

## Electron architecture

### Why the renderer is not loaded from `file://`

The router (`src/lib/router.ts`, `src/lib/navigation.ts`) is built on the
Navigation API + `URLPattern` and matches on `location.pathname`, and
`FileView.tsx` does full `location.href = …` navigations. Under
`file://`, `pathname` is a disk path, every route misses and
`AppRouter.tsx` renders "Undefined route"; OPFS, `localStorage`,
IndexedDB and module workers are also unavailable or unreliable there.

So `dist/` is served over a custom **`neno://` scheme** registered as
`standard` + `secure`, with an SPA fallback to `index.html`. That origin
gets a real storage partition and a secure context, so nothing in the
router, `config.tsx`, `constants.ts` or `index.html` had to change and
`base` stays `"/"`. The window loads `neno://app/` — **not**
`neno://app/index.html`, which is not a route.

### The storage bridge

The notes worker runs in the renderer and has no Node access, so the
Node-`fs` implementations live in the main process and are reached over
RPC:

```
 main process                  renderer                 notes worker
 ┌───────────────────┐      ┌─────────────┐        ┌──────────────────┐
 │ NodeFsStorage     │◀═══════ MessagePortMain ══════▶│ StorageProxy   │
 │ NodeFsGit         │      │ (forwards   │        │ GitFsProxy       │
 │ dialogs, fs       │      │  the port)  │        │ NotesProvider    │
 └───────────────────┘      └─────────────┘        └──────────────────┘
        ▲  contextBridge (window.neno)   │  Worker RPC (unchanged)
        └────────────────────────────────┘
```

`ipcMain.handle("storage:connect", path)` creates a `MessageChannelMain`,
keeps `port1` and posts `port2` to the renderer; the preload forwards it
to the page with a transferring `window.postMessage` (a `MessagePort`
cannot cross `contextBridge`), and the renderer transfers it into the
notes worker alongside the `initialize` action.

The wire format is the `{id, method, args}` → `{id, result | error}`
protocol `NotesProviderProxy` already used, with method names namespaced
`storage.…` / `git.…` so one port carries both. Both proxies share a
single `BridgeClient`, because they share the request id sequence.

**Streams are chunked.** A `ReadableStream` is transferable between
renderer contexts but not across the main-process boundary, so
`getReadableStream` becomes `openRead` + one `readChunk` per `pull`, and
`writeObjectFromReadable` becomes `openWrite` + `writeChunk` per chunk +
`closeWrite` returning the byte count. Chunks are copied before they go
on the wire; there is no transfer list, since a `MessagePortMain` can
only transfer `MessagePort`s and everything crossing the process
boundary is serialized regardless.

Errors carry an `errorCode` field alongside the message, because
isomorphic-git branches on `err.code === "ENOENT"`.

### Non-obvious main-process requirements

- `plugins: true` in `webPreferences` — without it Chromium's PDF viewer
  is disabled and the PDF `<iframe>` in `FileViewPreview.tsx` renders
  blank.
- The standard **Edit** menu roles — without them Cmd-C/V/Z do not work
  at all in a packaged Electron app.
- `'unsafe-eval'` in the CSP — Monaco's TypeScript worker and the
  scripting sandbox both build functions at runtime.
- `blob:` in `img-src`, `media-src`, `frame-src` and `connect-src` —
  object URLs back media elements and the PDF iframe, and
  `NoteContentBlockTextFile` fetches its own blob URL back.
- `setWindowOpenHandler` → `shell.openExternal` — `window.open` in
  `Note.tsx` would otherwise spawn a bare chrome-less window.
- The Dock icon and the menu-bar title come from the running bundle, and
  in development that bundle is Electron's own. `applyDevDockIcon()`
  sets the icon at runtime from `build/icon.png`; the menu title comes
  from `CFBundleName`, which no API can override, so
  `tools/electronDev.mjs` rewrites it in `node_modules`. A packaged app
  needs neither — electron-builder's `productName` and the derived
  `.icns` cover both.

### Storage-provider details that only bite on a real file system

- `.normalize("NFC")` on every name read from disk: macOS returns
  HFS+/APFS directory listings in NFD.
- The `#MAX_OPEN_FILES = 512` semaphore, ported verbatim from the
  FS-Access provider — the OS fd limit applies to Node just the same.

## Tests

Unit tests live next to source files as `*.spec.ts` / `*.spec.tsx`, in
both `src/` and `electron/` (see `vitest.config.ts`).
Run a single test file: `npx vitest run src/lib/notes/noteUtils.spec.ts`

Integration tests are in `tests/integration/`. Visual regression tests
are in `tests/visual-regression/`. Both drive `npm run dev` in a real
browser at `localhost:5173` in **OPFS mode** — which is the main reason
OPFS mode was worth keeping.

## Requirements

- Node.js v24+
- macOS (the packaged app is macOS-only and unsigned)
