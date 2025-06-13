import type { File } from '@babel/types';
import type { Parser, ParserOptions } from 'prettier';
import { parsers as prettierParsers } from 'prettier/plugins/babel.js';

import { convertAst, preprocess } from './parsers/index.js';
import { assert } from './utils/assert.js';
import { type NodeType, PARSER_NAME, PRINTER_NAME } from './utils/index.js';

const parser = prettierParsers['babel-ts'] as Parser<NodeType>;

async function parse(text: string, options: ParserOptions<NodeType>) {
  const preprocessed = preprocess(text, options.filepath);

  const ast = await parser.parse(preprocessed.code, options);
  assert('expected ast', ast);
  convertAst(ast as File, preprocessed.templates);

  return ast;
}

export const parsers: Record<string, Parser<NodeType>> = {
  [PARSER_NAME]: {
    ...parser,
    astFormat: PRINTER_NAME,
    parse,
  },
};
