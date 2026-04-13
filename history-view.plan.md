# History View

## Context

The `feat/create-commits` branch adds automatic per-flush git commits to
the user's notes directory via `src/lib/notes-worker/git.ts`
(`ensureRepo` + `commitChanged`). The write side is working, but there
is no UI yet that lets the user *see* the resulting commit log. This
plan adds a read-only **History** view that lists the last N commits
with their changed files — making the commit trail visible and giving
users a sense of what the auto-commit feature has been recording.

Scope (confirmed with user):

- Load 20 commits initially, with a **Load More** button for older ones.
- Each entry: short SHA, commit message, author name, relative date,
  and the list of changed files with `+` / `-` markers
  (added+modified vs deleted).
- File paths are plain text (not clickable). Keeps the first
  implementation simple and sidesteps deleted/renamed-path edge cases.
- Nav rail placement: just before Stats.

## Data layer

### 1. `src/lib/notes-worker/git.ts` — add reader helpers

Add two exports (keep the existing `ensureRepo` / `commitChanged`
unchanged):

```ts
export interface ChangedFile {
  path: string;
  change: "add" | "modify" | "delete";
}

export interface CommitInfo {
  oid: string;            // full SHA; UI will shorten to 7 chars
  message: string;
  author: { name: string; email: string };
  timestamp: number;      // seconds since epoch (from isomorphic-git)
  timezoneOffset: number; // minutes
  changes: ChangedFile[];
}

export async function getCommitHistory(
  fs: FileSystemAccessFs,
  dir: string,
  options: { limit: number; offset: number },
): Promise<CommitInfo[]>;
```

Implementation:

- `git.log({ fs, dir, depth: offset + limit })` returns commits
  newest-first; slice `[offset, offset + limit]`.
- For each commit, compute `changes` by diffing its tree against its
  first-parent tree using `git.walk({ fs, dir, trees: [...] })`. For
  the root (no parent), every entry in its tree counts as an `add`.
  Walk classifies each path as `add` (parent missing), `delete`
  (commit missing), or `modify` (both present, different oid).
- Filter out `.git/` internal entries (they won't appear in commit
  trees anyway, but be defensive) and respect the same tracked-file
  set as `commitChanged` implicitly does (i.e., whatever is in the
  commit tree is what we show).

### 2. `src/lib/notes-worker/index.ts` — RPC route

`gitFs` lives in module scope (not in `NotesProvider`), so
`handleRPCCall` cannot reach it via `notesProvider[method]`. Add a
narrow special case *before* the generic dispatch:

```ts
if (method === "getCommitHistory") {
  if (!gitFs) { respond({ id, error: "Git not initialized" }); return; }
  const [options] = args as [{ limit: number; offset: number }];
  const result = await getCommitHistory(gitFs, "/", options);
  respond({ id, result });
  return;
}
```

Keep the branch small — if more git-read methods get added later,
factor into a `handleGitRPC` helper, but don't prematurely abstract.

### 3. `src/lib/notes-worker/NotesProviderProxy.ts` — client method

Add:

```ts
async getCommitHistory(
  options: { limit: number; offset: number },
): Promise<CommitInfo[]> {
  return await this.#call("getCommitHistory", [options]) as CommitInfo[];
}
```

Re-export `CommitInfo` / `ChangedFile` types so consumers don't import
from `notes-worker/git.ts` directly.

## Routing & navigation

### 4. `src/types/PathTemplate.tsx`

Add `HISTORY = "graph/%GRAPH_ID%/history"`.

### 5. `src/components/AppRouter.tsx`

- Register route `{ id: "history", path: getAppPath(PathTemplate.HISTORY, ...) }`
  (mirrors the `stats` registration at lines 124–132).
- Add branch: `else if (routeId === "history") { return <NoteAccessProvider><HistoryView /></NoteAccessProvider>; }`
  (mirrors the stats branch at lines 204–207).

### 6. `src/components/NavigationRail.tsx`

Insert a new `<NavigationRailItem>` immediately before the existing
Stats item (lines 114–135). Use `icon="history"` (Material Symbols),
`activeView === "history"`, and navigate to `PathTemplate.HISTORY`.
Mirror the unsaved-changes guard used by the other items.

## View component

### 7. `src/components/HistoryView.tsx` (new)

Follow the `StatsView` shape (layout + data-fetching pattern):

