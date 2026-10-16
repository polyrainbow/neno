// Thin typed wrappers around the experimental Web Navigation API
// (Chromium-only; not yet in lib.dom.d.ts). Confines the unavoidable
// @ts-ignore for the global to this module so call sites stay typed.

/*
  Travels with a navigation as its `info` and reaches the router's
  navigate listener, unlike `state`, which is stored on the history entry.
*/
export interface NavigationInfo {
  /*
    The Navigation API scrolls the document to the top after an
    intercepted push or replace. Saving a note navigates to its URL, but
    the user stays where they were, so a save opts out.
  */
  keepScrollPosition?: boolean;
}

interface NavigateOptions {
  history?: "push" | "replace";
  state?: unknown;
  info?: NavigationInfo;
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
