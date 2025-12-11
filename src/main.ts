import type { Plugin, Printer } from 'prettier';

import { languages } from './languages.js';
import { options } from './options.js';
import { parsers } from './parsers.js';
import { printer } from './print/index.js';
import { type NodeType, PRINTER_NAME } from './utils/index.js';

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
