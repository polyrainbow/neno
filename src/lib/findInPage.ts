/*
  The match arithmetic behind the find bar (src/components/FindBar.tsx),
  kept pure so the awkward cases have tests.

  Chromium's findInPage searches everything the window renders, and the
  find bar is part of that: the term sits in the bar's own input, so
  every search matches once more than the page really contains. That
  phantom is what all of this is about. The bar is the last element in
  the body, so the phantom is always the last match.
*/

import { FindResult } from "./electron/bridgeTypes";

/** The bar's own input, which matches whatever the user typed. */
const PHANTOM_MATCHES = 1;

/** Matches the user should be told about: everything but the phantom. */
export function getVisibleTotal(result: FindResult): number {
  return Math.max(result.matches - PHANTOM_MATCHES, 0);
}

/** Position of the current match within the visible total. */
export function getVisibleOrdinal(result: FindResult): number {
  return Math.min(result.activeMatchOrdinal, getVisibleTotal(result));
}

/**
 * Whether stepping landed on the bar's own input. The phantom is the
 * last match, so it is active exactly when the ordinal is the total —
 * and skipping past it only makes sense when a real match exists.
 */
export function isOnPhantom(result: FindResult): boolean {
  return result.matches > 1
    && result.activeMatchOrdinal === result.matches;
}

/**
 * Whether a step failed to move, which means the search was anchored on
 * the find input rather than on the current match — what happens after
 * focus is taken back from a new-session search. Stepping once more in
 * the same direction lands where the user meant to go.
 *
 * Needs more than one real match: with exactly one, a step legitimately
 * stays put, and stepping again would never terminate.
 */
export function isStuckStep(
  result: FindResult,
  previousOrdinal: number,
  wasNewSession: boolean,
): boolean {
  return !wasNewSession
    && getVisibleTotal(result) > 1
    && result.activeMatchOrdinal === previousOrdinal;
}
