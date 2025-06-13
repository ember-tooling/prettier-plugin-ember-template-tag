import type { Parser, Plugin, Printer, SupportLanguage } from 'prettier';

import { options } from './options.js';
import { parser } from './parse/index.js';
import { printer } from './print/index.js';
import { type NodeType, PARSER_NAME, PRINTER_NAME } from './utils/index.js';

const languages: SupportLanguage[] = [
  {
    name: 'Ember Template Tag (gjs)',
    aliases: ['gjs', 'glimmer-js'],
    extensions: ['.gjs'],
    vscodeLanguageIds: ['glimmer-js'],
    parsers: [PARSER_NAME],
    group: 'JavaScript',
  },
  {
    name: 'Ember Template Tag (gts)',
    aliases: ['gts', 'glimmer-ts'],
    extensions: ['.gts'],
    vscodeLanguageIds: ['glimmer-ts'],
    parsers: [PARSER_NAME],
    group: 'TypeScript',
  },
];

const parsers: Record<string, Parser<NodeType>> = {
  [PARSER_NAME]: parser,
};

const printers: Record<string, Printer<NodeType>> = {
  [PRINTER_NAME]: printer,
};

const plugin: Plugin<NodeType> = {
  languages,
  parsers,
  printers,
  options,
};

export default plugin;
