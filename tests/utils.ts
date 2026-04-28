/* eslint-disable @stylistic/max-len */
// Set default date for all tests.

import { type Page } from "@playwright/test";

// See https://github.com/microsoft/playwright/issues/6347#issuecomment-1085850728

const fakeNow = new Date("January 02 2030 14:00:00").valueOf();

const datePatchScript = `{
  const _OrigDate = Date;
  let step = 0;
  Date = class extends _OrigDate {
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
}`;

export const setDefaultDate = async (page: Page): Promise<void> => {
  // Patch Date in the main page context.
  await page.addInitScript(datePatchScript);

  // Also patch Date inside dedicated Web Workers (e.g. the subwaytext
  // parser pool, script worker) so timestamps use the fake date too.
  page.on("worker", (worker) => {
    worker.evaluate(datePatchScript).catch(() => {
      // Worker may have already closed — ignore.
    });
  });

  // The notes worker is now a SharedWorker, which Playwright's
  // page.on("worker") does not surface. Intercept its module URL and
  // prepend the Date patch into the source the browser executes.
  await page.context().route(
    "**/notes-worker/index.ts**",
    async (route) => {
      const response = await route.fetch();
      const body = await response.text();
      await route.fulfill({
        response,
        body: datePatchScript + "\n" + body,
      });
    },
  );
};
