/*
  Dev launcher: builds the Electron main/preload bundles, starts the Vite
  dev server, waits for it to answer, then launches Electron pointed at
  it via NENO_DEV_SERVER_URL. Uses only node:child_process so no extra
  dependency is needed.
*/

import { spawn } from "node:child_process";
import { once } from "node:events";
import process from "node:process";

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
