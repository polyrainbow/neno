# Bundled fonts

The font files in this directory are third-party Font Software. They are
**not** covered by NENO's Apache-2.0 licence — each is licensed under the
SIL Open Font License, Version 1.1 (OFL-1.1).

OFL-1.1 section 2 requires that every copy of the Font Software carries its
copyright notice and licence, so the licence files below are shipped
alongside the fonts and are served as part of every NENO build.

## IBM Plex Mono

| | |
|---|---|
| Files | `ibm-plex-mono-var-v1-roman.woff2`, `ibm-plex-mono-var-v1-italic.woff2` |
| Version | IBM Plex Mono Var 1.000 (`@ibm/plex-mono-variable@1.0.0`) |
| Copyright | © 2017 IBM Corp., with Reserved Font Name "Plex" |
| Designers | Mike Abbink, Paul van der Laan, Pieter van Rosmalen (Bold Monday) |
| Licence | OFL-1.1 — see [`IBM-Plex-Mono-OFL.txt`](./IBM-Plex-Mono-OFL.txt) |
| Source | <https://github.com/IBM/plex/releases/tag/%40ibm%2Fplex-mono-variable%401.0.0> |

Taken unmodified from `fonts/complete/woff2/` in the release's
`plex-mono-variable.zip`.

"IBM Plex" is a registered trademark of IBM Corp. NENO uses the font only to
render text; the trademark is not used to endorse or promote NENO.

## Mona Sans

| | |
|---|---|
| File | `MonaSansVF[wdth,wght,ital].woff2` |
| Version | Mona Sans VF 2.001 |
| Copyright | © 2022 The Mona Sans Project Authors, with Reserved Font Name "Mona" |
| Designer | Deni Anggara (GitHub) |
| Licence | OFL-1.1 — see [`Mona-Sans-OFL.txt`](./Mona-Sans-OFL.txt) |
| Source | <https://github.com/github/mona-sans> |

## Notes on compliance

- Both fonts are redistributed **unmodified**, in the WOFF2 form published by
  their copyright holders.
- Neither Reserved Font Name is used for a modified version. The CSS in
  `../css/ibm-plex-mono.css` declares the family as `"IBM Plex Mono"`, which
  is a local `@font-face` alias for the unmodified upstream font, not a
  renamed derivative.
- Neither font is sold on its own; both are bundled with the application.
