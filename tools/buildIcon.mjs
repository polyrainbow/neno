/*
  Renders public/assets/app-icon/logo.svg to a 1024x1024 build/icon.png.
  electron-builder derives the macOS .icns from that file, and
  electron/main.ts uses it for the Dock icon in development.

  The renderer is Electron's own Chromium, run as a one-shot Electron
  app. That is deliberate: the logo positions the bars of its "N" with
  the `transform-origin` presentation attribute, which librsvg
  (rsvg-convert) silently ignores — it rotates about the origin instead,
  throwing the middle bar off the canvas. Chromium honours it, so the
  icon comes out identical to what a browser shows.

  The rasterizing goes through a <canvas>, not webContents.capturePage():
  a captured window is composited for the display, which converts the
  pixels into its gamut (Display P3 on modern Macs) and visibly
  desaturates the logo. A canvas stays in sRGB.

  Run with:  npx electron tools/buildIcon.mjs
*/

import { app, BrowserWindow } from "electron";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const SIZE = 1024;
const PROJECT_ROOT = path.join(import.meta.dirname, "..");
const SOURCE = path.join(
  PROJECT_ROOT, "public", "assets", "app-icon", "logo.svg",
);
const BUILD_DIR = path.join(PROJECT_ROOT, "build");
const TARGET = path.join(BUILD_DIR, "icon.png");

/*
  Runs in the page. Resizes the SVG to the target size so Chromium
  rasterizes it at full resolution rather than scaling up a 75px bitmap,
  then draws it on an sRGB canvas and hands back the PNG.
*/
const RENDER_SCRIPT = `(async () => {
  const size = ${SIZE};
  const source = document.getElementById("svg-source").textContent;
  const doc = new DOMParser().parseFromString(source, "image/svg+xml");
  const svg = doc.documentElement;
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  const serialized = new XMLSerializer().serializeToString(svg);

  const image = new Image();
  image.src = "data:image/svg+xml;charset=utf-8,"
    + encodeURIComponent(serialized);
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { colorSpace: "srgb" });
  context.drawImage(image, 0, 0, size, size);
  return canvas.toDataURL("image/png");
})()`;

async function render() {
  const svg = await readFile(SOURCE, "utf8");

  /*
    Served from a file:// URL rather than a data: URL, so the document
    has a real origin and drawing the SVG does not taint the canvas.
  */
  const temporaryDirectory = await mkdtemp(
    path.join(os.tmpdir(), "neno-icon-"),
  );
  const page = path.join(temporaryDirectory, "render.html");
  await writeFile(
    page,
    "<!doctype html><meta charset=\"utf-8\">"
    + "<script type=\"text/plain\" id=\"svg-source\">"
    + svg
    + "</script>",
    "utf8",
  );

  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  try {
    await window.loadFile(page);
    const dataUrl = await window.webContents.executeJavaScript(RENDER_SCRIPT);
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
    if (base64 === dataUrl) {
      throw new Error("Unexpected canvas output");
    }
    await mkdir(BUILD_DIR, { recursive: true });
    await writeFile(TARGET, Buffer.from(base64, "base64"));
  } finally {
    window.destroy();
    await rm(temporaryDirectory, { recursive: true, force: true });
  }

  process.stdout.write(`Wrote ${TARGET}\n`);
}

app.whenReady()
  .then(render)
  .then(() => app.exit(0))
  .catch((e) => {
    process.stderr.write(`Could not render the app icon: ${e.message}\n`);
    app.exit(1);
  });
