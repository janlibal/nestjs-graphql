import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    threads: false,
    maxConcurrency: 1,
    environment: 'node',
    setupFiles: ['tests/helpers/setup.ts'],
    //watch: false
  },
  plugins: [
    swc.vite({module: { type: 'es6' },}),
  ],
})