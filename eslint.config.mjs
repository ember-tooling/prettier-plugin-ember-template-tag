import babelEslintParser from '@babel/eslint-parser';
import eslint from '@eslint/js';
import eslintPluginVitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginJsdoc from 'eslint-plugin-jsdoc';
import eslintPluginN from 'eslint-plugin-n';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const parserOptionsJs = {
  ecmaFeatures: {
    modules: true,
  },
  ecmaVersion: 'latest',
  requireConfigFile: false,
};

const parserOptionsTs = {
  projectService: true,
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  tsconfigRootDir: import.meta.dirname,
};

const customRules = {
  rules: {
    'jsdoc/check-param-names': 'off',
    'jsdoc/newline-after-description': 'off',
    'jsdoc/require-jsdoc': ['error', { publicOnly: true }],
    'jsdoc/require-param': 'off',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/tag-lines': 'off',
    'unicorn/consistent-destructuring': 'off',
    'unicorn/consistent-function-scoping': [
      'error',
      { checkArrowFunctions: false },
    ],
    'unicorn/custom-error-definition': 'error',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-empty-file': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-ternary': ['error', 'only-single-line'],
    'unicorn/prevent-abbreviations': [
      'error',
      { allowList: { args: true, doc: true, Doc: true, env: true } },
    ],
  },
};

export default defineConfig(
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.*/',
      'tests/__snapshots__/',
      'tests/cases/',
      'vite.config.ts',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },

  eslint.configs.recommended,
  tseslint.configs.strict,
  eslintPluginJsdoc.configs['flat/recommended'],
  eslintPluginUnicorn.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  customRules,

  // JavaScript files
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelEslintParser,
      parserOptions: parserOptionsJs,
    },
  },

  // TypeScript files
  {
    extends: [tseslint.configs.recommendedTypeChecked],
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: parserOptionsTs,
    },
  },

  // Test Files
  {
    ...eslintPluginVitest.configs.recommended,
    files: ['tests/**/*.test.{js,ts}'],
    plugins: {
      vitest: eslintPluginVitest,
    },
  },

  // Configuration files
  {
    ...eslintPluginN.configs['flat/recommended-script'],
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'script',
    },
    plugins: {
      n: eslintPluginN,
    },
  },
  {
    ...eslintPluginN.configs['flat/recommended-module'],
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      parserOptions: parserOptionsJs,
      sourceType: 'module',
    },
    plugins: {
      n: eslintPluginN,
    },
  },
);
