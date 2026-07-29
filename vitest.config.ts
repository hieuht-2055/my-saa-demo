import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    /**
     * Application code only. `.claude/**` holds the agent kit's own tooling, whose
     * `.cjs` tests are written for the plain `node` runner and fail under Vitest —
     * sweeping them in would leave `pnpm test` permanently red and bury real
     * regressions in this app's suite.
     */
    include: ['app/**/*.test.{ts,tsx}', 'lib/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
