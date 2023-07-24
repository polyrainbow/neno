/*
  This module is to determine the screen size during runtime.
  Components using this module can strap on their event listeners via
  addChangeListener(), so they get notified when the screen size changes.
  The reason for this module is that direct calls to window.matchMedia() are
  relatively resource-hungry, so components should not call that method
  arbitrarily.

  Benchmark of window.matchMedia():
  https://www.measurethat.net/Benchmarks/Show/1213/3/matchmedia-vs-clientwidth
*/

import { MAX_WIDTH_SMALL_SCREEN } from "../config";

const QUERY = `(max-width: ${MAX_WIDTH_SMALL_SCREEN}px)`;
let isSmallScreen: boolean;
let changeCallbacks: any[] = [];

const getIsSmallScreenFromBrowser = () => {
  return window.matchMedia(QUERY).matches;
};

const getIsSmallScreen = () => {
  return isSmallScreen;
};

const addChangeListener = (callback: (isSmallScreen: boolean) => void) => {
  changeCallbacks.push(callback);
};

const removeChangeListener = (callback: (isSmallScreen: boolean) => void) => {
  const index = changeCallbacks.findIndex((callbackInArray) => {
    return callbackInArray === callback;
  });
  changeCallbacks.splice(index, 1);
};

const removeAllChangeListeners = () => {
  changeCallbacks = [];
};

const handleChange = () => {
  const newIsSmallScreen = getIsSmallScreenFromBrowser();
  if (newIsSmallScreen !== isSmallScreen) {
    isSmallScreen = newIsSmallScreen;
    changeCallbacks.forEach((callback) => {
      callback(isSmallScreen);
    });
  }
};

// init
isSmallScreen = getIsSmallScreenFromBrowser();
const mediaQueryList = window.matchMedia(QUERY);
mediaQueryList.addEventListener("change", handleChange);

export {
  getIsSmallScreen,
  addChangeListener,
  removeChangeListener,
  removeAllChangeListeners,
};
