import type { Parser } from 'prettier';

import { parser } from './parsers/index.js';
import { type NodeType, PARSER_NAME } from './utils/index.js';

export const parsers: Record<string, Parser<NodeType>> = {
  [PARSER_NAME]: parser,
};
