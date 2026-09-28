import { CSSProperties, useEffect, useRef, useState } from "react";
import { getBridge, isElectron } from "../lib/electron/bridge";
import { canGoBack, canGoForward } from "../lib/navigation";
import {
  canScrollHorizontally,
  GESTURE_GAP_MS,
  SwipeState,
  SwipeTracker,
} from "../lib/swipeNavigation";
import useHistoryNavigation from "../hooks/useHistoryNavigation";
import Icon from "./Icon";

// MouseEvent.button values of the side buttons most mice have.
const MOUSE_BUTTON_BACK = 3;
const MOUSE_BUTTON_FORWARD = 4;

/*
  The desktop app's ways through the history besides the header buttons:
  the Go menu (Cmd-[ / Cmd-]), the mouse side buttons and a two-finger
  trackpad swipe, all of which a browser handles itself. What it renders
  is the arrow that follows a swipe in from the edge of the window.
*/
const HistoryNavigation = () => {
  const { goBack, goForward } = useHistoryNavigation();
  const [swipe, setSwipe] = useState<SwipeState | null>(null);

  // The listeners are attached once; the functions change every render.
  const navigate = useRef({ goBack, goForward });
  navigate.current = { goBack, goForward };

  useEffect(() => {
    if (!isElectron()) return;

    return getBridge().onHistoryCommand((command) => {
      if (command === "back") {
        navigate.current.goBack();
      } else {
        navigate.current.goForward();
      }
    });
  }, []);

  useEffect(() => {
    if (!isElectron()) return;

    const onMouseUp = (event: MouseEvent) => {
      if (event.button === MOUSE_BUTTON_BACK) {
        event.preventDefault();
        navigate.current.goBack();
      } else if (event.button === MOUSE_BUTTON_FORWARD) {
        event.preventDefault();
        navigate.current.goForward();
      }
    };

    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, []);

  useEffect(() => {
    if (!isElectron()) return;

    let target: EventTarget | null = null;
    let hideTimeout: number | undefined;

    const tracker = new SwipeTracker((direction) => {
      const hasHistory = direction === "back"
        ? canGoBack()
        : canGoForward();
      return hasHistory && !canScrollHorizontally(target, direction);
    });

    /*
      Passive and on the window, so it never delays a scroll and only
      hears what no scroller (Monaco's, for one) has consumed already.
    */
    const onWheel = (event: WheelEvent) => {
      target = event.target;
      const state = tracker.process(event);
      /*
        Past the goal the rest of the gesture is ignored, so the
        indicator is left to the timeout: it stays in its triggered
        state for a moment instead of vanishing on the next event.
      */
      if (state === null) return;

      window.clearTimeout(hideTimeout);
      setSwipe(state);

      if (state.progress === 1) {
        if (state.direction === "back") {
          navigate.current.goBack();
        } else {
          navigate.current.goForward();
        }
      }

      // Hides the indicator once the gesture is over.
      hideTimeout = window.setTimeout(() => {
        setSwipe(null);
      }, GESTURE_GAP_MS);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(hideTimeout);
    };
  }, []);

  if (!swipe) return null;

  return <div
    className={
      "swipe-navigation-indicator " + swipe.direction
      + (swipe.progress === 1 ? " triggered" : "")
    }
    style={{
      "--swipe-progress": swipe.progress,
    } as CSSProperties}
    aria-hidden="true"
  >
    <Icon
      icon={swipe.direction === "back" ? "arrow_back" : "arrow_forward"}
    />
  </div>;
};

export default HistoryNavigation;
