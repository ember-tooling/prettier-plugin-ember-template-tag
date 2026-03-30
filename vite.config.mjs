import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'content-tag',
        'prettier',
        'prettier/plugins/estree',
        'prettier/plugins/babel',
      ],
    },
    lib: {
      entry: 'src/main.ts',
      formats: ['cjs'],
    },
    minify: false,
  },
});
