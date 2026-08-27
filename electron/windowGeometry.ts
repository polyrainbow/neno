/*
  Pure geometry for restoring a remembered window. Kept free of any
  electron import so it can be unit-tested: the interesting cases are a
  window saved on a monitor that is no longer attached, and one saved
  larger than the display it now opens on.
*/

import { WindowState } from "./config";

/*
  Wide enough to clear the 1280px breakpoint at which the note list
  sidebar is hidden (see the `min-width: 1281px` rules in
  public/assets/css/note-view.css). On macOS a window has no side
  chrome, so this is also the CSS viewport width.
*/
export const DEFAULT_WIDTH = 1440;
export const DEFAULT_HEIGHT = 900;

export const MIN_WIDTH = 640;
export const MIN_HEIGHT = 480;

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getOverlapArea(a: Rectangle, b: Rectangle): number {
  const width = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const height = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return width > 0 && height > 0 ? width * height : 0;
}

/**
 * Clamps a remembered window to the displays that are actually attached.
 * Returns a state with `x`/`y` omitted when there is no usable position,
 * which makes Electron centre the window.
 */
export function fitToDisplays(
  state: WindowState,
  workAreas: Rectangle[],
  primaryWorkArea: Rectangle,
): WindowState {
  const hasPosition = typeof state.x === "number"
    && typeof state.y === "number";

  const rectangle: Rectangle = {
    x: state.x ?? 0,
    y: state.y ?? 0,
    width: state.width,
    height: state.height,
  };

  const overlapping = hasPosition
    ? workAreas
      .map((workArea) => ({
        workArea,
        overlap: getOverlapArea(rectangle, workArea),
      }))
      .filter((candidate) => candidate.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)[0]?.workArea
    : undefined;

  const workArea = overlapping ?? primaryWorkArea;

  const width = Math.max(MIN_WIDTH, Math.min(state.width, workArea.width));
  const height = Math.max(MIN_HEIGHT, Math.min(state.height, workArea.height));

  const fitted: WindowState = { ...state, width, height };

  // No position, or a position on a monitor that is gone: let Electron
  // centre the window instead of opening it off-screen.
  if (!overlapping) {
    delete fitted.x;
    delete fitted.y;
  }

  return fitted;
}
