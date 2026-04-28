# Plan: SharedWorker for cross-tab graph sharing

## Goal

A single in-memory graph instance shared across all NENO tabs of the
same origin, eliminating the "two tabs overwrite each other" failure
mode. As a bonus, second/third tabs in a session skip the File System
Access permission prompt entirely.

## Context

Today each tab spawns its own dedicated notes worker
(`src/lib/notes-worker/index.ts`) with its own `NotesProvider` and its
own in-memory graph. Two tabs editing the same folder hold divergent
caches and race on disk writes; whichever tab saves last clobbers the
other.

The fix is to promote the dedicated worker to a `SharedWorker` so a
single `NotesProvider` instance is shared between every tab on the
origin. The existing `NotesProviderProxy` already speaks RPC over
`MessagePort`, so the structural change is small.

## Decisions confirmed with user

- **Active-note conflict UX:** when another tab saves the note this
  tab has open, auto-reload if the local editor is clean; show a
  non-blocking banner if it has unsaved changes (offering reload-and-
  lose-changes, or keep working).
- **Folder switch with siblings open:** block the switch button while
  any sibling tab is connected — surface a "close other NENO tabs
  first" message. Avoids silently dropping unsaved work in siblings.
- **Worker → tabs broadcast:** coarse single `{ event: "mutation" }`
  fired after any mutating RPC. Subscribed tabs call the existing
  `refreshContentViews()` orchestrator. Mirrors what
  `saveActiveNoteAndRefreshViews` already does today.
- **No fallback:** NENO requires Chrome / Edge / Brave (per
  `CLAUDE.md`); all support `SharedWorker`. If unavailable, show
  "browser not supported" — do not maintain a parallel
  dedicated-worker code path.
- **Port lifecycle:** tabs send `{ action: "goodbye" }` on `pagehide`
  when `event.persisted === false`; worker also wraps every broadcast
  in `try/catch` to drop dead ports lazily. Goodbye is an
  optimisation; correctness comes from the catch.
- **Tests:** Vitest module-level via `MessageChannel` (handshake,
  init race, broadcast) — same pattern as
  `NotesProviderProxy.spec.ts`. Manual two-tab smoke check before
  merge. No Playwright two-context test.
- **PR scoping:** single PR, all phases — Phase 4 (UI invalidation)
  must ship with Phase 1 to avoid a regression for active multi-tab
  users, and the rest is small enough that splitting just adds
  overhead.

## Verified preconditions

Before planning, the following were confirmed empirically:

1. **Vite supports `?sharedworker&url`** — Vite 7.3.2 (current) per
   <https://vite.dev/guide/features.html#web-workers>.
2. **`FileSystemDirectoryHandle` is structured-cloneable into
   `SharedWorker`** — per WICG explainer + MDN. Same as today's
   transfer into a dedicated worker.
3. **File System Access permissions are origin-scoped while ≥1 tab
   is open** — per MDN: *"do not persist after a page refresh if no
   other tabs for that origin remain open."* Translation: while the
   `SharedWorker` is alive, permission stays granted; new tabs see
   `queryPermission() === "granted"` for the same handle and skip
   the prompt. Cold-start (all tabs closed → reopen) still requires
   `requestPermission()`.

## Architecture

```
Today                                After
┌─────────┐  ┌─────────┐             ┌─────────┐  ┌─────────┐
│ Tab A   │  │ Tab B   │             │ Tab A   │  │ Tab B   │
│ Worker  │  │ Worker  │             │  port ──┼──┤── port  │
│ (own    │  │ (own    │             └────┬────┘  └────┬────┘
│  graph) │  │  graph) │                  │            │
└────┬────┘  └────┬────┘             ┌────┴────────────┴────┐
     │           │                   │   SharedWorker        │
     ▼           ▼                   │   (one NotesProvider) │
   disk        disk                  └──────────┬────────────┘
                                                ▼
                                              disk
```

## Phases

### Phase 1 — Promote notes worker to `SharedWorker`

