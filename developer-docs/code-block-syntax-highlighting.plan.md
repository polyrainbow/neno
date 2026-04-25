# JavaScript syntax highlighting for inline script (and other) code blocks

## Context

Users write `` ```run `` and `` ```mod `` JavaScript blocks inside notes — and increasingly other fenced blocks (`` ```json ``, `` ```css ``, etc.) for reference. Today every fenced block renders as plain monospace text; there is no token highlighting in the editor. As `run`/`mod` usage grows, lack of highlighting makes scripts hard to read and write.

**Why not `@lexical/code-prism`** (the originally proposed solution): that package highlights `CodeNode` from `@lexical/code-core` — a single multi-line element node where the `` ``` `` fences are *not* stored in the document. The fences would only appear when serializing to Subtext on disk, not in the editor view. The user has confirmed they want fences to stay visible and editable. So `@lexical/code-prism` is the wrong tool.

**Chosen approach:** keep the existing per-line `CodeBlockNode` model untouched. Use `prismjs` directly to tokenize each script block's joined text, then paint the highlights on the DOM via the **CSS Custom Highlight API** — exactly the pattern already used for headings, quotes, bold, and inline-code sigils in `src/lib/editor/utils/highlight.ts`. The editor's structure does not change; we layer one more highlight pass on top.

## Decisions confirmed with user

- **Languages:** `` ```run `` and `` ```mod `` always highlight as JavaScript. Other info strings pass through to Prism — highlighted if the grammar is bundled, plain otherwise.
- **Theme:** custom CSS matching the existing app palette (no third-party Prism theme imported).
- **`script-block` styling kept**: `run`/`mod` blocks remain visually distinct (existing background) so users can still spot them at a glance.
- **Bundled grammars:** `javascript`, `typescript`, `json`, `css`, `markup` (HTML), `bash`, `python`, `markdown`.
- **Loading:** eager — Prism + grammars import with the editor bundle.
- **Fences visible as editable text** (today's behaviour, preserved).
- **No editor structural changes** — `CodeBlockNode`, `BlockTransformPlugin`, `setSubtext`, `getSubtextFromEditor`, `WikilinkPlugin`, `ProgrammableNotePlugin` all stay as they are.

## Approach

### 1. Dependencies

Add to `package.json`:

- `prismjs@^1.30.0`
- `@types/prismjs` (devDependency)

That's it. No `@lexical/code-core`, no `@lexical/code-prism`.

### 2. Tokenisation utility

New file **`src/lib/editor/utils/tokenizeCode.ts`**:

- Import `prismjs` and the eight grammars listed:
  ```ts
  import Prism from "prismjs";
  import "prismjs/components/prism-javascript";
  import "prismjs/components/prism-typescript";
  import "prismjs/components/prism-json";
  import "prismjs/components/prism-css";
  import "prismjs/components/prism-markup";
  import "prismjs/components/prism-bash";
  import "prismjs/components/prism-python";
  import "prismjs/components/prism-markdown";
  ```
- After grammar imports, alias: `Prism.languages.run = Prism.languages.javascript; Prism.languages.mod = Prism.languages.javascript;`. One-liner each.
- Export `tokenizeCode(code: string, language: string): TokenSpan[]` where `TokenSpan = { start: number; end: number; type: string }`. Internally:
  1. If `Prism.languages[language]` is undefined, return `[]` (no highlighting for unknown languages).
  2. Call `Prism.tokenize(code, Prism.languages[language])`.
  3. Walk the resulting token tree (Prism returns `(string | Token)[]`, where `Token.content` may itself be `(string | Token)[]`). Track running character offset. For each leaf `Token`, push a `TokenSpan` with the most-specific token type. Strings between tokens are unstyled.

### 3. DOM highlight pass

Extend **`src/lib/editor/utils/highlight.ts`** with a new function `highlightCodeTokens()`. Pattern matches the existing `highlightHeadingSigils` etc.:

1. Query all elements matching the existing script-block pattern, plus other fenced blocks. Use the same logic already in `ProgrammableNotePlugin.getScriptBlockNodeKeys` (which detects fenced regions in the editor children) but extracted into a shared helper if needed — or query the DOM directly via `div[data-lexical-editor] .code-block` runs.
2. Group consecutive `.code-block` DOM elements into fences (opening fence line, body lines, closing fence line). Read the language from the opening fence text (`” ```js “` → `js`).
3. Join body lines with `\n` to produce the code string. Call `tokenizeCode(code, language)`.
4. For each `TokenSpan`, convert (start, end) offsets in the joined string back to (lineIndex, columnOffset) pairs. Find the corresponding text node in the body line's DOM (each `CodeBlockNode` renders as a `<p>` with a single text node child for non-empty lines). Create a `Range` spanning that text node from `columnOffset` to `columnOffset + length`. If a token spans multiple lines (e.g. block comments), emit multiple `Range`s — one per line covered.
5. Bucket ranges by token type. For each bucket, `CSS.highlights.set("code-token-" + type, new Highlight(...ranges))`.

The function gets called from the `OnChangePlugin` callback in `src/lib/editor/index.tsx` alongside `highlightHeadingSigils`, `highlightInlineCodeSigils`, etc. — it runs on every editor update, mirroring the existing pattern. (Performance is a non-issue at the file sizes we expect; the existing highlight passes do similar work.)

