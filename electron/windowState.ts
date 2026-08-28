/*
  Remembers the window's size, position and maximized/fullscreen state in
  ~/.config/neno/config.json, so a relaunch reopens the window the way
  the user left it.
*/

import { BrowserWindow, screen } from "electron";
import {
  getWindowState,
  setWindowState,
  WindowState,
} from "./config";
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  fitToDisplays,
} from "./windowGeometry";

// Resize and move fire continuously while dragging.
const SAVE_DEBOUNCE_MS = 400;


export async function getInitialWindowState(): Promise<WindowState> {
  const stored = await getWindowState();
  const displays = screen.getAllDisplays();

  return fitToDisplays(
    stored ?? { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
    displays.map((display) => display.workArea),
    screen.getPrimaryDisplay().workArea,
  );
}


export function applyWindowState(
  window: BrowserWindow,
  state: WindowState,
): void {
  if (state.fullScreen) {
    window.setFullScreen(true);
  } else if (state.maximized) {
    window.maximize();
  }
}


export function trackWindowState(window: BrowserWindow): void {
  let timer: NodeJS.Timeout | null = null;

  const save = (): void => {
    if (window.isDestroyed()) return;
    /*
      getNormalBounds is the un-maximized, un-fullscreened rectangle —
      the one worth restoring to.
    */
    const bounds = window.getNormalBounds();
    void setWindowState({
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      maximized: window.isMaximized(),
      fullScreen: window.isFullScreen(),
    });
  };

  const scheduleSave = (): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      save();
    }, SAVE_DEBOUNCE_MS);
  };

  window.on("resize", scheduleSave);
  window.on("move", scheduleSave);
  window.on("maximize", scheduleSave);
  window.on("unmaximize", scheduleSave);
  window.on("enter-full-screen", scheduleSave);
  window.on("leave-full-screen", scheduleSave);

  window.on("close", () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    save();
  });
}
