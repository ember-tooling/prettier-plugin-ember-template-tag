import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['content-tag'],
    },
    lib: {
      entry: 'src/main.ts',
      formats: ['cjs'],
    },
    minify: false,
  },
});
