/*
  Dev launcher: renders the app icon, builds the Electron main/preload
  bundles, starts the Vite dev server, waits for it to answer, then
  launches Electron pointed at it via NENO_DEV_SERVER_URL. Uses only
  node:child_process so no extra dependency is needed.
*/

import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const PROJECT_ROOT = path.join(import.meta.dirname, "..");
const DEV_BUNDLE_PLIST = path.join(
  PROJECT_ROOT,
  "node_modules/electron/dist/Electron.app/Contents/Info.plist",
);
const APP_DISPLAY_NAME = "NENO";

const DEV_SERVER_URL = "http://localhost:5173";
const STARTUP_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 250;

const children = [];

function run(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });
  children.push(child);
  return child;
}

function shutdown(code) {
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }
  process.exit(code);
}

/*
  macOS takes the application menu's title from the running bundle's
  CFBundleName, which no Electron API can override. In development the
  running bundle is Electron's own, so without this the menu bar reads
  "Electron". The packaged app gets its name from electron-builder's
  productName and needs none of this.

  This patches node_modules, so it is deliberately best-effort: a fresh
  npm install reverts it and the next run simply patches again.
*/
async function nameDevBundle() {
  if (process.platform !== "darwin") return;
  if (!existsSync(DEV_BUNDLE_PLIST)) return;

  for (const key of ["CFBundleName", "CFBundleDisplayName"]) {
    const set = spawn("/usr/libexec/PlistBuddy", [
      "-c", `Set :${key} ${APP_DISPLAY_NAME}`,
      DEV_BUNDLE_PLIST,
    ], { stdio: "ignore" });
    const [code] = await once(set, "exit");
    if (code === 0) continue;
    // The key may not exist yet on a fresh Electron download.
    const add = spawn("/usr/libexec/PlistBuddy", [
      "-c", `Add :${key} string ${APP_DISPLAY_NAME}`,
      DEV_BUNDLE_PLIST,
    ], { stdio: "ignore" });
    await once(add, "exit");
  }
}

async function waitForServer(url) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok || response.status === 404) return;
    } catch {
      // Not up yet.
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  throw new Error(`Dev server did not start at ${url}`);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

await nameDevBundle();

/*
  electron/main.ts sets the dev Dock icon from build/icon.png, since the
  dev bundle carries Electron's own .icns.
*/
const icons = run("npx", ["electron", "tools/buildIcon.mjs"], {
  cwd: PROJECT_ROOT,
});
const [iconsCode] = await once(icons, "exit");
if (iconsCode !== 0) {
  // A missing icon is not worth blocking development over.
  process.stderr.write("Could not render the app icon; continuing.\n");
}

const build = run("npx", [
  "vite", "build", "--config", "vite.electron.config.ts",
]);
const [buildCode] = await once(build, "exit");
if (buildCode !== 0) {
  shutdown(buildCode ?? 1);
}

const vite = run("npx", ["vite", "--port", "5173", "--strictPort"]);
vite.on("exit", (code) => shutdown(code ?? 0));

await waitForServer(DEV_SERVER_URL);

const electron = run("npx", ["electron", "."], {
  env: { ...process.env, NENO_DEV_SERVER_URL: DEV_SERVER_URL },
});
electron.on("exit", (code) => shutdown(code ?? 0));
