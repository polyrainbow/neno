# Turn NENO into an Electron desktop app

## Context

NENO is today a browser-only PWA. Its central promise — "you own your
data, notes are plain `.subtext` files on your device" — is delivered
through the File System Access API, which forces a sandboxed UX: the
user re-picks a folder through a browser picker, grants a permission
prompt on every session, and can never see or type a real path. The
app is also gated to Chromium browsers (`showDirectoryPicker`,
`URLPattern`, the Navigation API, `SharedWorker`) and is distributed as
a static bundle on GitHub Pages plus a tarball release.

This change replaces that PWA with a macOS desktop app built on
Electron. The web build, service worker, manifest and GitHub Pages
deploy go away. Notes are read and written by Node's `fs` in the
Electron main process against a real absolute path, chosen through a
native folder dialog and remembered across launches with no permission
prompt. The release artifact becomes an unsigned `.dmg`.

Decisions already made: replace (not augment) the PWA · native Node fs
storage provider · electron-builder · macOS only · single window with a
dedicated Worker instead of a SharedWorker · keep the OPFS "try it out"
mode · no auto-update · unsigned build.

## Architecture

Two facts drive the whole design:

1. **The renderer must not be loaded from `file://`.** The router
   (`src/lib/router.ts`, `src/lib/navigation.ts`) is built on the
   Navigation API + `URLPattern` and matches on `location.pathname`;
   `src/components/FileView.tsx:115,162,191` even does full
   `location.href = …` navigations. Under `file://`, `pathname` is a
   disk path, every route misses, and `AppRouter.tsx:159` renders
   "Undefined route". OPFS, `localStorage`, IndexedDB and module
   workers are also unavailable or unreliable there.
   → Serve the built `dist/` over a **custom `neno://` scheme**
   registered as `standard` + `secure`, with an SPA fallback to
   `index.html`. Nothing in the router, `config.tsx`, `constants.ts` or
   `index.html` then has to change, and `base` stays `"/"`.

2. **The notes worker has no Node access.** It runs in the renderer,
   so a Node-fs `StorageProvider` has to live in the main process and
   be reached over RPC. Fortunately `StorageProvider`
   (`src/lib/notes/types/StorageProvider.ts`) is a clean 9-method
   contract of `string` / `number` / `ReadableStream`, already proven
   swappable by `src/lib/notes/test/MockStorageProvider.ts`. The
   isomorphic-git shim (`src/lib/notes-worker/FileSystemAccessFs.ts`)
   is a similar 11-method surface that maps 1:1 onto
   `node:fs/promises`.
   → Main process owns the real implementations; the worker holds thin
   proxies that speak the **same request/response id protocol already
   used by `src/lib/notes-worker/NotesProviderProxy.ts`** over a
   `MessageChannelMain` port.

```
 main process                  renderer                 notes worker
 ┌───────────────────┐      ┌─────────────┐        ┌──────────────────┐
 │ NodeFsStorage     │◀════════ MessagePortMain ═══▶│ StorageProxy     │
 │ NodeFsGit         │      │ (forwards   │        │ GitFsProxy       │
 │ dialogs, fs       │      │  the port)  │        │ NotesProvider    │
 └───────────────────┘      └─────────────┘        └──────────────────┘
        ▲  contextBridge (window.neno)   │  Worker RPC (unchanged)
        └────────────────────────────────┘
```

Because the OPFS mode stays, `FileSystemAccessAPIStorageProvider.tsx`
and `FileSystemAccessFs.ts` remain in the tree with their existing
tests; the worker picks a provider pair based on its init options.

## Phase A — Electron shell

New `electron/` directory, compiled separately from the renderer.

* `electron/main.ts`
  * `protocol.registerSchemesAsPrivileged([{ scheme: "neno",
    privileges: { standard: true, secure: true, supportFetchAPI: true,
    stream: true, corsEnabled: true } }])` **before** `app.whenReady`.
  * `protocol.handle("neno", …)` serving `dist/`: resolve the pathname
    against the bundle root, reject traversal, fall back to
    `index.html` for any path without a file extension. Set MIME types
    explicitly, including `application/wasm` (the dev-only
    `wasmContentTypePlugin` in `vite.config.ts:7` shows a `.wasm`
    asset is fetched at runtime).
  * `BrowserWindow` with `contextIsolation: true`,
    `nodeIntegration: false`, `sandbox: true`, and **`plugins: true`**
    — without it the PDF `<iframe>` in
    `src/components/FileViewPreview.tsx:48` silently renders blank.
  * `webContents.setWindowOpenHandler` → `shell.openExternal` for
    `http(s)`, `deny` otherwise. This fixes `window.open` in
    `src/components/Note.tsx:345`, which would otherwise spawn a bare
    chrome-less window. Also deny `will-navigate` to off-origin URLs
    so a stray file drop cannot navigate the window away.
  * CSP via `session.defaultSession.webRequest.onHeadersReceived`:
    `default-src 'self'; script-src 'self' 'unsafe-eval'; style-src
    'self' 'unsafe-inline'; img-src 'self' blob: data:; media-src
    'self' blob:; connect-src 'self'`. `'unsafe-eval'` is
    unavoidable — Monaco's TS worker and the scripting sandbox
    (`src/lib/script-worker/index.ts`) both build functions at runtime.
  * A minimal macOS `Menu`: App (About/Hide/Quit), **Edit with the
    standard roles** — without them Cmd-C/V/Z do not work at all in a
    packaged Electron app — View (reload, toggle devtools), Window.
  * Dev vs prod: load `process.env.NENO_DEV_SERVER_URL` when set,
    otherwise `neno://app/index.html`.
