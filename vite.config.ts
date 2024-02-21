import { defineConfig, splitVendorChunkPlugin } from "vite";
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
    splitVendorChunkPlugin(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise
      // in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
    wasmContentTypePlugin,
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // default is ["**\/*.{js,css,html}"] but we'll remove css as
        // we'll only use CSS as public assets
        globPatterns: ["**/*.{js,html}"],
      },
      // public resources to be added to the PWA manifest (with revisions)
      includeAssets: [
        "**/*.{css,woff2,svg,subtext,json,jpg}",
      ],
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
