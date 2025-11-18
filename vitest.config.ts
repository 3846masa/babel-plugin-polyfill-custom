import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    include: ['**/__tests__/*.spec.ts'],
    root: './src',
    watch: false,
  },
});
