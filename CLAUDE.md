# NENO

Privacy-first note-taking app built on the Subtext markup language.
NENO is a macOS desktop app built on Electron, and an Android app built
on Capacitor around the same web code. Users own their data — notes are
stored as plain-text `.subtext` files: on the desktop in a folder the
user picks through a native dialog, read and written by Node's `fs` in
the Electron main process; on Android in the app's private storage,
read and written by Kotlin (see "Android architecture").

## Commands

```sh
npm run dev              # Vite dev server on localhost:5173 (renderer only)
npm run electron:dev     # Vite dev server + Electron window
npm run build            # TypeScript check (src + electron) + Vite build
npm run build:electron   # Build the main/preload bundles to dist-electron/
npm run electron:build   # Full build + electron-builder --mac (unsigned .dmg)
npm run android:sync     # Web build + copy into android/ (npx cap sync)
npm run android:build    # android:sync + debug APK
npm run android:release  # android:sync + release APK and AAB (signed if
                         #   android/keystore.properties exists)
npm run android:run      # android:sync + install on a device/emulator
npm run android:test     # JVM unit tests of the Kotlin code (incl. JGit)
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
  config.ts                   #   ~/.config/neno/config.json (last folder,
                              #   window bounds)
  windowState.ts              #   Remembers/restores the window bounds
  windowGeometry.ts           #   Pure display-fitting geometry
  dialogs.ts                  #   Native folder/open/save dialogs
  unsavedChanges.ts           #   Native confirm on window close
  fileMenu.ts                 #   The File menu (Print, Cmd-P)
  findMenu.ts                 #   The Edit menu's find items
  historyMenu.ts              #   The Go menu (Back/Forward, Cmd-[ / Cmd-])
  storage/
    NodeFsStorageProvider.ts  #   StorageProvider on node:fs/promises
    bridge.ts                 #   RPC dispatch on a MessagePortMain; owns
                              #   the folder's GitSync
  git/                        #   Version history and auto-sync, on the
                              #   system git (see "Git and auto-sync")
    runGit.ts                 #     Spawns git: non-interactive, timed out
    GitRepo.ts                #     Local operations: init, commit, log, diff
    GitSync.ts                #     Worktree lock, pull/push, triggers, status
    rebase.ts                 #     Rebase with last-writer-wins resolution
    classifyError.ts          #     offline / auth / rejected / other

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
    git/                      # Types, commit messages and the diff shared
                              #   by electron/git/ and the history view
    electron/                 # Renderer/worker side of the storage bridge
    FileSystemAccessAPIStorageProvider.tsx
                              # File System Access API integration (OPFS mode)
    android/                  # Android: window.neno and the bridge host
  types/                      # Shared TypeScript types
  intl/                       # Internationalization

android/                      # Capacitor's Gradle project (checked in)
  app/src/main/java/io/github/polyrainbow/neno/
    NenoPlugin.kt             #   The one Capacitor plugin: bridge calls,
                              #   sync, setup (key, host key, clone)
    NenoGraph.kt              #   Per-process graph session: storage, lock,
                              #   GitSync, SSH
    PushWorker.kt             #   WorkManager job: pushes after the app
                              #   left the foreground
    KeystoreSecretBox.kt      #   Seals the SSH key with an Android
                              #   Keystore key
    storage/                  #   GraphStorage (StorageProvider in Kotlin),
                              #   WorktreeLock
    git/                      #   Port of electron/git/ on JGit: GitRepo,
                              #   GitSync, Replay (last writer wins),
                              #   ClassifyError, Ssh, CommitMessage
  app/src/test/               #   JVM tests (JUnit), no device needed
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
| `src/lib/electron/GitClient.ts` | The worker's handle on the folder's repository: commit, log, diff over the bridge |

**Gotcha — `MessagePort.start()`:** When listening on a `MessagePort`
with `addEventListener` (as opposed to setting `onmessage`), the port
must be explicitly started with `port.start()`. The proxy handles this
automatically. There is a regression test in
`NotesProviderProxy.spec.ts`.

**Gotcha — workers started from a worker:** the notes worker starts the
subwaytext parser pool itself (`DatabaseIO`). Write such a worker as
`new Worker(new URL("…", import.meta.url), { type: "module" })`, never
as a `?worker&url` import: since Vite 8.3 a `?worker&url` asset imported
from inside a worker is not written out, which only shows in a
production build — the dev server and the Playwright suite are fine.
`referencedScriptsExistPlugin` in `vite.config.ts` fails the build if a
script refers to an asset that is missing.

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
 │ GitSync (git CLI) │      │ (forwards   │        │ GitClient        │
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
`storage.…` / `git.…` so one port carries both. `StorageProviderProxy`
and `GitClient` share a single `BridgeClient`, because they share the
request id sequence. Main also speaks first on the same port: a
`BridgeEvent` without an id (`pathsChanged`, after a pull) tells the
worker which files to re-read.

**Streams are chunked.** A `ReadableStream` is transferable between
renderer contexts but not across the main-process boundary, so
`getReadableStream` becomes `openRead` + one `readChunk` per `pull`, and
`writeObjectFromReadable` becomes `openWrite` + `writeChunk` per chunk +
`closeWrite` returning the byte count. Chunks are copied before they go
on the wire; there is no transfer list, since a `MessagePortMain` can
only transfer `MessagePort`s and everything crossing the process
boundary is serialized regardless.

Errors carry an `errorCode` field alongside the message, so callers can
branch on `err.code` (`ENOENT`, `EEXIST`, …) as they would on Node's.

### Git and auto-sync

Every flush is a commit, and auto-sync pushes it to the remote at once
and pulls in what other machines pushed. All of it runs on the **system
git in the main process** (`electron/git/`); the worker only reports what
a flush wrote (`git.commit` over the bridge). There is no git in OPFS
mode, and none without git installed — `findGit()` only accepts
`/usr/bin/git` once `xcode-select -p` succeeds, because running Apple's
stub opens the Command Line Tools installer.

- **Saving never waits for the network.** `GitSync`'s worktree lock is
  taken by every write through the bridge (`writeObject`, `removeObject`,
  `renameObject`, and a streamed write from `openWrite` to `closeWrite`),
  by commits and by the rebase. Fetch and push run in a separate queue
  that never holds it. A rebase only starts on a worktree with no
  uncommitted tracked changes; a flush caught halfway is committed a
  moment later, and its rejected push pulls again.
- **git never prompts.** `runGit.ts` sets `GIT_TERMINAL_PROMPT=0`, ssh
  `BatchMode=yes` with `ConnectTimeout=5`, an HTTPS stall limit and a
  time limit per call, and kills the **whole process group**: ssh
  outlives a killed git and holds the pipes open, so killing git alone
  does not end the call. `GIT_CEILING_DIRECTORIES` stops a graph folder
  without a `.git` of its own from being taken into an enclosing repo.
- **An unreachable remote is a state, not an error** (`offline`): a
  LAN-only remote is unreachable whenever the laptop is elsewhere.
  `classifyError.ts` decides; only auth failures, a missing remote and
  unrelated histories are errors. Failures retry with backoff, and the
  renderer's `online` event retries at once.
- **When:** push after every commit; pull on folder open, on window
  focus (at most once a minute), every 5 minutes while focused, and when
  a push is rejected. A pull waits while the window has unsaved changes
  (`unsavedChanges.ts`), and the open note picks up pulled changes
  through the worker's ordinary `mutation` broadcast.
- **Conflicts: last writer wins**, per file, by the author time of each
  side's latest commit touching it (`rebase.ts`). Text goes through
  `git merge-file --ours/--theirs`, so only overlapping hunks are lost;
  binary files go whole to the newer side; an edit always beats a
  deletion. When the local side loses, its commit is kept under
  `refs/neno/overwritten/`, because the rebase drops it from the branch.
  Untracked files the remote also has (`.pins.neno`, written on first
  load) are committed first, or the rebase would refuse on every pull.
- The toggle lives in the repo's own config (`neno.autoSync` in
  `.git/config`); the remote is the branch's upstream, else `origin`.
  NENO never adds or changes remotes, refuses a repo whose history is
  unrelated to its remote, and aborts a rebase a crash left behind when
  the folder opens.
- **Quitting:** `will-quit` waits for `disposeStorageBridges()`, which
  kills fetch and push but lets a commit or rebase that has started
  finish, then calls `app.exit()` — a second `app.quit()` from a
  prevented `will-quit` never completes.

### Non-obvious main-process requirements

- `plugins: true` in `webPreferences` — without it Chromium's PDF viewer
  is disabled and the PDF `<iframe>` in `FileViewPreview.tsx` renders
  blank.
- The CSP is stamped only onto app responses (`isAppUrl`). The
  `onHeadersReceived` listener sees every response in the session,
  including the PDF viewer's own `chrome-extension://` page, whose
  `chrome://resources` scripts the app policy would block — another way
  to get a blank PDF `<iframe>`.
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
- The default window is 1440 wide, not 1280: the note list sidebar is
  hidden below `min-width: 1281px`, so a 1280px window opens without it.
  `MIN_WIDTH`/`DEFAULT_WIDTH` live in `electron/windowGeometry.ts`
  alongside the comment explaining the tie to the CSS.