* `electron/preload.ts` — `contextBridge.exposeInMainWorld("neno", …)`
  exposing only: `pickFolder()`, `getLastFolder()`, `setLastFolder()`,
  `pickFilesToOpen()`, `pickFileToSave()`, `connectStorage()`,
  `setUnsavedChanges()`. Nothing else crosses the bridge.
* `electron/tsconfig.json` — `module: NodeNext`, `types: ["node"]`,
  includes `electron/**` plus the shared bridge types.
* `vite.electron.config.ts` — two `build.lib` entries (`main`,
  `preload`), `formats: ["cjs"]`, `target: "node22"`, `external:
  ["electron", …node builtins]`, `outDir: "dist-electron"`.
* `tools/electronDev.mjs` — spawns `vite` and then `electron .` with
  `NENO_DEV_SERVER_URL` set, using only `node:child_process` (no new
  `concurrently` dependency).

Deliverable at the end of Phase A: `npm run electron:dev` opens a
window in which the existing app works end-to-end in **OPFS mode**,
with routing, workers and Monaco intact.

## Phase B — Single window, dedicated Worker

* `src/lib/LocalDataStorage.ts:196` — `new SharedWorker(url, {type:
  "module"})` → `new Worker(url, {type: "module"})`; the import at
  line 8 becomes `?worker&url`. Introduce a local `PortLike` type
  (`postMessage` + `addEventListener`) so the rest of the file is
  unchanged.
* `src/lib/notes-worker/index.ts:357` — drop the `onconnect` entry and
  register the worker global as the single tab port. `attachDispatch`
  must guard `port.start?.()` since `self` has no `start`.
* Delete the multi-tab arbitration that is now dead: `connectedTabCount`
  in `HelloAck`, `resetDenied`, the `otherTabs` check in the `reset`
  action, `setupGoodbye` / the `pagehide` + `goodbye` message, and the
  `OTHER_TABS_OPEN` throw + UI branches in `LocalDataStorage.ts` and
  `src/components/StartViewLocal.tsx`. Remove the
  `start.local.other-tabs-open` key from `src/intl/`.
* `reset` itself stays — it is still how a folder switch works.
* Script-worker wiring (`useScriptExecutor.ts`, `ScriptView.tsx`) uses
  `MessageChannel` + the `addPort` action and needs no change.
* `src/lib/notes-worker/index.spec.ts` and `NotesProviderProxy.spec.ts`
  need updating for the new entry shape; the `MessagePort.start()`
  regression test noted in CLAUDE.md must be preserved.

## Phase C — Node fs storage over the bridge

Shared message types in `src/lib/electron/bridgeTypes.ts`, imported by
both `electron/` and `src/` so the two sides cannot drift.

Main process:
* `electron/storage/NodeFsStorageProvider.ts` —
  `implements StorageProvider` against `node:fs/promises`, rooted at
  an absolute path. Port over from the FS-Access provider:
  * the `#MAX_OPEN_FILES = 512` semaphore
    (`FileSystemAccessAPIStorageProvider.tsx:22-58`) — the comment
    about Fedora's 1024 fd limit applies verbatim to Node;
  * `.normalize("NFC")` on every filename read from disk
    (`:272,:288,:345`) — essential on macOS, whose HFS+/APFS
    directory listings are NFD;
  * `mkdir -p` on write, matching the implicit directory creation of
    `#getSubFolderHandle` (`:64`);
  * `renameObject` becomes a plain `fs.rename` (no cross-folder
    copy fallback needed);
  * `getReadableStream`'s `ByteRange` can now actually be honoured via
    a positioned read — implement it, and drop the "to be implemented"
    comment at `:230`.
* `electron/storage/nodeFsGit.ts` — the 11 methods isomorphic-git
  needs, delegating to `node:fs/promises` with the same path rooting.
  Essentially the identity mapping that
  `src/lib/notes-worker/FileSystemAccessFs.ts` had to fake.
