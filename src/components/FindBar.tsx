/*
  Find-on-page bar, Electron only.

  In a browser Cmd-F is the browser's own find and this renders nothing.
  Electron ships no find bar of its own, so the Edit menu drives this one
  (electron/findInPage.ts) and the search itself runs through Chromium's
  findInPage, which owns the highlighting and the scrolling.

  findInPage searches everything the window renders, and this bar is part
  of that — the term sitting in the input below matches itself, once, on
  every search. (The match counter would match too, which is why it is
  drawn as CSS generated content; the input cannot be, so it is the only
  phantom left.) A browser's own find bar escapes this by living outside
  the page; the only equivalent here would be a second WebContentsView.
  Instead that phantom is accounted for: the bar is the last element in
  the body, so the phantom is always the last match, which makes it
  subtractable from the total and skippable when stepping lands on it.
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { getBridge, isElectron } from "../lib/electron/bridge";
import { FindResult } from "../lib/electron/bridgeTypes";
import {
  getVisibleOrdinal,
  getVisibleTotal,
  isOnPhantom,
  isStuckStep,
} from "../lib/findInPage";
import { l } from "../lib/intl";
import IconButton from "./IconButton";

/*
  How long after issuing a search a blur is still attributable to
  findInPage. Long enough to cover the round trip, short enough that a
  deliberate click into the page is never fought over.
*/
const THEFT_WINDOW_MS = 400;

const FindBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<FindResult | null>(null);
  const resultRef = useRef<FindResult | null>(null);
  /* Bumped on every open so re-opening re-selects the term. */
  const [focusToken, setFocusToken] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryRef = useRef<string>("");
  const isOpenRef = useRef<boolean>(false);
  const isSearching = useRef<boolean>(false);
  const newestRequestId = useRef<number>(0);
  const lastDirection = useRef<boolean>(true);
  /*
    Open only between issuing a search and its first result — the window
    in which a blur can be blamed on findInPage rather than on the user
    clicking into the page.
  */
  const expectFocusTheft = useRef<boolean>(false);
  const theftTimeout = useRef<number | undefined>(undefined);
  /* Guards against skipping twice on the same streamed request. */
  const skippedRequestId = useRef<number>(0);
  /*
    Where the previous result sat, so a step that does not move can be
    told apart from one that does.
  */
  const ordinalBeforeStep = useRef<number>(0);
  const lastWasNewSession = useRef<boolean>(true);
  const elementFocusedBeforeOpen = useRef<HTMLElement | null>(null);

  queryRef.current = query;
  isOpenRef.current = isOpen;
  resultRef.current = result;

  const search = useCallback((
    text: string,
    forward: boolean,
    newSession: boolean,
  ): void => {
    if (text.length === 0) {
      isSearching.current = false;
      setResult(null);
      void getBridge().stopFindInPage();
      return;
    }
    isSearching.current = true;
    lastDirection.current = forward;
    lastWasNewSession.current = newSession;
    if (!newSession) {
      ordinalBeforeStep.current = resultRef.current?.activeMatchOrdinal ?? 0;
    }

    /*
      Only for a new session. Chromium anchors "the match after this one"
      on the page selection, so taking focus back after a step would
      reset stepping to the first match every time.
    */
    expectFocusTheft.current = newSession;
    window.clearTimeout(theftTimeout.current);
    theftTimeout.current = window.setTimeout(() => {
      expectFocusTheft.current = false;
    }, THEFT_WINDOW_MS);

    void getBridge().findInPage({ text, forward, newSession });
  }, []);

  const open = useCallback((): void => {
    if (!isOpenRef.current) {
      elementFocusedBeforeOpen.current
        = document.activeElement as HTMLElement | null;
      setIsOpen(true);
      /* Chrome-like: re-opening keeps the term and highlights it again. */
      if (queryRef.current.length > 0) {
        search(queryRef.current, true, true);
      }
    }
    setFocusToken((token) => token + 1);
  }, [search]);

  const close = useCallback((): void => {
    setIsOpen(false);
    setResult(null);
    isSearching.current = false;
    expectFocusTheft.current = false;
    window.clearTimeout(theftTimeout.current);
    void getBridge().stopFindInPage();

    const previous = elementFocusedBeforeOpen.current;
    elementFocusedBeforeOpen.current = null;
    if (previous?.isConnected) previous.focus();
  }, []);

  useEffect(() => {
    if (!isElectron()) return;

    return getBridge().onFindResult((incoming: FindResult) => {
      /*
        Results stream in while Chromium walks the document, and a slow
        one from an abandoned search can land after a newer search has
        started. Request ids only ever grow, so the newest one wins; the
        counter is never reset, so a result from before a cleared search
        can never win either.
      */
      if (!isSearching.current) return;
      if (incoming.requestId < newestRequestId.current) return;
      newestRequestId.current = incoming.requestId;

      /*
        Backstop for the blur handler below, for the case where focus
        went somewhere that did not blur the input.
      */
      const input = inputRef.current;
      if (
        expectFocusTheft.current
        && input
        && document.activeElement !== input
      ) {
        input.focus();
      }

      /*
        Stepping landed on the bar's own input, or did not move at all.
        Either way one more step in the same direction is what the user
        asked for; Chromium wraps, so this always terminates.
      */
      if (
        (
          isOnPhantom(incoming)
          || isStuckStep(
            incoming,
            ordinalBeforeStep.current,
            lastWasNewSession.current,
          )
        )
        && skippedRequestId.current !== incoming.requestId
      ) {
        skippedRequestId.current = incoming.requestId;
        search(queryRef.current, lastDirection.current, false);
        return;
      }

      setResult(incoming);
    });
  }, [search]);

  useEffect(() => {
    if (!isElectron()) return;

    return getBridge().onFindCommand((command) => {
      if (
        command === "open"
        || !isOpenRef.current
        || queryRef.current.length === 0
      ) {
        open();
        return;
      }
      search(queryRef.current, command === "next", false);
    });
  }, [open, search]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isOpen, focusToken]);

  /*
    Stepping leaves focus on nothing — findInPage selects the match, and
    document.body ends up active — so Escape, Enter and further typing
    would fall on the floor. Reclaim them, but only from that state: if
    the user deliberately clicked into the editor then activeElement is
    the editor, and the bar stays out of the way.
  */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== document.body) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Enter") {
        e.preventDefault();
        search(queryRef.current, !e.shiftKey, false);
      } else if (
        e.key.length === 1
        && !e.metaKey && !e.ctrlKey && !e.altKey
      ) {
        e.preventDefault();
        const next = queryRef.current + e.key;
        inputRef.current?.focus();
        setQuery(next);
        search(next, true, true);
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen, close, search]);

  if (!isElectron() || !isOpen) return null;

  const hasQuery = query.length > 0;
  const status = !hasQuery || !result
    ? ""
    : getVisibleTotal(result) === 0
      ? l("find.no-results")
      : l("find.matches", {
        active: getVisibleOrdinal(result).toString(),
        total: getVisibleTotal(result).toString(),
      });

  return <div className="find-bar" role="search">
    <input
      ref={inputRef}
      type="text"
      className="find-bar-input"
      value={query}
      aria-label={l("find.placeholder")}
      placeholder={l("find.placeholder")}
      onChange={(e) => {
        setQuery(e.target.value);
        search(e.target.value, true, true);
      }}
      onBlur={() => {
        /*
          findInPage selects the match it lands on, which pulls focus out
          of the input; mid-word that silently swallows the next
          keystroke. Blur fires in the same task as the steal, so taking
          focus back here closes the gap the result event cannot.
        */
        if (expectFocusTheft.current) inputRef.current?.focus();
      }}
      onKeyDown={(e) => {
        /* The app's global shortcuts listen on document.body. */
        e.stopPropagation();

        if (e.key === "Escape") {
          e.preventDefault();
          close();
        } else if (e.key === "Enter") {
          e.preventDefault();
          search(query, !e.shiftKey, false);
        }
      }}
    />
    {/*
      The status is CSS generated content, which findInPage does not
      search — as rendered text it would match the term itself for a
      query like "of", and the count would climb on every step.
    */}
    <span
      className="find-bar-status"
      role="status"
      data-status={status}
    ></span>
    <IconButton
      icon="arrow_upward"
      title={l("find.previous")}
      disableTooltip={true}
      disabled={!hasQuery}
      onClick={() => search(query, false, false)}
    />
    <IconButton
      icon="arrow_downward"
      title={l("find.next")}
      disableTooltip={true}
      disabled={!hasQuery}
      onClick={() => search(query, true, false)}
    />
    <IconButton
      icon="close"
      title={l("find.close")}
      disableTooltip={true}
      onClick={close}
    />
  </div>;
};

export default FindBar;
