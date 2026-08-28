import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

/*
  Unit tests live next to the code they cover, which since the Electron
  rewrite means two roots: the renderer sources in src/ and the main
  process sources in electron/.
*/
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: [
        "src/**/*.spec.{ts,tsx}",
        "electron/**/*.spec.{ts,tsx}",
      ],
      // Individual specs opt into jsdom with a
      // `// @vitest-environment jsdom` comment.
      environment: "node",
    },
  }),
);
