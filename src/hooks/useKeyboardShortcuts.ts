import { RefObject, useEffect } from "react";

/*
> = Overridden with
CMD+
  A - Select all
  B - NENO: New note
  C - Copy
  D - Add bookmark
  E - NENO: Search
  F - Find
  G - Find
  H - Go to last app
  I - NENO: Toggle Wikilink wrap
  N - New window
  P - Print
  Q - Quit app
  R - Reload
  S - Save > NENO: Save
  T - New tab
  U - NENO: New alias
  V - Paste
  W - Close tab
  X - Cut
  Z - Undo
*/

interface KeyboardShortCutHandlers {
  onSave?: () => void,
  onCmdDot?: () => void,
  onCmdB?: () => void,
  onCmdE?: () => void,
  onCmdI?: () => void,
  onCmdU?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onEnter?: () => void,
}

export default (
  handlers: KeyboardShortCutHandlers,
  elementRef?: RefObject<HTMLElement | null>,
): void => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (
      handlers.onSave
      // @ts-ignore
      && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey)
      && e.key === "s"
      && !e.shiftKey
    ) {
      handlers.onSave();
      e.preventDefault();
    }

    if (
      handlers.onCmdDot
      // @ts-ignore
      && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey)
      && e.key === "."
    ) {
      handlers.onCmdDot();
      e.preventDefault();
    }

    if (
      handlers.onCmdB
      // @ts-ignore
      && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey)
      && e.key === "b"
    ) {
      handlers.onCmdB();
      e.preventDefault();
    }

    if (
      handlers.onCmdE
      // @ts-ignore
      && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey)
      && e.key === "e"
    ) {
      handlers.onCmdE();
      e.preventDefault();
    }

    if (
      handlers.onCmdI
      // @ts-ignore
      && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey)
      && e.key === "i"
    ) {
      handlers.onCmdI();
      e.preventDefault();
    }

    if (
      handlers.onCmdU
      // @ts-ignore
      && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey)
      && e.key === "u"
    ) {
      handlers.onCmdU();
      e.preventDefault();
    }

    if (
      handlers.onArrowUp
      && e.key === "ArrowUp"
    ) {
      handlers.onArrowUp();
      e.preventDefault();
    }

    if (
      handlers.onArrowDown
      && e.key === "ArrowDown"
    ) {
      handlers.onArrowDown();
      e.preventDefault();
    }

    if (
      handlers.onEnter
      && e.key === "Enter"
    ) {
      handlers.onEnter();
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (elementRef?.current) {
      elementRef.current.addEventListener("keydown", handleKeydown);
    } else {
      document.body.addEventListener("keydown", handleKeydown);
    }

    return () => {
      if (elementRef?.current) {
        elementRef.current.removeEventListener("keydown", handleKeydown);
      } else {
        document.body.removeEventListener("keydown", handleKeydown);
      }
    };
  }, [handleKeydown, handlers, elementRef]);
};
