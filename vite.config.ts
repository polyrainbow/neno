import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise
      // in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
    wasmContentTypePlugin,
  ],
  worker: {
    format: "es",
  },
  build: {
    target: "esnext",
    minify: false,
  },
  base: "/",
});
