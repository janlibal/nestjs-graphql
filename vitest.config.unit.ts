import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts','!src/tests'],
    globals: true,
    root: './',
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      auth: '/src/auth',
      quotes: '/src/quotes',
      lib: '/src/lib'
    }
  }
})
