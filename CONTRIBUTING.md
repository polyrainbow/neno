# Contributing

Contributions are always welcome, no matter how large or small! Before
contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Concepts

If you want to contribute, here are some links that offer some basic
insights on how NENO works:

* [README](./README.md)
* [Subtext Graph Specification](https://polyrainbow.github.io/neno/docs/subtext-graph-specification.html)
* [User Manual](https://polyrainbow.github.io/neno/docs/index.html)

## Development setup

Make sure you have Node.js v24 and macOS. Clone this repo and run `npm i`.

Then either:

* `npm run electron:dev` — renders the app icon, builds the main/preload
  bundles, starts the Vite dev server and opens the Electron window
  against it. This is the normal way to work on NENO.

  Two things about the dev window are cosmetic patches, because in
  development the running bundle is Electron's own rather than NENO's:
  the Dock icon is set at runtime from `build/icon.png` (which the
  launcher renders first), and the
  application menu's title comes from the bundle's `CFBundleName`, which
  no Electron API can override — so the launcher rewrites it to "NENO"
  inside `node_modules`. A fresh `npm i` reverts that rename; the next
  run simply applies it again, and macOS may need a moment to drop the
  old name from its Launch Services cache. The packaged app needs
  neither patch: it gets both from electron-builder's `productName` and
  the derived `.icns`.
* `npm run dev` — the Vite dev server alone, at `localhost:5173`. Useful
  for renderer-only work and for the Playwright suite, but `window.neno`
  is absent there, so the native dialogs and the Node-fs graph folder are
  unavailable: only the OPFS "try it out" mode works (press Cmd+. on the
  start view).

To produce a local `.dmg`, run `npm run electron:build`; the artifact
lands in `release/`.

## Publishing a release

1. Run `npm run version:{major,minor,patch}`
2. Push commit to remote
3. Push tag to remote: `git push origin vX.Y.Z`

`.github/workflows/release.yml` then runs `npm run electron:build` on a
macOS runner and attaches `release/NENO-<version>.dmg` to the GitHub
release. The build is unsigned (`CSC_IDENTITY_AUTO_DISCOVERY=false`), so
users need the right-click → Open detour described in the
[README](./README.md).

## High-level architecture

```
┌──────────────────────────────────────────────────────────┐
│ Electron main process                                    │
│                                                          │
│  neno:// protocol (serves dist/)   native dialogs        │
│  NodeFsStorageProvider  ·  NodeFsGit  (node:fs/promises) │
└───────▲──────────────────────────────────────▲───────────┘
        │ contextBridge (window.neno)          │
        │                        MessagePortMain RPC
┌───────┴──────────────────────────────────┐   │
│ Renderer (neno://app)                    │   │
│                                          │   │
│  React UI ── Lexical Editor ── NotesProviderProxy         │
│                                          │   │           │
└──────────────────────────────────────────┼───┼───────────┘
                                           │   │
                           MessagePort RPC │   │ (port forwarded
                                           ▼   ▼  into the worker)
            ┌──────────────────────────────────────┐
            │ Notes worker (dedicated Worker)      │
            │                                      │
            │   NotesProvider (single in-memory    │
            │                  graph)              │
            │   ├── Subwaytext parser              │
            │   ├── StorageProviderProxy  ─────────┼──▶ main
            │   │   (or FileSystemAccessAPI-       │
            │   │    StorageProvider for OPFS)     │
            │   └── isomorphic-git (optional)      │
            │       over GitFsProxy  ──────────────┼──▶ main
            └─────────────────┬────────────────────┘
                              ▼
            ┌──────────────────────────────────────┐
            │ The folder the user picked           │
            │                                      │
            │  *.subtext notes, attachments, .git/ │
            └──────────────────────────────────────┘
```

The renderer is served over a custom `neno://` scheme rather than
`file://`, because the router matches on `location.pathname` and because
`file://` has no usable storage partition. See the Electron architecture
section of [CLAUDE.md](./CLAUDE.md) for the details, including the
chunked stream protocol the storage bridge uses.

There is exactly one NENO window, so the notes worker is a plain
dedicated `Worker` and there is exactly one `NotesProvider` with one
in-memory graph cache. The React UI never touches `NotesProvider`
directly — it goes through `NotesProviderProxy`, which forwards each
method call as an RPC.

User-defined scripts run in a dedicated, sandboxed `Worker`. The window
forwards a `MessagePort` to the notes worker so the script worker can
issue RPCs against the same graph instance without bypassing the
sandbox.

### Core application
- Technology: React
- Entry point: `/src/main.tsx`

### Editor
- Technology: [Lexical](https://lexical.dev)
- Entry point: `/src/lib/editor`

### Notes
- Entry point: `/src/lib/notes`

NENO highly depends on the heart of the application, the "Notes" module.
It contains all the core logic to create/read/update/delete notes and files.
It manages the note graph, including indexes.

### Notes worker
- Entry point: `/src/lib/notes-worker`

Hosts the single `NotesProvider` instance. The window talks to it through
`NotesProviderProxy` (`/src/lib/notes-worker/NotesProviderProxy.ts`).
`initialize` hands it either an absolute folder path plus a
`MessagePort` to the Electron main process, or an OPFS directory handle.

### Electron main process
- Entry point: `/electron/main.ts`

Registers and serves the `neno://` scheme, creates the window, sets the
CSP and the macOS menu, and owns the Node file system: the
`StorageProvider` (`/electron/storage/NodeFsStorageProvider.ts`), the
isomorphic-git adapter (`/electron/storage/nodeFsGit.ts`) and the RPC
dispatcher that exposes both to the notes worker
(`/electron/storage/bridge.ts`). `/electron/preload.ts` is the only
thing the renderer can see of it.

### Storage bridge (renderer side)
- Entry point: `/src/lib/electron`

`StorageProviderProxy` and `GitFsProxy` implement the same contracts as
their in-renderer counterparts but forward every call to the main
process. Streams are chunked, because a `ReadableStream` cannot be
transferred across the process boundary.

### FileSystemAccessAPIStorageProvider
- Entry point: `/src/lib/FileSystemAccessAPIStorageProvider.tsx`

A class that provides methods to manage a
[FileSystemDirectoryHandle](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle). The class is initialized with such a handle.
It backs the OPFS "try it out" mode, which is also what the Playwright
suite drives against `npm run dev`.

### Subwaytext parser
- Entry point: `/src/lib/subwaytext`

NENO's Subtext parser parses a Subtext string to an array of blocks.
It can also serialize blocks to a Subtext string. The "Notes" module depends
on it.

### Script worker
- Entry point: `/src/lib/script-worker`

Sandboxed dedicated worker that evaluates user-defined scripts. The
window spawns one on demand and bridges it to the notes worker via a
transferred `MessagePort`.

## Commit convention
See https://www.conventionalcommits.org/en/v1.0.0/

## Building NENO yourself

### 1. Clone this repository

### 2. Install dependencies
Run `npm i`

### 3. Build the app

Run `npm run electron:build`. This type-checks both roots, builds the
renderer into `dist/` and the main/preload bundles into `dist-electron/`,
renders the app icon into `build/icon.png` and hands everything to
electron-builder, which derives the bundle's `.icns` from that PNG.

`tools/buildIcon.mjs` does the icon rendering, and does it with
Electron's own Chromium (`npx electron tools/buildIcon.mjs`) — no extra
tool to install. That is not gratuitous: the logo places the bars of its
"N" with the `transform-origin` presentation attribute, which
`rsvg-convert` silently ignores, and it rasterizes through a `<canvas>`
rather than a window capture so the pixels stay in sRGB instead of being
converted to the display's gamut.

### 4. Install the result

`release/NENO-<version>.dmg` is a plain unsigned disk image: mount it,
drag NENO to Applications, then right-click → Open the first time (see
the [README](./README.md)).