/*
  Accessor for the `window.neno` surface. Two native hosts provide it:
  electron/preload.ts in the desktop app and src/lib/android/
  AndroidBridge.ts in the Android app. Kept in one place so the rest of
  the app never reaches for a global directly, and so the unit tests
  (which run in jsdom, without either host) get a clear error instead of
  a TypeError.

  - hasNativeHost(): storage, git, sync and file dialogs go through the
    bridge — true on both hosts, false in the browser's OPFS mode.
  - isElectron(): the desktop app only — menu-driven features (find bar,
    Go menu), mouse side buttons and trackpad swipes.
*/

import { NenoBridge } from "./bridgeTypes";

declare global {
  interface Window {
    neno?: NenoBridge;
  }
}

export function hasNativeHost(): boolean {
  return typeof window !== "undefined"
    && typeof window.neno === "object"
    && window.neno !== null;
}

export function isElectron(): boolean {
  return hasNativeHost() && window.neno?.platform === "electron";
}

export function isAndroid(): boolean {
  return hasNativeHost() && window.neno?.platform === "android";
}

export function getBridge(): NenoBridge {
  const bridge = typeof window !== "undefined" ? window.neno : undefined;
  if (!bridge) {
    throw new Error(
      "NENO's native bridge is unavailable — is the preload loaded?",
    );
  }
  return bridge;
}
