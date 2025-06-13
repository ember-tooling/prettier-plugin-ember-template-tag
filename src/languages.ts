import type { SupportLanguage } from 'prettier';

import { PARSER_NAME } from './utils/index.js';

export const languages: SupportLanguage[] = [
  {
    aliases: ['gjs', 'glimmer-js'],
    extensions: ['.gjs'],
    group: 'JavaScript',
    name: 'Ember Template Tag (gjs)',
    parsers: [PARSER_NAME],
    vscodeLanguageIds: ['glimmer-js'],
  },
  {
    aliases: ['gts', 'glimmer-ts'],
    extensions: ['.gts'],
    group: 'TypeScript',
    name: 'Ember Template Tag (gts)',
    parsers: [PARSER_NAME],
    vscodeLanguageIds: ['glimmer-ts'],
  },
];
