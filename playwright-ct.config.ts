import type { PlaywrightTestConfig } from '@playwright/experimental-ct-react';
import { devices } from '@playwright/experimental-ct-react';
import path from 'path';

// https://playwright.dev/docs/test-configuration.
const config: PlaywrightTestConfig = {
  testDir: './src',
  testIgnore: 'App.test.ts',
  snapshotDir: './__snapshots__',
  timeout: 10 * 1000,
  fullyParallel: true,
  reporter: process.env.CI ? 'html' : 'line',
  use: {
    trace: 'on-first-retry',
    ctPort: 8080,
    ctViteConfig: {
      resolve: {
        alias: { '@': path.resolve(__dirname, './src') },
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
};

export default config;
