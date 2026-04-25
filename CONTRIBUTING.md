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

Make sure you have Node.js v24 installed. Clone this repo and run
`npm i`. To start a development instance, run `npm run dev`.

## Publishing a release

1. Run `npm run version:{major,minor,patch}`
2. Push commit to remote
3. Push tag to remote: `git push origin vX.Y.Z`

The release package will now be built remotely with the script 
`tools/buildReleasePackage.sh`

## High-level architecture

```
┌──────────────────────────────────────────────────────────┐
│ Browser tab (main thread)                                │
│                                                          │
│  React UI  ──  Lexical Editor  ──  NotesProviderProxy    │
│                                            │             │
└────────────────────────────────────────────┼─────────────┘
                                             │
                             MessagePort RPC │
                                             ▼
            ┌──────────────────────────────────────┐
            │ SharedWorker (one per origin)        │
            │                                      │
            │   NotesProvider (single in-memory    │
            │                  graph)              │
            │   ├── Subwaytext parser              │
            │   ├── FileSystemAccessAPI-           │
            │   │   StorageProvider                │
            │   └── isomorphic-git (optional)      │
            └─────────────────┬────────────────────┘
                              │
                              ▼
            ┌──────────────────────────────────────┐
            │ User's file system                   │
            │ (FileSystemDirectoryHandle, or       │
            │  Origin Private File System fallback)│
            │                                      │
            │  *.subtext notes, attachments, .git/ │
            └──────────────────────────────────────┘
```

All open NENO tabs of the same origin connect to the same `SharedWorker`,
so there is exactly one `NotesProvider` and one in-memory graph cache for
the whole session. A tab's React UI never touches `NotesProvider`
directly — it goes through `NotesProviderProxy`, which forwards each
method call as an RPC over a `MessagePort`. Mutations from any tab are
broadcast back to the other tabs so their views stay in sync.

User-defined scripts run in a dedicated, sandboxed `Worker` per tab.
The tab forwards a `MessagePort` from its own connection to the
`SharedWorker` so the script worker can issue RPCs against the same
graph instance without bypassing the sandbox.

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

### Notes worker (SharedWorker)
- Entry point: `/src/lib/notes-worker`

Hosts the single `NotesProvider` instance. Tabs connect to it via
`SharedWorker` and talk to it through `NotesProviderProxy`
(`/src/lib/notes-worker/NotesProviderProxy.ts`). The first tab in a
session initializes the worker with a `FileSystemDirectoryHandle`;
later tabs in the same session piggyback on the existing setup and
skip the folder picker.

### FileSystemAccessAPIStorageProvider
- Entry point: `/src/lib/FileSystemAccessAPIStorageProvider.tsx`

A class that provides methods to manage a
[FileSystemDirectoryHandle](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle). The class is initialized with such a handle.
The "Notes" module uses an instance of this class to read and update the graph
that is saved in the file system of the user's device.

### Subwaytext parser
- Entry point: `/src/lib/subwaytext`

NENO's Subtext parser parses a Subtext string to an array of blocks.
It can also serialize blocks to a Subtext string. The "Notes" module depends
on it.

### Script worker
- Entry point: `/src/lib/script-worker`

Sandboxed dedicated worker that evaluates user-defined scripts. The
tab spawns one on demand and bridges it to the notes worker via a
transferred `MessagePort`.

## Commit convention
See https://www.conventionalcommits.org/en/v1.0.0/

## Deploying NENO on your own server

To deploy NENO, you need a web space capable of serving static files via HTTPS.

### 1. Clone this repository

### 2. Install dependencies
Run `npm i`

### 3. Build the app from the source

Set the `base` property in the Vite config to the correct basepath of your
hosting environment and run `npm run build`.

### 4. Copy files to webspace

Copy all files from the `dist` directory to your webspace.

Make sure that your webspace contains a SPA fallback mechanism so that requests
to non-existing files are forwarded to `index.html`.