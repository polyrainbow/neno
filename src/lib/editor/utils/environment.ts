/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

declare global {
  interface Document {
    documentMode?: unknown;
  }

  interface Window {
    MSStream?: unknown;
  }
}

const documentMode
  = "documentMode" in document ? document.documentMode : null;

export const IS_APPLE: boolean
  = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

export const IS_FIREFOX: boolean
  = /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);

export const CAN_USE_BEFORE_INPUT: boolean
  = "InputEvent" in window && !documentMode
    ? "getTargetRanges" in new window.InputEvent("input")
    : false;

export const IS_SAFARI: boolean
  = /Version\/[\d.]+.*Safari/.test(navigator.userAgent);

export const IS_IOS: boolean
  = /iPad|iPhone|iPod/.test(navigator.userAgent)
  && !window.MSStream;

export const IS_CHROME: boolean
  = /^(?=.*Chrome).*/i.test(navigator.userAgent);

export const IS_APPLE_WEBKIT
  = /AppleWebKit\/[\d.]+/.test(navigator.userAgent)
  && !IS_CHROME;
