// Thin typed wrappers around the experimental Web Navigation API
// (Chromium-only; not yet in lib.dom.d.ts). Confines the unavoidable
// @ts-ignore for the global to this module so call sites stay typed.

interface NavigateOptions {
  history?: "push" | "replace";
  state?: unknown;
}

interface NavigationResult {
  committed: Promise<unknown>;
  finished: Promise<unknown>;
}

interface NavigationGlobal extends EventTarget {
  navigate: (path: string, options?: NavigateOptions) => NavigationResult;
  back: () => NavigationResult;
  forward: () => NavigationResult;
  currentEntry: { getState: () => unknown };
  canGoBack: boolean;
  canGoForward: boolean;
}

// @ts-ignore — Web Navigation API not in lib.dom.d.ts yet
const nav = (): NavigationGlobal => navigation;


export const navigateTo = (
  path: string,
  options?: NavigateOptions,
): NavigationResult => {
  return nav().navigate(path, options);
};


export const getCurrentNavigationState = <T>(): T | undefined => {
  return nav().currentEntry.getState() as T | undefined;
};


export const canGoBack = (): boolean => nav().canGoBack;


export const canGoForward = (): boolean => nav().canGoForward;


// Both are no-ops at the respective end of the history.
export const goBack = (): void => {
  if (canGoBack()) nav().back();
};


export const goForward = (): void => {
  if (canGoForward()) nav().forward();
};


/*
  Fires after every same-document navigation, including a push that
  discards the forward entries, so it covers every change of
  canGoBack/canGoForward. Returns an unsubscribe.
*/
export const onCurrentEntryChange = (listener: () => void): () => void => {
  nav().addEventListener("currententrychange", listener);
  return () => nav().removeEventListener("currententrychange", listener);
};
