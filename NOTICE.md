# Third-party notices

NENO itself is licensed under the Apache License 2.0 (see [`LICENSE`](./LICENSE)).
The components listed here are redistributed as part of NENO under their own
licences, which take precedence over Apache-2.0 for those files.

## Fonts

Both bundled fonts are licensed under the SIL Open Font License, Version 1.1
(OFL-1.1) and are redistributed unmodified. OFL-1.1 section 2 requires the
copyright notice and licence to accompany every copy, so the full licence
texts live next to the font files in
[`public/assets/fonts/`](./public/assets/fonts/) and are served as part of
every build. See [`public/assets/fonts/README.md`](./public/assets/fonts/README.md)
for details.

### IBM Plex Mono

> Copyright © 2017 IBM Corp. with Reserved Font Name "Plex"

- Version: IBM Plex Mono Var 1.000 (`@ibm/plex-mono-variable@1.0.0`)
- Licence: OFL-1.1 — `public/assets/fonts/IBM-Plex-Mono-OFL.txt`
- Source: <https://github.com/IBM/plex>

"IBM Plex" is a registered trademark of IBM Corp.

### Mona Sans

> Copyright 2022 The Mona Sans Project Authors
> (https://github.com/github/mona-sans), with Reserved Font Name "Mona"

- Version: Mona Sans VF 2.001
- Licence: OFL-1.1 — `public/assets/fonts/Mona-Sans-OFL.txt`
- Source: <https://github.com/github/mona-sans>

## Bundled npm dependencies

Production dependencies are declared in [`package.json`](./package.json) and
ship their licence texts in their own packages under `node_modules/`. One is
worth calling out because it puts an additional font into the build output:

### Codicons (via `monaco-editor`)

`monaco-editor` bundles `codicon.ttf`, which Vite emits into
`dist/assets/`. It is redistributed under the terms of `monaco-editor`
(MIT, © Microsoft Corporation); see `node_modules/monaco-editor/LICENSE`.
The upstream icon set is published at
<https://github.com/microsoft/vscode-codicons> under CC-BY-4.0.
