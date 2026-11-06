import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const BASEPATH = "/";

const wasmContentTypePlugin = {
  name: "wasm-content-type-plugin",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.endsWith(".wasm")) {
        res.setHeader("Content-Type", "application/wasm");
      }
      next();
    });
  },
};

/*
  A worker started from inside another worker is built twice removed
  from the main bundle, and a Vite upgrade once silently stopped writing
  it out: the notes worker kept a URL to a file that did not exist, its
  parser workers never started and no graph would load — in a production
  build only, so neither the dev server nor the Playwright suite noticed.
  Fail the build instead whenever a script refers to a missing asset.
*/
const referencedScriptsExistPlugin = {
  name: "referenced-scripts-exist",
  apply: "build" as const,
  writeBundle(options: { dir?: string }) {
    const outDir = options.dir ?? "dist";
    const assetsDir = path.join(outDir, "assets");
    if (!existsSync(assetsDir)) return;
    const missing = new Set<string>();
    for (const file of readdirSync(assetsDir)) {
      if (!file.endsWith(".js")) continue;
      const code = readFileSync(path.join(assetsDir, file), "utf8");
      for (const [, ref] of code.matchAll(/["'`]\/(assets\/[^"'`]+\.js)/g)) {
        if (!existsSync(path.join(outDir, ref))) {
          missing.add(`${ref} (referenced by assets/${file})`);
        }
      }
    }
    if (missing.size > 0) {
      throw new Error(
        "The build refers to scripts it did not write: "
        + [...missing].join(", "),
      );
    }
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasmContentTypePlugin,
    referencedScriptsExistPlugin,
  ],
  worker: {
    format: "es",
  },
  build: {
    target: "esnext",
    minify: false,
  },
  base: BASEPATH,
  define: {
    APP_VERSION: `"${process.env.npm_package_version}"`,
  },
});