- `tools/buildIcon.mjs` renders `build/icon.png` with Electron's own
  Chromium, through a `<canvas>`. Both halves matter: `rsvg-convert`
  ignores the logo's `transform-origin` attributes and throws the middle
  bar of the "N" off the canvas, and a `webContents.capturePage()` is
  composited for the display, which converts the pixels out of sRGB and
  desaturates them.

### Find in note

Chromium's find bar is browser UI that Electron does not ship, so Cmd-F
is built here: a React bar (`src/components/FindBar.tsx`) over a
renderer-side search (`src/lib/findInEditor.ts`).
`electron/findMenu.ts` owns the Edit menu items and forwards nothing but
the command — the accelerators live on the menu rather than on a
renderer keydown listener, so they fire regardless of focus. In a
browser the component renders nothing — there, Cmd-F is the browser's
own find.

**`webContents.findInPage()` was tried first and does not fit.** It
searches everything the window renders — the note list, the header, the
navigation rail, the find bar's own input — so it answers a question
nobody asked, and it takes focus by selecting each match, which fights
the typist for the caret. Searching the whole graph is what the search
bar is for; Cmd-F is for the note in front of you. Everything that
version needed — the phantom self-match, the focus hold, the
new-session/step distinction behind Electron's misnamed `findNext` — was
scaffolding around those two problems, and none of it survives.

