/* eslint-disable @stylistic/max-len */
// Set default date for all tests.

import { type Page } from "@playwright/test";

// See https://github.com/microsoft/playwright/issues/6347#issuecomment-1085850728
export const setDefaultDate = async (page: Page): Promise<void> => {
  // Pick the new/fake "now" for you test pages.
  const fakeNow = new Date("January 02 2030 14:00:00").valueOf();

  // Update the Date accordingly in your test pages
  await page.addInitScript(`{
    let step = 0;
    Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          const timestamp = ${fakeNow};
          // increase timestamp with every call so we can simulate an order of
          // events
          step = step + 1000;
          super(timestamp + step);
        } else {
          super(...args);
        }
      }
    }
    Date.now = () => {
      const timestamp = ${fakeNow};
      // increase timestamp with every call so we can simulate an order of
      // events
      step = step + 1;
      return timestamp + step;
    };
  }`);
};
