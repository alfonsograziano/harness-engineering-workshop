import { defineConfig } from 'vitest/config';

// Each workspace has its own vitest.config.ts. `npm test` at the root runs all of them.
export default defineConfig({
  test: {
    projects: ['packages/*', 'apps/*'],
  },
});