What the replacement rests on:

- **Matches are painted with the CSS Custom Highlight API**, the same
  mechanism the editor already uses for code tokens and block sigils
  (`src/lib/editor/utils/highlight.ts`, `setFindHighlights`). No DOM is
  wrapped and no Lexical state is touched, so the document Lexical
  thinks it has stays the document on screen, and the caret and the page
  selection stay where the user left them. The active match is a second
  highlight, kept disjoint from the rest so nothing is painted twice.
- **Each block is searched on its own.** The editor's element children
  are the subtext blocks, and keeping them apart is what stops a match
  from spanning the gap between two of them.
- **Case folding runs as a RegExp over the original text**, never over a
  lower-cased copy: `toLowerCase()` can change a string's length (the
  Turkish dotted capital İ becomes two code units), which would slide
  every later offset and put the highlight on the wrong characters.
- **Ranges do not survive an edit.** Lexical replaces the text nodes
  they point at, so their highlights silently vanish. A debounced
  `MutationObserver` on the document rebuilds them — which also covers
  switching notes and a transclusion arriving. It cannot feed itself:
  the state it writes back is two numbers, so a rebuild that finds what
  the last one found re-renders nothing and mutates nothing.
- **Only the active editor is searched.** On a view without one — the
  scripts view, whose Monaco editor has a find widget of its own that
  the menu accelerator pre-empts — the bar opens and reports no results.

### Back and forward

Electron ships none of the browser's ways through the history, so NENO
brings its own, desktop-only (in a browser they render/do nothing):
header buttons (`HistoryNavigationButtons.tsx`), the Go menu
(`electron/historyMenu.ts`, forwarding the command like the find menu),
the mouse side buttons and a two-finger trackpad swipe
(`HistoryNavigation.tsx`). All of them go through
`useHistoryNavigation`, so leaving a note with unsaved changes asks
first — which is why the menu does not call
`webContents.navigationHistory` itself.

Electron's `swipe` event only fires with the non-default three-finger
"swipe between pages" setting, so the default two-finger swipe is
recognized from horizontal wheel events (`src/lib/swipeNavigation.ts`).
The DOM has no gesture phases, so a gesture is a run of wheel events
without a 200 ms gap, and its first event decides whether it may
navigate at all.

### Storage-provider details that only bite on a real file system

- `.normalize("NFC")` on every name read from disk: macOS returns
  HFS+/APFS directory listings in NFD.
- The `#MAX_OPEN_FILES = 512` semaphore, ported verbatim from the
  FS-Access provider — the OS fd limit applies to Node just the same.

## Android architecture

The same `dist/` runs in the Android System WebView inside a Capacitor
shell (`capacitor.config.json`). Capacitor serves it from
`https://localhost` with an SPA fallback to `index.html`, which gives the
router, OPFS, module workers and the Navigation API the same secure,
non-`file://` origin that `neno://` gives them on the desktop — nothing
in the router had to change.

