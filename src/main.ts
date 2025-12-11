import type { Parser, Plugin, Printer } from 'prettier';

import { languages } from './languages.js';
import { options } from './options.js';
import { parser } from './parse/index.js';
import { printer } from './print/index.js';
import { type NodeType, PARSER_NAME, PRINTER_NAME } from './utils/index.js';

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
