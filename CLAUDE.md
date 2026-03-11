# NENO

Privacy-first note-taking app built on the Subtext markup language.
Users own their data via the File System Access API — notes are stored as
plain-text `.subtext` files on the user's device.

## Commands

```sh
npm run dev              # Dev server on localhost:5173
npm run build            # TypeScript check + Vite production build
npm run lint             # ESLint (src/ and tests/)
npm run lint-fix         # ESLint with --fix
npm run stylelint        # CSS linting
npm run test             # Unit tests (Vitest) + i18n tests
npm run unit-test        # Vitest only
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
    FileSystemAccessAPIStorageProvider.tsx
                              # File System Access API integration
  types/                      # Shared TypeScript types
  intl/                       # Internationalization
```

### Key modules

- **Notes** (`src/lib/notes/`) — Heart of the app. Manages note CRUD,
  graph relationships, indexes, and search. Depends on Subwaytext parser
  and FileSystemAccessAPIStorageProvider.
- **Subwaytext** (`src/lib/subwaytext/`) — Parses Subtext markup strings
  into block arrays and serializes them back. See the
  [Subtext Graph Specification](https://polyrainbow.github.io/neno/docs/subtext-graph-specification.html).
- **Editor** (`src/lib/editor/`) — Built on [Lexical](https://lexical.dev).
  Custom nodes and plugins extend the editor for Subtext content.
- **StorageProvider** (`src/lib/FileSystemAccessAPIStorageProvider.tsx`) —
  Wraps the browser FileSystemDirectoryHandle API. The Notes module uses
  this to read/write the user's file system.

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
| `src/lib/LocalDataStorage.ts` | Creates the notes worker, exposes `getNotesWorker()` for `MessageChannel` setup |

**Gotcha — `MessagePort.start()`:** When listening on a `MessagePort`
with `addEventListener` (as opposed to setting `onmessage`), the port
must be explicitly started with `port.start()`. The proxy handles this
automatically. There is a regression test in
`NotesProviderProxy.spec.ts`.

## Tests

Unit tests live next to source files as `*.spec.ts` / `*.spec.tsx`.
Run a single test file: `npx vitest run src/lib/notes/noteUtils.spec.ts`

Integration tests are in `tests/integration/`. Visual regression tests
are in `tests/visual-regression/`.

## Requirements

- Node.js v24+
- Browser with File System Access API (Chrome, Edge, Brave)
