import { defineConfig } from "vite";
import { builtinModules } from "node:module";

/*
  A sandboxed preload script cannot require() a sibling file, and a
  failure to load one is silent: window.neno simply never appears. Rollup
  splits any module shared between the two entries into its own chunk, so
  guard against that by failing the build if the emitted preload requires
  anything but "electron" and node builtins.
*/
const selfContainedPreloadPlugin = {
  name: "self-contained-preload",
  generateBundle(_options, bundle) {
    const preload = bundle["preload.cjs"];
    if (!preload || preload.type !== "chunk") return;
    const relativeRequires = [
      ...preload.code.matchAll(/require\((["'])(\.[^"']*)\1\)/g),
    ].map((match) => match[2]);
    if (relativeRequires.length > 0) {
      throw new Error(
        "preload.cjs must be self-contained, but it requires "
        + relativeRequires.join(", ")
        + ". Inline the shared code into electron/preload.ts.",
      );
    }
  },
};

/*
  Builds the Electron main process and the preload script. Both must be
  CommonJS: a sandboxed preload cannot be an ES module, and the main
  entry is referenced from package.json's "main" as a .cjs file.
*/
export default defineConfig({
  plugins: [selfContainedPreloadPlugin],
  // public/ belongs to the renderer bundle only.
  publicDir: false,
  build: {
    outDir: "dist-electron",
    emptyOutDir: true,
    target: "node24",
    minify: false,
    sourcemap: true,
    lib: {
      entry: {
        main: "electron/main.ts",
        preload: "electron/preload.ts",
      },
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [
        "electron",
        ...builtinModules,
        ...builtinModules.map((name) => `node:${name}`),
      ],
      output: {
        entryFileNames: "[name].cjs",
        chunkFileNames: "[name].cjs",
      },
    },
  },
});
