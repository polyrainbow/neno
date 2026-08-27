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
  How many times one user action may correct itself — skipping the
  phantom, then re-stepping a search that did not move. A bound, because
  each correction issues a fresh search and so a fresh request id.
*/
const MAX_CORRECTIONS = 2;

/*
  How long the input goes quiet before the search runs. This is what
  keeps typing safe rather than merely recoverable: findInPage takes
  focus when it lands on a match, so a search running between two
  keystrokes is a race for the caret that the typist sometimes loses.
  Waiting for a pause means no search is ever in flight mid-word.
*/
const TYPING_DEBOUNCE_MS = 220;

const FindBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<FindResult | null>(null);
  const resultRef = useRef<FindResult | null>(null);
  /* Bumped on every open so re-opening re-selects the term. */
  const [focusToken, setFocusToken] = useState<number>(0);

  const barRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryRef = useRef<string>("");
  const isOpenRef = useRef<boolean>(false);
  const isSearching = useRef<boolean>(false);
  const newestRequestId = useRef<number>(0);
  const lastDirection = useRef<boolean>(true);
  /*
    Whether the input should keep focus through the search in flight.
    Armed when the user types, released once that search reports back —
    so the hold lasts exactly as long as the search does, however long
    a big graph takes, and nothing is fought over afterwards. Stepping
    never arms it: it needs the page selection to stay where findInPage
    put it.
  */
  const holdFocus = useRef<boolean>(true);
  /* Guards against skipping twice on the same streamed request. */
  const skippedRequestId = useRef<number>(0);
  /*
    Where the previous result sat, so a step that does not move can be
    told apart from one that does.
  */
  const ordinalBeforeStep = useRef<number>(0);
  const lastWasNewSession = useRef<boolean>(true);
  const corrections = useRef<number>(0);
  const debounceTimeout = useRef<number | undefined>(undefined);
  /* Set once the user takes focus out of the bar deliberately. */
  const userLeftBar = useRef<boolean>(false);
  const elementFocusedBeforeOpen = useRef<HTMLElement | null>(null);

  queryRef.current = query;
  isOpenRef.current = isOpen;
  resultRef.current = result;

  const search = useCallback((
    text: string,
    forward: boolean,
    newSession: boolean,
    keepFocus: boolean,
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
    holdFocus.current = keepFocus;
    if (!newSession) {
      ordinalBeforeStep.current = resultRef.current?.activeMatchOrdinal ?? 0;
    }

    void getBridge().findInPage({ text, forward, newSession });
  }, []);

  /*
    Typing: a fresh search that must not cost the input its focus, and
    that waits for the typist to pause. An emptied box clears the
    highlight straight away — there is nothing to race.
  */
  const searchWhileTyping = useCallback((text: string): void => {
    window.clearTimeout(debounceTimeout.current);
    corrections.current = 0;

    if (text.length === 0) {
      search(text, true, true, true);
      return;
    }

    debounceTimeout.current = window.setTimeout(() => {
      search(text, true, true, true);
    }, TYPING_DEBOUNCE_MS);
  }, [search]);

  /*
    Stepping: focus goes to the match, which is where the user asked.
    Anything still pending would search the same text a moment later and
    undo the step, so it is dropped.
  */
  const stepToMatch = useCallback((forward: boolean): void => {
    window.clearTimeout(debounceTimeout.current);
    corrections.current = 0;
    search(queryRef.current, forward, false, false);
  }, [search]);

  const open = useCallback((): void => {
    if (!isOpenRef.current) {
      elementFocusedBeforeOpen.current
        = document.activeElement as HTMLElement | null;
      userLeftBar.current = false;
      setIsOpen(true);
      /* Chrome-like: re-opening keeps the term and highlights it again. */
      if (queryRef.current.length > 0) {
        searchWhileTyping(queryRef.current);
      }
    }
    setFocusToken((token) => token + 1);
  }, [searchWhileTyping]);

  const close = useCallback((): void => {
    setIsOpen(false);
    setResult(null);
    isSearching.current = false;
    holdFocus.current = true;
    window.clearTimeout(debounceTimeout.current);
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
      if (holdFocus.current && input && document.activeElement !== input) {
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
        && corrections.current < MAX_CORRECTIONS
      ) {
        skippedRequestId.current = incoming.requestId;
        corrections.current += 1;
        search(
          queryRef.current,
          lastDirection.current,
          false,
          holdFocus.current,
        );
        return;
      }

      setResult(incoming);
      /* The search reported back, so the hold has served its purpose. */
      holdFocus.current = false;
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
      stepToMatch(command === "next");
    });
  }, [open, stepToMatch]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isOpen, focusToken]);

  /*
    Holding focus is about findInPage stealing it, never about the user
    choosing to go elsewhere. A press outside the bar is that choice, so
    it releases the hold before the blur handler can fight it, and marks
    the bar as left so the recovery below stops reclaiming keystrokes.
  */
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (target && barRef.current?.contains(target)) return;
      holdFocus.current = false;
      userLeftBar.current = true;
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [isOpen]);

  /*
    findInPage takes focus when it lands on a match, and where it leaves
    it is not something to rely on — document.body while stepping here,
    but the match's own container is just as possible. So this does not
    test for one landing spot: while the bar is open and the user has
    not left it themselves, any keystroke arriving outside the bar
    belongs to the bar. That also keeps stray keys out of the note.
  */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (userLeftBar.current) return;
      const active = document.activeElement;
      if (active && barRef.current?.contains(active)) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Enter") {
        e.preventDefault();
        stepToMatch(!e.shiftKey);
      } else if (
        e.key.length === 1
        && !e.metaKey && !e.ctrlKey && !e.altKey
      ) {
        e.preventDefault();
        const next = queryRef.current + e.key;
        inputRef.current?.focus();
        setQuery(next);
        searchWhileTyping(next);
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen, close, stepToMatch, searchWhileTyping]);

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

  return <div className="find-bar" role="search" ref={barRef}>
    <input
      ref={inputRef}
      type="text"
      className="find-bar-input"
      value={query}
      aria-label={l("find.placeholder")}
      placeholder={l("find.placeholder")}
      onChange={(e) => {
        setQuery(e.target.value);
        searchWhileTyping(e.target.value);
      }}
      onBlur={() => {
        /*
          findInPage selects the match it lands on, which pulls focus out
          of the input; mid-word that silently swallows the next
          keystroke. Blur fires in the same task as the steal, so taking
          focus back here closes the gap the result event cannot.
        */
        if (holdFocus.current) inputRef.current?.focus();
      }}
      onKeyDown={(e) => {
        /* The app's global shortcuts listen on document.body. */
        e.stopPropagation();

        if (e.key === "Tab") {
          /* Leaving on purpose, so stop holding on to focus. */
          holdFocus.current = false;
          userLeftBar.current = true;
        } else if (e.key === "Escape") {
          e.preventDefault();
          close();
        } else if (e.key === "Enter") {
          e.preventDefault();
          stepToMatch(!e.shiftKey);
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
      onClick={() => stepToMatch(false)}
    />
    <IconButton
      icon="arrow_downward"
      title={l("find.next")}
      disableTooltip={true}
      disabled={!hasQuery}
      onClick={() => stepToMatch(true)}
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
