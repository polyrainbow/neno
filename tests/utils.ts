/* eslint-disable max-len */
// Set default date for all tests.

import { Page } from "@playwright/test";

// See https://github.com/microsoft/playwright/issues/6347#issuecomment-1085850728
export const setDefaultDate = async (page: Page): Promise<void> => {
  // Pick the new/fake "now" for you test pages.
  const fakeNow = new Date("January 02 2030 14:00:00").valueOf();

  // Update the Date accordingly in your test pages
  await page.addInitScript(`{
    // Extend Date constructor to default to fakeNow
    Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          super(${fakeNow});
        } else {
          super(...args);
        }
      }
    }
    // Override Date.now() to start from fakeNow
    const __DateNowOffset = ${fakeNow} - Date.now();
    const __DateNow = Date.now;
    Date.now = () => __DateNow() + __DateNowOffset;
  }`);
};