### window.neno on Android

There is no preload: `main.tsx` builds `window.neno` from
`src/lib/android/AndroidBridge.ts` before React renders, behind a dynamic
import so the desktop and browser bundles never load Capacitor. The
bridge carries `platform: "electron" | "android"`, and the old single
`isElectron()` is split:

- `hasNativeHost()` — storage, git, sync, file dialogs, unsaved-changes
  flag: both hosts.
- `isElectron()` — menu-driven features (find bar, Go menu, header back
  and forward buttons), mouse side buttons and trackpad swipes. On
  Android the system back button/gesture feeds `onHistoryCommand`; on
  the first history entry it puts the app in the background.

`main.tsx` refuses to start in a WebView older than Chrome 122 (checked
by feature: Navigation API, CSS Custom Highlight API, iterator helpers,
Set methods, `Promise.withResolvers` — the build targets `esnext`) and
says to update Android System WebView instead of failing in places.
Emulator images without the Play Store keep their stale WebView: the
Android 13 `google_apis` image has Chrome 109 and shows that message;
use a newer image to look at the UI. Icon-button tooltips appear only
for a mouse (`pointerType`), never on a tap.

### Storage: a private folder, not OPFS

The graph lives in `Context.filesDir/graph` — private to the app, not
visible to other apps, the Files app or USB, gone on uninstall. Not OPFS:
Chromium stores OPFS in an obfuscated internal layout, and JGit needs a
real working tree. It is excluded from Android backups
(`res/xml/data_extraction_rules.xml`): a synced graph is backed up by its
remote, and the sealed SSH key could not be opened on another device.

The notes worker cannot reach native code — Capacitor's bridge lives on
the window — so the page serves the other end of the worker's storage
port (`src/lib/android/AndroidBridgeHost.ts`) and forwards each
`{id, method, args}` to `NenoPlugin.call`. The worker side
(`BridgeClient`, `StorageProviderProxy`, `GitClient`) is the desktop's,
unchanged. Capacitor speaks JSON, so binary data travels as
`{ "$b64": … }`. `git.diff` is translated on the way: native code only
returns both versions of each file (`git.fileVersions`), and the line
diff is computed by `src/lib/git/diff.ts`, so both apps show a change
alike.

**Loading speed.** A graph load reads every note; one bridge round-trip
per note costs ~0.2 ms each, so `StorageProvider` has an optional
`readObjectsAsStrings` and `DatabaseIO` uses it when present (5,000
notes: 125 ms in one call against 855 ms in 5,000). With 5,000 notes the
editor is usable ~0.4 s after launch. Writes go through a temporary file
moved into place (`*.neno-tmp`, excluded in `.git/info/exclude`) — a
phone kills apps mid-write routinely.

### Git on Android

JGit and Apache MINA SSHD, both pure Java, bundled in the APK — there is
no system git. `android/app/src/main/java/…/git/` ports `electron/git/`
with the same rules (worktree lock vs. network queue, offline is a
state, push after commit, pull on open / foreground / every 5 minutes /
rejected push, no pull while the editor is dirty, `neno.autoSync` in
`.git/config`). What differs, and why:

- **minSdk 33.** JGit 7's pack protocol calls `InputStream.readNBytes`,
  which Android only has from 13 on; on 10–12 it dies with
  `NoSuchMethodError`. JGit 5.13 would run there but pins a MINA SSHD
  from before the Terrapin fix. An `Error` like that must fail the call,
  not the app, hence `catch (e: Throwable)` in the plugin and the sync.
- **No rebase.** `Replay.kt` re-creates the local commits on top of the
  fetched ones in memory (a cherry-pick per commit with the
  last-writer-wins rules of `rebase.ts`) and checks out the result in
  one step. Nothing is ever left mid-rebase. One subtlety: JGit's
  `MergeAlgorithm` calls a side that is *empty* a conflict even when it
  equals the base, where git's merge takes the other side — so a side
  unchanged from the base is settled before merging.
- **Errors are exceptions**, not stderr: `ClassifyError.kt` looks at the
  cause chain's types first, then at the desktop's message patterns plus
  JGit's and MINA's wording.
- **Handshake timeout.** `ConnectTimeout` covers only the TCP connect; a
  server that accepts and never speaks SSH held each operation for
  MINA's default 2 minutes. MINA reads its defaults from system
  properties prefixed `org.apache.sshd.config.` (not `org.apache.sshd.`),
  so `SshSupport` sets `org.apache.sshd.config.auth-timeout`.
