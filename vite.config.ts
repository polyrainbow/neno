import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
    wasmContentTypePlugin,
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