| File | Change |
|---|---|
| `src/lib/LocalDataStorage.ts:8` | `?worker&url` → `?sharedworker&url` |
| `src/lib/LocalDataStorage.ts:162` | `new Worker(...)` → `new SharedWorker(..., { type: "module" })`; everywhere `notesWorker` is used, switch to `sharedWorker.port` |
| `src/lib/LocalDataStorage.ts:154` | Drop `notesWorker.terminate()` — terminating a `SharedWorker` from one tab kills it for the others. Re-init (e.g. switching folder) needs a new protocol message: `{ action: "reset" }`. |
| `src/lib/notes-worker/index.ts:123` | Replace top-level `onmessage = ...` with `onconnect = (e) => { const port = e.ports[0]; setupPortHandler(port); port.start(); }` — every tab gets its own per-port handler. Extend `setupPortHandler` to also handle the lifecycle actions (`initialize`, `enableGit`, `addPort`, `setGitAuthor`) that today live on the global handler. |

The existing `NotesProviderProxy` already accepts a `MessagePort`
(see `NotesProviderProxy.ts:42, 83-85`), so the proxy itself needs
no changes.

### Phase 2 — Hello handshake + single-init lock

New per-port RPC actions:

```ts
// tab → worker
{ action: "hello" }
{ action: "initialize", folderHandle?, useOPFS?, gitAuthor }
{ action: "reset" }   // user picked a different folder
{ action: "goodbye" } // sent on pagehide

// worker → tab
{ action: "helloAck", initialized: boolean, gitEnabled: boolean,
  folderName: string | null, connectedTabCount: number }
{ action: "initialized", gitEnabled: boolean }
{ event: "mutation" }        // broadcast
{ event: "graphReset" }      // broadcast on reset
```

Worker keeps a single `initPromise: Promise<void> | null` plus a
`Set<MessagePort>` of active ports. On `initialize`:

- If `initPromise === null` → start init, store the promise.
- If `initPromise` exists → await it, then reply `initialized`
  (discard the incoming handle — first writer wins).

This handles two cold-start tabs racing: both send `initialize`,
only the first one's handle is used; the second's is discarded.

### Phase 3 — Caller-side handshake in `LocalDataStorage.ts`

```
initializeNotesProviderWithFolderHandleFromStorage():
  1. connect to SharedWorker, get port
  2. send hello, await helloAck
  3. if helloAck.initialized:
       → set folderHandle from IDB locally (for getActiveFolderHandle)
       → set gitEnabledFlag from helloAck
       → return new NotesProviderProxy(port)
  4. else:
       → load handle from IDB
       → verifyPermission(handle, true)   // user gesture, already
                                           // called from a button
       → send initialize with handle
       → await initialized response
       → return new NotesProviderProxy(port)
```

`isInitialized()` becomes "did we successfully hello-ack and obtain
a proxy" — locally cached after the first call.

### Phase 4 — Cross-tab UI invalidation (mandatory, ships with Phase 1)

