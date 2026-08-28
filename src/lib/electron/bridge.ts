/*
  Accessor for the `window.neno` surface that electron/preload.ts
  exposes. Kept in one place so the rest of the app never reaches for a
  global directly, and so the unit tests (which run in jsdom, without a
  preload) get a clear error instead of a TypeError.
*/

import { NenoBridge } from "./bridgeTypes";

declare global {
  interface Window {
    neno?: NenoBridge;
  }
}

export function isElectron(): boolean {
  return typeof window !== "undefined"
    && typeof window.neno === "object"
    && window.neno !== null;
}

export function getBridge(): NenoBridge {
  const bridge = typeof window !== "undefined" ? window.neno : undefined;
  if (!bridge) {
    throw new Error(
      "NENO's Electron bridge is unavailable — is the preload loaded?",
    );
  }
  return bridge;
}
