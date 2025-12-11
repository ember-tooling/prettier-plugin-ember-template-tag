import type { Printer } from 'prettier';

import { printer } from './printers/index.js';
import { type NodeType, PRINTER_NAME } from './utils/index.js';

export const printers: Record<string, Printer<NodeType>> = {
  [PRINTER_NAME]: printer,
};
