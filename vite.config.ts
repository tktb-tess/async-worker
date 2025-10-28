/// <reference types="vitest" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, './lib/main.ts'),
      fileName: (format) => (format === 'umd' ? 'bundle.min.js' : 'bundle.js'),
      name: 'AsyncWorker',
      formats: ['es', 'umd'],
    },
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  test: {
    testTimeout: 30000,
  },
});