### 4. Token CSS

Add to the editor stylesheet (the file imported alongside the editor — find via `import` in `src/lib/editor/index.tsx` or related theme files):

```css
::highlight(code-token-keyword)    { color: var(--token-keyword); }
::highlight(code-token-string)     { color: var(--token-string); }
::highlight(code-token-number)     { color: var(--token-number); }
::highlight(code-token-boolean)    { color: var(--token-boolean); }
::highlight(code-token-function)   { color: var(--token-function); }
::highlight(code-token-class-name) { color: var(--token-class-name); }
::highlight(code-token-operator)   { color: var(--token-operator); }
::highlight(code-token-punctuation){ color: var(--token-punctuation); }
::highlight(code-token-comment)    { color: var(--token-comment); font-style: italic; }
::highlight(code-token-regex)      { color: var(--token-regex); }
::highlight(code-token-property)   { color: var(--token-property); }
::highlight(code-token-tag)        { color: var(--token-tag); }
::highlight(code-token-attr-name)  { color: var(--token-attr-name); }
::highlight(code-token-attr-value) { color: var(--token-attr-value); }
::highlight(code-token-builtin)    { color: var(--token-builtin); }
```

Define the `--token-*` CSS variables for both light and dark mode in the same place where existing app palette variables live. Keep the palette restrained — match the muted look of the existing `inline-code` styling rather than introducing a loud rainbow.

### 5. ProgrammableNotePlugin — no changes needed

`ProgrammableNotePlugin` already classifies any `` ```run `` / `` ```mod `` block via `SCRIPT_FENCE_LABELS` and applies the `script-block` class. It continues to work unchanged. The new highlight pass is completely independent and operates on the rendered DOM.

### 6. Tests

- `src/lib/editor/utils/tokenizeCode.spec.ts` (new): assert `tokenizeCode("const x = 1", "javascript")` returns spans with the expected types and offsets; `tokenizeCode("…", "run")` and `tokenizeCode("…", "mod")` produce the same spans as `"javascript"`; unknown language returns `[]`.
- `src/lib/editor/utils/highlight.spec.ts` (new if missing): given a small DOM fixture matching the editor's code-block render shape, `highlightCodeTokens()` registers `Highlight`s with the expected `Range` counts. (jsdom supports `Range`; verify it supports `CSS.highlights` — if not, mock it for the test.)
- Manual: open a note with a `` ```run `` block containing keywords, strings, comments, numbers — confirm tokens are coloured. Type a fresh `` ```json `` block; confirm JSON tokens. Type `` ```yaml `` (not bundled); confirm it stays plain. Add and remove a comment — confirm the highlights update on every keystroke without flicker.

## Files to modify

| File | Change |
|---|---|
| `package.json` | Add `prismjs`, `@types/prismjs` |
| `src/lib/editor/utils/tokenizeCode.ts` | **New** — Prism wrapper, run/mod aliasing, returns flat TokenSpan list |
| `src/lib/editor/utils/highlight.ts` | Add `highlightCodeTokens()` |
| `src/lib/editor/index.tsx` | Call `highlightCodeTokens()` from `OnChangePlugin`'s callback |
| Editor stylesheet | `::highlight(code-token-*)` rules + `--token-*` CSS variables (light + dark) |
| `src/lib/editor/utils/tokenizeCode.spec.ts` | **New** — unit tests for the tokeniser wrapper |
| `src/lib/editor/utils/highlight.spec.ts` | **New** — DOM fixture test for `highlightCodeTokens` |

**No changes** to: `CodeBlockNode`, `BlockTransformPlugin`, `setSubtext`, `getSubtextFromEditor`, `WikilinkPlugin`, `ProgrammableNotePlugin`, Subtext format, on-disk file shape.

## Non-goals / known limitations

- No language-picker UI — language is set purely by the info string at write time.
- No Prism plugins (line numbers, copy buttons, autoloader). Bundled grammars are fixed at build time.
- Inline code (single backtick) is **not** highlighted — it stays the styled `inline-code` it is today.
- The CSS Custom Highlight API supports `color` and `background-color` only — no `font-weight` / `font-style` for tokens. (Comments use `font-style: italic` via the underlying element styling, not the highlight pseudo, if needed.) Acceptable for v1.
- Languages outside the eight bundled grammars render as plain text. Users can request more later.
- Browser support: CSS Custom Highlight API works in all current evergreen browsers (Chrome 105+, Edge 105+, Safari 17.2+). The app's documented target is Chrome / Edge / Brave — fully supported. Firefox lacks support but is not a target browser per `CLAUDE.md`.

## Verification

1. `npm install`, then `npm run dev`.
2. Open a note with a `` ```run `` block containing a few keywords, a string, and a comment. Tokens are coloured; the `script-block` background is intact.
3. Add `` ```json {"k": 1} ``…`` ``` ``; confirm JSON tokens highlight. Add `` ```yaml `` block; confirm it stays plain.
4. Edit a comment / add a string — highlights update on every keystroke.
5. `npm run unit-test`, `npm run lint`, `npm run build` all pass.
