import { describe, it, expect } from "vitest";
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  fitToDisplays,
  MIN_HEIGHT,
  MIN_WIDTH,
  Rectangle,
} from "./windowGeometry";

/*
  The remembered window has to survive the display setup changing between
  launches — an external monitor unplugged, or a laptop screen smaller
  than the one the size was saved on.
*/

const LAPTOP: Rectangle = { x: 0, y: 25, width: 1728, height: 1085 };
const EXTERNAL: Rectangle = { x: 1728, y: 0, width: 2560, height: 1440 };


describe("fitToDisplays", () => {
  it("should leave a window that fits its display untouched", () => {
    const state = { width: 1440, height: 900, x: 100, y: 100 };
    expect(fitToDisplays(state, [LAPTOP], LAPTOP)).toEqual(state);
  });

  it("should keep a window that is on a second display", () => {
    const state = { width: 1440, height: 900, x: 2000, y: 100 };
    expect(fitToDisplays(state, [LAPTOP, EXTERNAL], LAPTOP)).toEqual(state);
  });

  /*
    The window was saved on a monitor that is no longer attached. Keeping
    the position would open it off-screen, so the position is dropped and
    Electron centres it.
  */
  it("should drop a position that is on no attached display", () => {
    const fitted = fitToDisplays(
      { width: 1400, height: 800, x: 6000, y: 3000 },
      [LAPTOP],
      LAPTOP,
    );
    expect(fitted.x).toBeUndefined();
    expect(fitted.y).toBeUndefined();
    // The size is still worth keeping.
    expect(fitted.width).toBe(1400);
    expect(fitted.height).toBe(800);
  });

  it("should keep a window that only partly overlaps a display", () => {
    const state = { width: 1400, height: 800, x: -200, y: 100 };
    const fitted = fitToDisplays(state, [LAPTOP], LAPTOP);
    expect(fitted.x).toBe(-200);
    expect(fitted.y).toBe(100);
  });

  it("should clamp a window larger than its display", () => {
    const fitted = fitToDisplays(
      { width: 99999, height: 99999, x: 0, y: 25 },
      [LAPTOP],
      LAPTOP,
    );
    expect(fitted.width).toBe(LAPTOP.width);
    expect(fitted.height).toBe(LAPTOP.height);
  });

  /*
    Saved full-size on the external monitor, now opening on the laptop:
    the size must shrink to what the laptop can show.
  */
  it("should clamp against the display with the most overlap", () => {
    const fitted = fitToDisplays(
      { width: 2560, height: 1440, x: 0, y: 25 },
      [LAPTOP],
      LAPTOP,
    );
    expect(fitted.width).toBe(LAPTOP.width);
    expect(fitted.height).toBe(LAPTOP.height);
  });

  it("should never clamp below the minimum size", () => {
    const tiny: Rectangle = { x: 0, y: 0, width: 320, height: 200 };
    const fitted = fitToDisplays(
      { width: 1440, height: 900, x: 0, y: 0 },
      [tiny],
      tiny,
    );
    expect(fitted.width).toBe(MIN_WIDTH);
    expect(fitted.height).toBe(MIN_HEIGHT);
  });

  it("should fall back to the primary display without a position", () => {
    const fitted = fitToDisplays(
      { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
      [LAPTOP, EXTERNAL],
      LAPTOP,
    );
    expect(fitted.width).toBe(DEFAULT_WIDTH);
    expect(fitted.height).toBe(DEFAULT_HEIGHT);
    expect(fitted.x).toBeUndefined();
    expect(fitted.y).toBeUndefined();
  });

  it("should carry the maximized and fullScreen flags through", () => {
    const fitted = fitToDisplays(
      { width: 1440, height: 900, x: 0, y: 25, maximized: true },
      [LAPTOP],
      LAPTOP,
    );
    expect(fitted.maximized).toBe(true);
  });

  /*
    The default has to clear the 1280px breakpoint below which the note
    list sidebar is hidden.
  */
  it("should default wide enough to show the sidebar", () => {
    expect(DEFAULT_WIDTH).toBeGreaterThan(1280);
  });
});
