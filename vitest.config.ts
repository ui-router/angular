import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular({ tsconfig: './tsconfig.spec.json' })],
  test: {
    globals: true,
    environment: 'jsdom',
    testTimeout: 10000, // 10 second timeout for async Angular tests
    projects: [
      {
        extends: true,
        test: {
          name: 'zone',
          include: ['test/**/*.spec.ts'],
          setupFiles: ['./test/setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'zoneless',
          include: ['test-zoneless/**/*.spec.ts'],
          setupFiles: ['./test-zoneless/setup.ts'],
        },
      },
    ],
  },
});