* `electron/storage/bridge.ts` — dispatches RPC on a `MessagePortMain`.
  On `ipcMain.handle("storage:connect", path)` it creates a
  `MessageChannelMain`, keeps `port1`, and posts `port2` back to the
  renderer.

Worker side (`src/lib/electron/`):
* `StorageProviderProxy.ts` / `GitFsProxy.ts` — same
  `{id, method, args}` → `{id, result | error}` shape as
  `NotesProviderProxy.ts:*`; that file is the template to copy.
* **Streams must be chunked.** `ReadableStream` is transferable
  between renderer contexts (used by `getTransferables` in
  `notes-worker/index.ts:74`) but *not* across the main-process
  boundary. So:
  * `getReadableStream` → `openRead` returns a `streamId`; the proxy
    returns `new ReadableStream({ pull })` that requests one chunk per
    pull and gets an `ArrayBuffer` back (transferred, not copied).
  * `writeObjectFromReadable` → `openWrite`, a `writeChunk` per chunk,
    then `closeWrite` returning the byte count.
  This is the single most fiddly part of the whole change.

Wiring:
* `src/lib/notes-worker/index.ts:110` — the one-line injection point.
  `InitOptions` grows a `storagePort?: MessagePort` / `folderPath?:
  string` variant; when present, build the proxies, otherwise keep the
  existing OPFS path with `FileSystemAccessAPIStorageProvider` +
  `FileSystemAccessFs`.
* `src/lib/LocalDataStorage.ts` — `folderHandle:
  FileSystemDirectoryHandle` becomes `folderPath: string` throughout
  (`getExistingFolderHandleName` returns the basename,
  `describesSameSetup` compares paths). Delete `verifyPermission`
  (`:17-40`) and the idb-keyval `FOLDER_HANDLE_STORAGE_KEY` round-trip
  (`:124,:143,:275,:336`) — the path now lives in main's
  `app.getPath("userData")/config.json`, reachable via
  `window.neno.getLastFolder()`. The renderer requests the port with
  `window.neno.connectStorage(path)` and transfers it into the worker
  alongside the `initialize` action.
* `idb-keyval` stays a dependency — `src/components/SearchPresets.tsx`
  still uses it.

## Phase D — Native dialogs

* `src/components/StartViewLocal.tsx:31` — drop the
  `showDirectoryPicker` feature gate and the `start.local.unsupported`
  string; `:107` calls `window.neno.pickFolder()`
  (`dialog.showOpenDialog` with `["openDirectory", "createDirectory"]`)
  and gets back an absolute path or `null` on cancel.
* `src/lib/utils.ts:131` `getFilesFromUserSelection` →
  `dialog.showOpenDialog` with filters derived from the existing
  `FILE_PICKER_ACCEPT_TYPES` (`src/config.tsx:20`); main streams the
  bytes back and the renderer wraps them as `new File([bytes], name)`
  so the two call sites (`Note.tsx:169`, `useActiveNote.tsx:255`) are
  untouched.
* `src/lib/utils.ts:167` `getWritableStream` → `dialog.showSaveDialog`
  plus a `WritableStream` that chunks to main. Callers
  (`LocalDataStorage.ts:412`, `FrontendFunctions.ts:49`) keep
  `pipeTo`-ing into it unchanged.
* `src/hooks/useWarnBeforeUnload.ts` — Electron ignores the
  `returnValue` string and would block the close with no UI. Instead
  push the dirty flag to main (`window.neno.setUnsavedChanges`), and
  intercept `window.on("close")` there with a native
  `dialog.showMessageBox`.
* While here: `URL.createObjectURL` in
  `LocalDataStorage.ts:390` has no matching `revokeObjectURL` anywhere.
  Harmless in a tab, a steady leak in a process that stays open for
  days — revoke in the consuming components' cleanup
  (`NoteContentBlock{Image,Video,Audio,TextFile}.tsx`,
  `FilesViewPreviewBox.tsx`, `FileView.tsx`).

## Phase E — Remove the PWA, package, ship

* `vite.config.ts` — delete the `VitePWA` block (`:24-52`) and the
  import; keep `base: "/"`, `worker.format`, the wasm dev middleware
  and the `APP_VERSION` define. Drop `vite-plugin-pwa` from
  `devDependencies`.
* `package.json` — add `"main": "dist-electron/main.cjs"`, and scripts:
  `electron:dev` (`node tools/electronDev.mjs`), `build:electron`
  (`vite build --config vite.electron.config.ts`), `electron:build`
  (`tsc && vite build && npm run build:electron && electron-builder
  --mac`). Add `electron` (43.x) and `electron-builder` (26.x) as
  devDependencies. Add an `engines.node: ">=24"` field while here.