```
<div className="view">
  <NavigationRail activeView="history" />
  <HeaderContainerLeftRight />
  <section className="content-section">
    {commits === null
      ? <BusyIndicator alt={l("history.fetching")} />
      : <HistoryList commits={commits} onLoadMore={…} hasMore={…} />}
  </section>
</div>
```

- State: `commits: CommitInfo[] | null`, `isLoadingMore: boolean`,
  `hasMore: boolean` (true until a fetch returns fewer than `limit`).
- Initial fetch: `notesProvider.getCommitHistory({ limit: 20, offset: 0 })`.
- Load More: re-fetch with `offset = commits.length`, append results,
  update `hasMore`.

### 8. `src/components/HistoryList.tsx` (new)

Pure presentational. For each commit render:

- **Header row**: `{shortOid}` · message first line · author name · relative date
- **Expandable/always-visible body**: the rest of the commit message
  (since auto-generated messages put file lists in the body — see
  `formatMessage` in `git.ts` lines 84–131) and the `changes` list:
  - `+ path/to/note.subtext` for `add` / `modify`
  - `- path/to/deleted.subtext` for `delete`

For v1, render the body + changes inline (always visible) rather than
collapsing — keeps the component simple. A Load More button at the
bottom when `hasMore` is true.

Relative dates: check if the repo already has a formatter (search
`src/lib/utils` and `src/components`). If not, use
`Intl.RelativeTimeFormat` with the current locale from `intl`.

## i18n

### 9. `src/intl/en-US.json` and `src/intl/de-DE.json`

Add (placed alphabetically; `git-config.*` keys already exist around
lines 74–76 of en-US.json):

```
"history.fetching": "Loading commit history…"
"history.empty": "No commits yet."
"history.load-more": "Load more"
"history.changes.added": "Added or modified"
"history.changes.deleted": "Deleted"
"menu.history": "History"
```

Provide German translations in `de-DE.json`.

## Tests

### 10. `src/lib/notes-worker/git.spec.ts` — extend

Add cases using the existing `FakeDirectoryHandle` / `makeFs()` helper
(see lines 1–32 of that file):

- `getCommitHistory` on a fresh repo returns the `initial commit` with
  all seeded files as `add`.
- After two `commitChanged` calls (add a note, then modify it), the
  history contains three commits newest-first with correct `change`
  classifications (`modify` on the second user commit, `add` on the
  first, plus the initial commit).
- `limit` and `offset` slice correctly.

### 11. `src/components/HistoryView.spec.tsx` (new, optional)

Light smoke test: render with a mocked `useNotesProvider` that returns
a fixed `CommitInfo[]`, assert that commit messages and changed paths
are rendered. Skip if the repo has no prior-art for component tests
(grep for `render(` in `*.spec.tsx` to check); the git-layer test
above is the critical one.

## Verification

1. `npm run unit-test src/lib/notes-worker/git.spec.ts` — new cases pass.
2. `npm run lint` and `npm run build` — no TS or lint errors.
3. `npm run dev`, open the graph, create/edit/delete a note so the
   commit hook fires a few times, then navigate to the History route
   via the new nav rail item. Verify:
   - Commits render newest-first with correct metadata.
   - `+`/`-` markers match the action taken.
   - Load More extends the list and disappears when exhausted.
   - A brand-new repo shows only `initial commit`.
4. `npm run integration-test` — ensure no regressions in existing
   navigation flows.

## Critical files

| File | Change |
|---|---|
| `src/lib/notes-worker/git.ts` | Add `CommitInfo`, `ChangedFile`, `getCommitHistory()` |
| `src/lib/notes-worker/index.ts` | Special-case `getCommitHistory` RPC before generic dispatch |
| `src/lib/notes-worker/NotesProviderProxy.ts` | Add `getCommitHistory()` + re-export types |
| `src/types/PathTemplate.tsx` | Add `HISTORY` enum entry |
| `src/components/AppRouter.tsx` | Register route + render branch |
| `src/components/NavigationRail.tsx` | Insert nav item before Stats |
| `src/components/HistoryView.tsx` | New view component |
| `src/components/HistoryList.tsx` | New presentational list |
| `src/intl/en-US.json`, `src/intl/de-DE.json` | Add `menu.history` + `history.*` keys |
| `src/lib/notes-worker/git.spec.ts` | Extend with `getCommitHistory` cases |
