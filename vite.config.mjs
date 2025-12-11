import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'content-tag',
        'prettier',
        'prettier/plugins/estree.js',
        'prettier/plugins/babel.js',
        '@babel/core',
      ],
    },
    lib: {
      entry: 'src/main.ts',
      formats: ['cjs'],
    },
    minify: false,
  },
});
