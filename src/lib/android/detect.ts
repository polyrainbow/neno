/*
  Whether this page runs inside the Android app's Capacitor shell. Kept
  apart from AndroidBridge.ts so the check costs the desktop and browser
  bundles nothing: Capacitor's native side injects `window.Capacitor`
  before any page script runs, so no import is needed to ask.
*/
export function isCapacitorAndroid(): boolean {
  if (typeof window === "undefined") return false;
  const capacitor = (window as {
    Capacitor?: { getPlatform?: () => string };
  }).Capacitor;
  return capacitor?.getPlatform?.() === "android";
}

/*
  What the app needs of the WebView it runs in: Chrome 122. The router
  stands on the Navigation API, find and code highlighting on the CSS
  Custom Highlight API, and the code — built for esnext, as the desktop's
  Chromium is always current — on iterator helpers, the Set methods and
  Promise.withResolvers. Android updates its WebView through the Play
  Store; one that never did (an emulator image without Play, a device
  without Google services) lacks some of these, and the app would fail
  in places instead of saying why.
*/
export function hasRequiredWebFeatures(): boolean {
  const iterator = (globalThis as { Iterator?: { prototype: object } })
    .Iterator;
  return "navigation" in window
    && typeof CSS !== "undefined"
    && "highlights" in CSS
    && iterator !== undefined
    && "map" in iterator.prototype
    && "union" in Set.prototype
    && "withResolvers" in Promise;
}
