import type { File } from '@babel/types';
import type { Parser, ParserOptions } from 'prettier';
import { version as prettierVersion } from 'prettier';
import { parsers as prettierParsers } from 'prettier/plugins/babel';

import { convertAst, preprocess } from './parsers/index.js';
import { assert } from './utils/assert.js';
import { type NodeType, PARSER_NAME, PRINTER_NAME } from './utils/index.js';
import { warnOnBrokenPrettierVersion } from './utils/prettier-version-warning.js';

const parser = prettierParsers['babel-ts'] as Parser<NodeType>;

let hasWarnedOnBrokenPrettierVersion = false;

async function parse(text: string, options: ParserOptions<NodeType>) {
  if (!hasWarnedOnBrokenPrettierVersion) {
    hasWarnedOnBrokenPrettierVersion = true;
    warnOnBrokenPrettierVersion(prettierVersion);
  }

  const { code, templates } = preprocess(text, options.filepath);

  const ast = await parser.parse(code, options);
  assert('expected ast', ast);
  convertAst(ast as File, { parser, templates });

  return ast;
}

export const parsers: Record<string, Parser<NodeType>> = {
  [PARSER_NAME]: {
    ...parser,
    astFormat: PRINTER_NAME,
    parse,
  },
};
