import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";
import { VitePWA } from "vite-plugin-pwa";

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
    // eslint-disable-next-line new-cap
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        "name": "NENO",
        "theme_color": "#ff8598",
        "background_color": "#46b8ff",
        "display": "standalone",
        "start_url": ".",
        "icons": [
          {
            "src": `${BASEPATH}assets/app-icon/logo.svg`,
            "sizes": "48x48 72x72 96x96 128x128 256x256 512x512",
            "type": "image/svg+xml",
            "purpose": "any",
          },
        ],
      },
    }),
  ],
  worker: {
    format: "es",
  },
  build: {
    target: "esnext",
    minify: false,
  },
  base: BASEPATH,
});
