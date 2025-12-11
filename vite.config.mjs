import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'content-tag',
        'prettier',
        'prettier/plugins/estree.js',
        'prettier/plugins/babel.js',
      ],
    },
    lib: {
      entry: 'src/main.ts',
      formats: ['cjs'],
    },
    minify: false,
  },
});
