#!/bin/bash

: '
Renders the app logo to build/icon.png at 1024x1024.
electron-builder derives the .icns for the macOS bundle from that file.

Prefers rsvg-convert (brew install librsvg); falls back to rendering the
SVG through a PDF with the macOS built-ins qlmanage/sips.
'

set -e

SCRIPT_DIRECTORY="$( cd "$( dirname "$0" )" && pwd )"
ROOT_DIRECTORY="$( cd "$SCRIPT_DIRECTORY/.." && pwd )"
SOURCE="$ROOT_DIRECTORY/public/assets/app-icon/logo.svg"
TARGET_DIRECTORY="$ROOT_DIRECTORY/build"
TARGET="$TARGET_DIRECTORY/icon.png"

mkdir -p "$TARGET_DIRECTORY"

if command -v rsvg-convert > /dev/null 2>&1; then
  echo "Rendering icon with rsvg-convert ..."
  rsvg-convert -w 1024 -h 1024 -o "$TARGET" "$SOURCE"
elif command -v qlmanage > /dev/null 2>&1; then
  echo "Rendering icon with qlmanage/sips ..."
  TMP_DIRECTORY="$(mktemp -d)"
  qlmanage -t -s 1024 -o "$TMP_DIRECTORY" "$SOURCE" > /dev/null
  RENDERED="$(find "$TMP_DIRECTORY" -name '*.png' | head -n 1)"
  if [ -z "$RENDERED" ]; then
    echo "qlmanage did not produce a PNG." >&2
    exit 1
  fi
  sips -z 1024 1024 "$RENDERED" --out "$TARGET" > /dev/null
  rm -rf "$TMP_DIRECTORY"
else
  echo "Neither rsvg-convert nor qlmanage is available." >&2
  echo "Install librsvg (brew install librsvg) and try again." >&2
  exit 1
fi

echo "Wrote $TARGET"
