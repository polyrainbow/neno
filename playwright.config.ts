import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left
  test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  failOnFlakyTests: true,
  /* Shared settings for all the projects below.
  See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    ...devices["Desktop Chrome"],
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:5173",
    headless: true,
    /* Collect trace when retrying the failed test.
    See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    video: process.env.CI ? "off" : "retain-on-failure",
    // Viewport used for all pages in the context.
    viewport: { width: 1440, height: 800 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: "http://localhost:5173",

        /* Collect trace when retrying the failed test.
        See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
        video: process.env.CI ? "off" : "retain-on-failure",
        // Viewport used for all pages in the context.
        viewport: { width: 1440, height: 800 },
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    // reuseExistingServer: !process.env.CI,
  },
});
