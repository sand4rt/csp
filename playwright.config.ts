import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

// https://playwright.dev/docs/test-configuration.
const config: PlaywrightTestConfig = {
  testDir: './src',
  testMatch: 'App.test.ts',
  snapshotDir: './__snapshots__',
  timeout: 10 * 1000,
  fullyParallel: true,
  reporter: process.env.CI ? 'html' : 'line',
  webServer: {
    command: 'npm run dev',
    port: 8080,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:8080/csp',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
};

export default config;
