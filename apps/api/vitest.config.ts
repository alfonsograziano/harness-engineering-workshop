import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'api',
    environment: 'node',
    // node:sqlite still prints an ExperimentalWarning on Node 24.
    execArgv: ['--disable-warning=ExperimentalWarning'],
  },
});