* `electron-builder.yml` — `appId: io.github.polyrainbow.neno`,
  `productName: NENO`, `files: [dist/**, dist-electron/**]`,
  `mac: { target: dmg, category: public.app-category.productivity }`,
  `directories: { output: release, buildResources: build }`. No
  signing config (`CSC_IDENTITY_AUTO_DISCOVERY=false` in CI).
* Icon: only `public/assets/app-icon/logo.svg` exists. Add
  `tools/buildIcons.sh` rendering it to a 1024×1024 `build/icon.png`
  (`rsvg-convert`, or `sips` from a PDF) — electron-builder derives
  the `.icns` from that.
* `.gitignore` — add `dist-electron/`, `release/`, `build/icon.png`.
* `.github/workflows/release.yml` — switch `runs-on` to `macos-15`,
  replace the `tools/buildReleasePackage.sh` step with
  `npm ci && npm run electron:build`, and point `ncipollo/release-action`
  at `release/*.dmg`. Keep `artifactErrorsFailBuild: true`.
* Delete `tools/buildReleasePackage.sh` and
  `tools/deployToGitHubPages.sh`.
* Docs: `README.md` ("go to the app" → download the `.dmg`, plus the
  right-click→Open note for the unsigned build);
  `public/docs/index.html` "Getting started" / "Optional installation"
  sections (~L169-200) and the Flatpak caveat (~L954);
  `CONTRIBUTING.md` "Publishing a release" and "Deploying NENO on your
  own server"; `CLAUDE.md` architecture section (it already describes a
  "dedicated worker", which only becomes true in Phase B — update it
  with the Electron main/preload split and the storage bridge).
  `NOTICE.md` fonts must ship inside the app bundle — they do, as part
  of `dist/`.

## Tests

* Keep the Playwright suite as-is. It drives `npm run dev` at
  `localhost:5173` in OPFS mode, and that path survives untouched —
  this is the main reason keeping OPFS mode was worth it.
* New unit specs, alongside the code as the repo does:
  * `electron/storage/NodeFsStorageProvider.spec.ts` — against a
    `fs.mkdtemp` directory, asserting the same behaviours
    `src/lib/notes/index.spec.ts` relies on from `MockStorageProvider`
    (recursive `getAllObjectNames`, sizes, rename, NFC round-trip of a
    filename containing "ü").
  * `src/lib/electron/StorageProviderProxy.spec.ts` — a real
    `MessageChannel` with a handler on the far end, covering the
    chunked read/write stream paths. Model it on
    `NotesProviderProxy.spec.ts`.
* `npm run unit-test` is `vitest run --dir src`; extend it to cover
  `electron/` too (`vitest run --dir src --dir electron`, or a
  `vitest.config.ts` with both roots).

## Verification

1. `npm run electron:dev` — window opens, no console errors. Confirm
   the `neno://` origin actually gets storage: DevTools → Application
   shows `localStorage` and IndexedDB, and the OPFS "try it out" flow
   creates notes. *If a custom standard scheme turns out not to get a
   storage partition, the fallback is to serve `dist/` from an
   `http://127.0.0.1:<random>` loopback server bound to localhost
   only — same origin semantics, no other code changes.*
2. Pick a real folder via the native dialog; create, rename, link and
   delete notes; attach an image, a PDF and an audio file. Verify with
   `ls`/`cat` that plain `.subtext` files land at the chosen absolute
   path. Quit and relaunch — it must reopen that folder with no
   prompt.
3. Switch folders from the start view; confirm the worker resets and
   the new graph loads.
4. Enable git in settings, make a few edits, open the history view,
   inspect a commit diff. Then `git log` in a terminal against the same
   folder to confirm isomorphic-git wrote a real repository through
   the Node fs bridge.
5. Exercise the remaining bridged paths: export a note (save dialog),
   import a note (open dialog), run a script in the scripting view
   (script worker → `addPort` → notes worker), open an external link
   from a note (must go to the system browser, not a new window),
   drag a file onto a note, close the window with unsaved changes.
6. `npm run all-checks` — lint, stylelint, unit + intl tests,
   Playwright integration tests, build.
7. `npm run electron:build` — produces `release/NENO-<version>.dmg`.
   Mount it, drag to Applications, launch via right-click → Open, and
   repeat step 2 against the packaged app (this is where a missing
   `plugins: true` or a too-strict CSP will show up).
8. Tag a test release on a branch to confirm the reworked
   `release.yml` attaches the `.dmg`.

## Notable risks

* **Storage on a custom scheme** — the one assumption worth validating
  first (step 1 above); the loopback-server fallback is cheap.
* **Chunked streams across the IPC boundary** — the only genuinely new
  protocol code, and where large file attachments will break if the
  backpressure handling is wrong.
* **Unsigned `.dmg`** — Gatekeeper will show "damaged or can't be
  opened" for downloaded builds until the quarantine attribute is
  cleared; the README must say so plainly.