- **Commit messages** end in `\n`, as `git commit` writes them and JGit
  does not.
- **Never touch the whole working tree.** JGit's clone leaves every
  index entry smudged (no size and time recorded), and the next index
  write — or a full `status`, which JGit never writes back — re-reads and
  hashes every file: 1.3 GB of attachments took a minute on a phone,
  inside the first pull. So `cloneShallow` records the cloned files'
  stats itself (`recordCheckedOutFiles`), and a pull runs `status` and
  its checkout on the paths the incoming commits change only, not
  `DirCacheCheckout`. That also keeps one file the platform cannot
  represent (`ß` and `ss` are one name on macOS's file system) from
  blocking every pull.
- **The app in the foreground is the focused window.** Leaving it with
  unpushed commits enqueues `PushWorker`, which pushes once the device
  has a network, even if the process is gone by then.

**SSH.** Each device makes its own ed25519 key on first use; the private
key is sealed with an AES-GCM key in the Android Keystore and only opened
in memory (JGit gets a `KeyPair`, never a key file). Host keys are trust
on first use, never silent: an unknown host is refused and its key's
fingerprint shown in the clone flow; a changed key is refused outright
(`TrustedHosts`). Desktop NENO never adds remotes; on a phone there is no
command line, so cloning from the start view is how a graph gets one
(it also switches auto-sync on).

**Shallow clone.** The clone fetches only the newest commit
(`GitRepo.cloneShallow`, depth 1). A graph's history can dwarf its
files — one real graph has 3.7 GB of history next to 1.3 GB of current
files — and sync never needs it: pull and push only look at commits
since. JGit's `RevWalk` treats `.git/shallow` commits as parentless, so
the replay, unpushed counts and merge bases work unchanged
(`ShallowCloneTest`). The history view starts at the clone; its oldest
commit is shown without changes, since against nothing it would claim to
add every file of the graph.

**Reinstalling.** A graph can take minutes to clone again, so:
- Every build, debug and release, is signed with the key in
  `android/keystore.properties` (gitignored; keystore in
  `~/.android/neno-release.jks` — back both up). A build signed with a
  different key cannot be installed over the app, and the uninstall that
  forces deletes the graph.
- `android:hasFragileUserData` offers "Keep app data" on uninstall.
  Android wipes the app's Keystore entries regardless, so the kept SSH
  key can no longer be opened: `SshIdentity` makes a new one, marks it
  replaced, and the SSH key setting says to add it to the server until a
  sync goes through.

### Build notes

- JDK 21 and the Android SDK (`ANDROID_HOME`, or `sdk.dir` in
  `android/local.properties`) are needed.
- Kotlin stays on 2.2.x while AGP is 8.13: a newer Kotlin's metadata is
  beyond what that R8 understands.
- `android/app/src/main/assets/public` is the copied web build;
  `npm run android:sync` refreshes it. It is gitignored.
- The launcher and splash icon is a vector drawable of `logo.svg`
  (`res/drawable/ic_launcher_foreground.xml`), scaled to stay inside the
  adaptive icon's safe circle.

## Tests

Unit tests live next to source files as `*.spec.ts` / `*.spec.tsx`, in
both `src/` and `electron/` (see `vitest.config.ts`).
Run a single test file: `npx vitest run src/lib/notes/noteUtils.spec.ts`

The specs in `electron/git/` run the real `/usr/bin/git` against
temporary repositories — a bare repo as the remote and two clones as two
machines — and take seconds each, hence the suite's 30 s timeout.
A hanging remote is simulated with `ext::sleep 30`, which is why
`GitRepo` takes `extraConfig` (`protocol.ext.allow=always`).

The Kotlin tests in `android/app/src/test/` (`npm run android:test`) are
plain JUnit on the JVM. `GitSyncTest` and `GitRepoTest` mirror the cases
of the `electron/git/` specs, with the phone driven through JGit and the
other machine through the system git — which also shows the two get
along. The silent-server case waits out the 20 s handshake timeout.

Integration tests are in `tests/integration/`. Visual regression tests
are in `tests/visual-regression/`. Both drive `npm run dev` in a real
browser at `localhost:5173` in **OPFS mode** — which is the main reason
OPFS mode was worth keeping.

## Requirements

- Node.js v24+
- macOS (the packaged app is macOS-only and unsigned)
- git (Apple's Command Line Tools) for version history and auto-sync,
  and for the `electron/git/` and Android git specs
- For Android: JDK 21, the Android SDK; the app runs on Android 13+
  with an up-to-date Android System WebView (Chrome 122+)