Without this, the architecture solves the *write-ordering* problem
but leaves Tab B's React state stale — strictly worse than today
(today a refresh fixes it; with the shared graph, the worker has
the new state but Tab B's hooks still hold pre-mutation snapshots).

Implementation:

1. In `notes-worker/index.ts`, after every mutating RPC method
   (`put`, `remove`, `addFile`, `updateFile`, `renameFileSlug`,
   `deleteFile`, `pin`, `unpin`, `movePinPosition`, `enableGit`),
   broadcast `{ event: "mutation" }` to all connected ports
   **except the originator**. Skipping the originator avoids
   redundant refreshes since the originating tab already updates
   itself (`saveActiveNoteAndRefreshViews`).
2. In `NotesProviderProxy.ts`, add `subscribe(listener)` /
   `unsubscribe(listener)` for these broadcast events. The existing
   `addEventListener("message", handler)` in the constructor splits
   `{ id, result }` (RPC reply) vs `{ event }` (broadcast).
3. In a top-level component (likely `App` or `NoteView`), subscribe
   once and call `refreshContentViews()` on `mutation` events.
   Coarse-grained — one event triggers all three refreshes. This
   covers `useNoteList`, `useHeaderStats`, `usePinnedNotes`.
4. `FilesView`, `StatsView`, `HistoryView` get a similar
   effect-level subscription (~5 lines each) that re-fetches their
   one-shot data on `mutation`.
5. `useActiveNote`: on `mutation`, re-fetch the active note's slug
   and compare to local state.
   - If local editor is clean (no unsaved changes) → silently
     replace via `setActiveNoteFromServer`.
   - If local editor has unsaved changes → set a banner state
     (new piece of `useActiveNote` state) offering reload (drops
     local) or dismiss (keeps working). Render in `NoteView`.
   - If the active note was *deleted* in another tab → show the
     same banner with a different message; reload navigates to a
     new-note state.

### Phase 5 — Script worker port plumbing

Today: `useScriptExecutor.ts:22` does
`notesWorker.postMessage({ action: "addPort" }, [channel.port1])`
to send a fresh port to the dedicated notes worker.

After: the tab's port to the `SharedWorker` is its only channel;
sending `addPort` over that port still works — the per-port handler
in the worker (Phase 1) calls `setupPortHandler(event.ports[0])`
exactly like today. The script worker remains a dedicated worker
spawned per-tab; only its parent connection changes from
"notes worker" to "this tab's port to the shared notes worker".

Same change in `ScriptView.tsx:87-94`. Likely a one-line change in
each.

### Phase 6 — Lifecycle: detecting tab close

- **`pagehide` goodbye:**
  ```ts
  window.addEventListener("pagehide", (e) => {
    if (!e.persisted) {
      port.postMessage({ action: "goodbye" });
    }
  });
  ```
  `e.persisted === true` means the page is going into bfcache and
  may restore via `pageshow` — do not send goodbye.
- **`try/catch` on broadcast:** worker iterates the port set,
  catches errors per-port, and removes dead ports from the set.
  This is what makes the system correct; goodbye is an
  optimisation that makes cleanup immediate.

### Phase 7 — Reset / folder switch

`reset` action (one tab wants to switch folders):

1. Worker counts connected ports (excluding the originator). If
   `> 0`, reply `{ action: "resetDenied", connectedTabCount: N }`.
2. UI surfaces "close other NENO tabs first (N open)". Folder
   switch button stays disabled while `helloAck.connectedTabCount > 1`
   on the next hello.
3. If `connectedTabCount === 0`, worker tears down the
   `NotesProvider`, resets `initPromise = null`, broadcasts
   `{ event: "graphReset" }` (defensive — should be no other
   listeners), replies `{ action: "resetOk" }`. The originating tab
   then runs the normal `initialize` flow with the new handle.

The `helloAck.connectedTabCount` is needed at hello time so a
freshly-loaded tab can know whether it's alone or sharing.

## Files touched

- `src/lib/LocalDataStorage.ts` — switch to `SharedWorker`, add
  hello handshake, manage port connection, drop `terminate()`,
  add reset flow and connected-tab tracking, wire `pagehide`
  goodbye.
- `src/lib/notes-worker/index.ts` — replace top-level
  `onmessage` with `onconnect`; per-port handler; `initPromise`
  single-init lock; active-port set; mutation broadcasts;
  `goodbye` and `reset` handling.
- `src/lib/notes-worker/NotesProviderProxy.ts` — add
  `subscribe(listener)` / `unsubscribe(listener)` and split
  message dispatch between RPC replies and broadcast events.
- `src/hooks/useScriptExecutor.ts` — `getNotesWorker()` →
  `getNotesWorkerPort()` (new export); `addPort` flow unchanged
  conceptually.
- `src/components/ScriptView.tsx:87-94` — same as above.
- `src/hooks/useActiveNote.tsx` — add stale-note state, banner
  trigger, conditional auto-reload.
- `src/components/NoteView.tsx` — render the stale-note banner;
  subscribe to mutation broadcasts and call `refreshContentViews()`.
- `src/components/FilesView.tsx`, `StatsView.tsx`, `HistoryView.tsx`
  — subscribe to mutation broadcasts and re-fetch their data.
- `src/components/SettingsView.tsx` (or wherever the folder-switch
  button lives) — disable while siblings are connected; surface
  the "close other tabs first" message.
- `src/intl/en-US.json`, `src/intl/de-DE.json` — strings for the
  banner ("modified in another tab — reload?") and the folder-
  switch denial.

## Hook points (verified file:line refs)

### `SharedWorker` instantiation

- `src/lib/LocalDataStorage.ts:8` — worker URL import.
- `src/lib/LocalDataStorage.ts:150-188` — `createNotesWorkerAndProxy()`.
  Becomes "connect to shared worker, hello, conditionally initialize".
- `src/lib/LocalDataStorage.ts:191-215` — `initializeNotesProvider()`
  entry point; rewrite around the handshake.

### Worker per-port handler

- `src/lib/notes-worker/index.ts:114-121` — `setupPortHandler()`.
  Extend to handle the lifecycle actions (`hello`, `initialize`,
  `addPort`, `setGitAuthor`, `enableGit`, `reset`, `goodbye`)
  in addition to RPC dispatch.
- `src/lib/notes-worker/index.ts:123` — replace `onmessage` with
  `onconnect`.
- `src/lib/notes-worker/index.ts:126-184` — current `initialize`
  block; lift into `setupPortHandler` and gate via `initPromise`.

### Mutation broadcast

- `src/lib/notes-worker/index.ts:55-112` — `handleRPCCall()`.
  After a successful mutating method, iterate the active port set
  and post `{ event: "mutation" }` to every port except the
  originator. Maintain a list of mutating method names alongside
  the dispatch.

### React subscription point

- `src/components/NoteView.tsx:102-112` — `refreshContentViews()`.
  Subscribe to mutation broadcasts in a new `useEffect` and call
  this function on receive.
- `src/hooks/useActiveNote.tsx` — extend with stale-note banner
  state and the auto-reload-when-clean logic.

### Script worker

- `src/hooks/useScriptExecutor.ts:14-30` — change `getNotesWorker()`
  reference to a new `getNotesWorkerPort()` export from
  `LocalDataStorage`. The port speaks the same `addPort` action.
- `src/components/ScriptView.tsx:6, 87-94` — same.

## Tests

- `src/lib/notes-worker/index.spec.ts` — **new**. Drive the worker
  module via two `MessageChannel`s pointed at the same module-level
  state (jsdom has no `SharedWorker`, but the module's `onconnect`
  can be invoked directly with synthetic `MessagePort`s). Cover:
  - Hello on a fresh worker returns `initialized: false`.
  - Hello after init returns `initialized: true` with the folder
    name.
  - Two simultaneous `initialize` calls: one wins, the other gets
    `initialized` without re-running init (verified via spy on
    `NotesProvider` constructor count or the `createDummyNotes`
    side effect).
  - A `put` on port A triggers a `{ event: "mutation" }` on port B
    but **not** on port A.
  - `reset` while another port is connected → `resetDenied`.
  - `reset` when alone → `resetOk` and subsequent `hello` returns
    `initialized: false`.
  - A port that posts `goodbye` is removed from the active set
    (next mutation does not throw).
- `src/lib/notes-worker/NotesProviderProxy.spec.ts` — extend.
  Add tests for `subscribe()` / `unsubscribe()` receiving
  broadcast events from the worker side of a `MessageChannel`.
- Manual smoke before merge: open two tabs in Chrome, save in
  one, verify the other's note list, header stats, pinned panel,
  and active-note view all reflect the change. Try the
  active-note conflict path with unsaved changes in tab B.

## Edge cases

- **Tab opens with a stale handle** (folder was renamed/moved on
  disk while NENO was closed): existing `verifyPermission` already
  throws on first FS access; no change.
- **Two tabs both cold-start simultaneously, both hold a handle in
  IDB** — the `initPromise` lock means whichever `initialize`
  arrives first wins. Both tabs end up pointing at the winner's
  folder. In practice both handles point at the same folder anyway
  (loaded from the same IDB key).
- **`SharedWorker` lifecycle quirk in DevTools**: a tab open in
  DevTools' "Sources → Threads" panel may keep the worker alive
  longer than expected. Worth a CLAUDE.md note for contributors.
- **Git contention** is unchanged: `onFlush` runs commits
  sequentially per `NotesProvider`, and there is now exactly one
  `NotesProvider` instance.
- **OPFS users**: `useOPFS: true` path still works — the worker
  initialises with the OPFS root the first tab provides. All tabs
  share the same OPFS view (which they would have anyway).

## Open follow-ups (not in this PR)

- Persistent permissions (Chrome's persistent permissions API):
  out of scope here; orthogonal to the SharedWorker change.
- Per-resource broadcast granularity (notes vs files vs git):
  defer until profiling shows the coarse refresh is too expensive.
- Heartbeat-based liveness: defer; `pagehide` + `try/catch` is
  sufficient for v1.
