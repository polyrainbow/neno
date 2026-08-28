/*
  Find-in-note bar, Electron only.

  In a browser Cmd-F is the browser's own find and this renders nothing.
  Electron ships no find bar of its own, so the Edit menu drives this
  one (electron/findMenu.ts) and the search runs entirely in the
  renderer (src/lib/findInEditor.ts), over the active editor and nothing
  else. Searching the whole graph is what the search bar is for.

  Because the search never touches the selection, none of what a
  findInPage-based bar has to defend against applies here: nothing
  steals focus from the input, so nothing has to be taken back, and the
  input keeps the caret through every search and every step. The bar
  also cannot find itself, so there is no phantom match to subtract.
*/

import { useCallback, useEffect, useRef, useState } from "react";
import { getBridge, isElectron } from "../lib/electron/bridge";
import {
  clearFindHighlights,
  setFindHighlights,
} from "../lib/editor/utils/highlight";
import {
  getActiveEditorElement,
  getMatchRanges,
  getSteppedIndex,
  scrollRangeIntoView,
} from "../lib/findInEditor";
import { l } from "../lib/intl";
import IconButton from "./IconButton";

/*
  How long editing the note goes quiet before the matches are rebuilt.
  Lexical replaces the text nodes a Range points at, so the ranges from
  before an edit stop resolving and their highlights vanish; rebuilding
  puts them back. This is a repaint, never a jump — only what the user
  asks for scrolls.
*/
const RESYNC_DEBOUNCE_MS = 120;

const FindBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  /* Bumped on every open so re-opening re-selects the term. */
  const [focusToken, setFocusToken] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const matches = useRef<Range[]>([]);
  const queryRef = useRef<string>("");
  const activeIndexRef = useRef<number>(0);
  const isOpenRef = useRef<boolean>(false);
  const resyncTimeout = useRef<number | undefined>(undefined);
  const elementFocusedBeforeOpen = useRef<HTMLElement | null>(null);

  queryRef.current = query;
  isOpenRef.current = isOpen;
  activeIndexRef.current = activeIndex;

  /*
    Runs the search and paints the result. `preferredIndex` is the match
    to land on if it still exists, which is how a rebuild after an edit
    keeps the user where they were.
  */
  const runSearch = useCallback((
    text: string,
    preferredIndex: number,
    scroll: boolean,
  ): void => {
    const editor = getActiveEditorElement();
    const ranges = editor ? getMatchRanges(editor, text) : [];
    matches.current = ranges;

    const index = ranges.length === 0
      ? 0
      : Math.min(Math.max(preferredIndex, 0), ranges.length - 1);

    activeIndexRef.current = index;
    setTotal(ranges.length);
    setActiveIndex(index);
    setFindHighlights(ranges, index);

    if (scroll && ranges.length > 0) {
      scrollRangeIntoView(ranges[index]);
    }
  }, []);

  const stepToMatch = useCallback((forward: boolean): void => {
    const ranges = matches.current;
    if (ranges.length === 0) return;

    const index = getSteppedIndex(
      activeIndexRef.current,
      ranges.length,
      forward,
    );
    activeIndexRef.current = index;
    setActiveIndex(index);
    setFindHighlights(ranges, index);
    scrollRangeIntoView(ranges[index]);
  }, []);

  const open = useCallback((): void => {
    if (!isOpenRef.current) {
      elementFocusedBeforeOpen.current
        = document.activeElement as HTMLElement | null;
      setIsOpen(true);
      /* Chrome-like: re-opening keeps the term and highlights it again. */
      runSearch(queryRef.current, 0, true);
    }
    setFocusToken((token) => token + 1);
  }, [runSearch]);

  const close = useCallback((): void => {
    setIsOpen(false);
    setTotal(0);
    setActiveIndex(0);
    activeIndexRef.current = 0;
    matches.current = [];
    window.clearTimeout(resyncTimeout.current);
    clearFindHighlights();

    const previous = elementFocusedBeforeOpen.current;
    elementFocusedBeforeOpen.current = null;
    if (previous?.isConnected) previous.focus();
  }, []);

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
    Editing the note, switching to another one and a transclusion
    arriving all invalidate the ranges. Watching the document catches
    every one of them without the bar having to know which view it is
    sitting on, and it cannot feed itself: the state it writes back is
    two numbers, so a rebuild that finds what the last one found
    re-renders nothing and mutates nothing.
  */
  useEffect(() => {
    if (!isOpen) return;

    const observer = new MutationObserver(() => {
      window.clearTimeout(resyncTimeout.current);
      resyncTimeout.current = window.setTimeout(() => {
        runSearch(queryRef.current, activeIndexRef.current, false);
      }, RESYNC_DEBOUNCE_MS);
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      window.clearTimeout(resyncTimeout.current);
    };
  }, [isOpen, runSearch]);

  useEffect(() => clearFindHighlights, []);

  if (!isElectron() || !isOpen) return null;

  const hasQuery = query.length > 0;
  const status = !hasQuery
    ? ""
    : total === 0
      ? l("find.no-results")
      : l("find.matches", {
        active: (activeIndex + 1).toString(),
        total: total.toString(),
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
        runSearch(e.target.value, 0, true);
      }}
      onKeyDown={(e) => {
        /* The app's global shortcuts listen on document.body. */
        e.stopPropagation();

        if (e.key === "Escape") {
          e.preventDefault();
          close();
        } else if (e.key === "Enter") {
          e.preventDefault();
          stepToMatch(!e.shiftKey);
        }
      }}
    />
    <span className="find-bar-status" role="status">{status}</span>
    <IconButton
      icon="arrow_upward"
      title={l("find.previous")}
      disableTooltip={true}
      disabled={total === 0}
      onClick={() => stepToMatch(false)}
    />
    <IconButton
      icon="arrow_downward"
      title={l("find.next")}
      disableTooltip={true}
      disabled={total === 0}
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
