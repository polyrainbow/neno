// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import {
  canScrollHorizontally,
  GESTURE_GAP_MS,
  SwipeDirection,
  SwipeState,
  SwipeTracker,
  TRIGGER_DISTANCE,
  WheelSample,
} from "./swipeNavigation";

const sample = (
  deltaX: number,
  timeStamp: number,
  overrides: Partial<WheelSample> = {},
): WheelSample => ({
  deltaX,
  deltaY: 0,
  timeStamp,
  ctrlKey: false,
  defaultPrevented: false,
  ...overrides,
});

// Feeds `count` events of `deltaX` each, 16 ms apart, from `start`.
const feed = (
  tracker: SwipeTracker,
  deltaX: number,
  count: number,
  start = 0,
): (SwipeState | null)[] => {
  return Array.from(
    { length: count },
    (_, i) => tracker.process(sample(deltaX, start + i * 16)),
  );
};

const always = (): boolean => true;

describe("SwipeTracker", () => {
  it("navigates back once a rightward swipe travels far enough", () => {
    const tracker = new SwipeTracker(always);
    const states = feed(tracker, -50, TRIGGER_DISTANCE / 50);

    expect(states.at(-2)).toEqual({ direction: "back", progress: 0.8 });
    expect(states.at(-1)).toEqual({ direction: "back", progress: 1 });
  });

  it("navigates forward on a leftward swipe", () => {
    const tracker = new SwipeTracker(always);
    const states = feed(tracker, 50, TRIGGER_DISTANCE / 50);

    expect(states.at(-1)).toEqual({ direction: "forward", progress: 1 });
  });

  it("navigates only once per gesture, momentum included", () => {
    const tracker = new SwipeTracker(always);
    const states = feed(tracker, -50, 20);

    const triggers = states.filter((state) => state?.progress === 1);
    expect(triggers).toHaveLength(1);
    expect(states.at(-1)).toBeNull();
  });

  it("starts a new gesture after a gap", () => {
    const tracker = new SwipeTracker(always);
    feed(tracker, -50, 20);

    const next = feed(tracker, -50, 1, 20 * 16 + GESTURE_GAP_MS + 1);
    expect(next[0]).toEqual({ direction: "back", progress: 0.2 });
  });

  it("lets a swipe be called off by moving back", () => {
    const tracker = new SwipeTracker(always);
    feed(tracker, -50, 3);

    const [state] = feed(tracker, 200, 1, 48);
    expect(state).toEqual({ direction: "back", progress: 0 });
  });

  it("ignores a gesture that starts vertically", () => {
    const tracker = new SwipeTracker(always);
    expect(tracker.process(sample(-5, 0, { deltaY: 30 }))).toBeNull();

    const states = feed(tracker, -50, 20, 16);
    expect(states.every((state) => state === null)).toBe(true);
  });

  it("ignores pinch-to-zoom and consumed events", () => {
    const pinch = new SwipeTracker(always);
    expect(pinch.process(sample(-50, 0, { ctrlKey: true }))).toBeNull();

    const consumed = new SwipeTracker(always);
    expect(
      consumed.process(sample(-50, 0, { defaultPrevented: true })),
    ).toBeNull();
  });

  it("asks once per gesture whether it may navigate", () => {
    const asked: SwipeDirection[] = [];
    const tracker = new SwipeTracker((direction) => {
      asked.push(direction);
      return false;
    });

    const states = feed(tracker, -50, 20);
    expect(states.every((state) => state === null)).toBe(true);
    expect(asked).toEqual(["back"]);
  });
});

describe("canScrollHorizontally", () => {
  const buildScroller = (scrollLeft: number): HTMLElement => {
    const scroller = document.createElement("div");
    scroller.style.overflowX = "auto";
    Object.defineProperty(scroller, "scrollWidth", { value: 300 });
    Object.defineProperty(scroller, "clientWidth", { value: 100 });
    scroller.scrollLeft = scrollLeft;
    const child = document.createElement("span");
    scroller.appendChild(child);
    document.body.appendChild(scroller);
    return child;
  };

  it("finds room in a scrollable ancestor", () => {
    const atStart = buildScroller(0);
    expect(canScrollHorizontally(atStart, "back")).toBe(false);
    expect(canScrollHorizontally(atStart, "forward")).toBe(true);

    const inMiddle = buildScroller(100);
    expect(canScrollHorizontally(inMiddle, "back")).toBe(true);
    expect(canScrollHorizontally(inMiddle, "forward")).toBe(true);

    const atEnd = buildScroller(200);
    expect(canScrollHorizontally(atEnd, "back")).toBe(true);
    expect(canScrollHorizontally(atEnd, "forward")).toBe(false);
  });

  it("ignores overflow that cannot be scrolled", () => {
    const clipped = document.createElement("div");
    clipped.style.overflowX = "hidden";
    Object.defineProperty(clipped, "scrollWidth", { value: 300 });
    Object.defineProperty(clipped, "clientWidth", { value: 100 });
    clipped.scrollLeft = 100;
    document.body.appendChild(clipped);

    expect(canScrollHorizontally(clipped, "back")).toBe(false);
  });

  it("is false for a non-element target", () => {
    expect(canScrollHorizontally(null, "back")).toBe(false);
  });
});
