/*
  Two-finger trackpad swipe to go back and forward.

  In a browser this is Chromium's overscroll history navigation, which
  lives in the browser layer and so does not exist in Electron.
  Electron's own BrowserWindow "swipe" event only fires when macOS is set
  to swipe between pages with three fingers, which is not the default.
  The DOM sees the default gesture only as a stream of horizontal wheel
  events, so it is recognized from those.

  The DOM also has no gesture phases: there is no "fingers down" and no
  "fingers up", and the momentum macOS adds after the fingers lift
  arrives as more wheel events. A gesture is therefore a run of wheel
  events without a gap longer than GESTURE_GAP_MS, and its fate is
  settled by its first event:

  - mostly vertical: it is a scroll, and nothing in it navigates;
  - horizontal, but something under the pointer can still scroll that
    way: it is a horizontal scroll, and nothing in it navigates either;
  - horizontal, with nowhere to go in the history: likewise.

  Otherwise it is tracked, and navigates once it has travelled
  TRIGGER_DISTANCE. Travelling back towards the start takes the progress
  back down, so a swipe can still be called off halfway.
*/

export type SwipeDirection = "back" | "forward";

export interface SwipeState {
  direction: SwipeDirection,
  // 0 to 1, where 1 means the gesture has navigated.
  progress: number,
}

export interface WheelSample {
  deltaX: number,
  deltaY: number,
  timeStamp: number,
  /*
    Pinch-to-zoom arrives as wheel events with ctrlKey set, and a
    handler that already consumed the event marks it defaultPrevented.
  */
  ctrlKey: boolean,
  defaultPrevented: boolean,
}

// Silence long enough to end a gesture, momentum included.
export const GESTURE_GAP_MS = 200;
// Horizontal travel, in CSS pixels, that triggers the navigation.
export const TRIGGER_DISTANCE = 250;

type Phase = "idle" | "ignoring" | "tracking" | "done";

export class SwipeTracker {
  #phase: Phase = "idle";
  #direction: SwipeDirection = "back";
  #distance = 0;
  #lastTimeStamp = -Infinity;
  /*
    Asked once per gesture, on its first horizontal event: may a swipe
    in this direction navigate? That is, is there history to go to and
    nothing under the pointer that would rather scroll sideways?
  */
  readonly #canNavigate: (direction: SwipeDirection) => boolean;

  constructor(canNavigate: (direction: SwipeDirection) => boolean) {
    this.#canNavigate = canNavigate;
  }

  /*
    Feeds one wheel event. Returns the state to show, or null when there
    is nothing to show. A state with progress 1 is returned exactly once
    per gesture, and that is the moment to navigate.
  */
  process(sample: WheelSample): SwipeState | null {
    if (sample.timeStamp - this.#lastTimeStamp > GESTURE_GAP_MS) {
      this.reset();
    }
    this.#lastTimeStamp = sample.timeStamp;

    if (this.#phase === "idle") {
      this.#phase = this.#begin(sample);
    }

    if (this.#phase !== "tracking") return null;

    const travel = this.#direction === "back"
      ? -sample.deltaX
      : sample.deltaX;
    this.#distance = Math.max(0, this.#distance + travel);

    if (this.#distance >= TRIGGER_DISTANCE) {
      this.#phase = "done";
      return { direction: this.#direction, progress: 1 };
    }

    return {
      direction: this.#direction,
      progress: this.#distance / TRIGGER_DISTANCE,
    };
  }

  reset(): void {
    this.#phase = "idle";
    this.#distance = 0;
  }

  #begin(sample: WheelSample): Phase {
    if (
      sample.ctrlKey
      || sample.defaultPrevented
      || Math.abs(sample.deltaX) <= Math.abs(sample.deltaY)
    ) {
      return "ignoring";
    }

    /*
      With natural scrolling, fingers moving right scroll the content
      left, a negative deltaX — and fingers moving right mean back.
    */
    this.#direction = sample.deltaX < 0 ? "back" : "forward";
    return this.#canNavigate(this.#direction) ? "tracking" : "ignoring";
  }
}


const SCROLLABLE_OVERFLOW = new Set(["auto", "scroll"]);

/*
  Whether `target` or one of its ancestors can scroll further in the
  direction a swipe would navigate. A swipe back scrolls towards the
  left edge, a swipe forward towards the right one.
*/
export const canScrollHorizontally = (
  target: EventTarget | null,
  direction: SwipeDirection,
): boolean => {
  let element = target instanceof Element ? target : null;

  while (element) {
    const isScrollable = element === document.scrollingElement
      || element instanceof HTMLInputElement
      || element instanceof HTMLTextAreaElement
      || SCROLLABLE_OVERFLOW.has(getComputedStyle(element).overflowX);

    if (isScrollable && element.scrollWidth > element.clientWidth) {
      const hasRoom = direction === "back"
        ? element.scrollLeft > 0
        : element.scrollLeft + element.clientWidth < element.scrollWidth - 1;
      if (hasRoom) return true;
    }

    element = element.parentElement;
  }

  return false;
};
