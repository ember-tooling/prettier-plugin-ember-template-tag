import type { Plugin } from 'prettier';

import { languages } from './languages.js';
import { options } from './options.js';
import { parsers } from './parsers.js';
import { printers } from './printers.js';
import type { NodeType } from './utils/index.js';

const plugin: Plugin<NodeType> = {
  languages,
  parsers,
  printers,
  options,
};

export default plugin;
