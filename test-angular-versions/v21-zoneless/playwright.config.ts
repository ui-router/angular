import { defineConfig } from '@playwright/test';

const distPath = process.env.DIST_PATH || 'dist';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npx serve ${distPath} -l 4000 -s`,
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
  },
});
