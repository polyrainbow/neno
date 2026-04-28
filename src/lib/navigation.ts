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

interface NavigationGlobal {
  navigate: (path: string, options?: NavigateOptions) => NavigationResult;
  currentEntry: { getState: () => unknown };
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
