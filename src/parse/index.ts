import type { NodePath } from '@babel/core';
import { traverse } from '@babel/core';
import type {
  BlockStatement,
  Node,
  ObjectExpression,
  StaticBlock,
} from '@babel/types';
import type { Parsed as RawGlimmerTemplate } from 'content-tag';
import { Preprocessor } from 'content-tag';
import type { Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel.js';

import { PRINTER_NAME } from '../config.js';
import type { Options } from '../options.js';
import { isTopLevelTemplate } from '../types/glimmer.js';
import { assert } from '../utils/index.js';
import { preprocessTemplateRange } from './preprocess.js';

const typescript = babelParsers['babel-ts'] as Parser<Node | undefined>;
const p = new Preprocessor();

/** Converts a node into a GlimmerTemplate node */
function convertNode(
  path: NodePath,
  node: BlockStatement | ObjectExpression | StaticBlock,
  rawTemplate: RawGlimmerTemplate,
): void {
  node.extra = Object.assign(node.extra ?? {}, {
    isGlimmerTemplate: true as const,
    isDefaultTemplate: isTopLevelTemplate(path),
    template: rawTemplate,
  });
}

/** Traverses the AST and replaces the transformed template parts with other AST */
function convertAst(ast: Node, rawTemplates: RawGlimmerTemplate[]): void {
  let counter = 0;

  traverse(ast, {
    enter(path) {
      const { node } = path;
      if (
        node.type === 'ObjectExpression' ||
        node.type === 'BlockStatement' ||
        node.type === 'StaticBlock'
      ) {
        const { range } = node;
        assert('expected range', range);
        const [start, end] = range;

        const rawTemplate = rawTemplates.find(
          // FIXME: Probably not correct
          (t) =>
            (t.range.start === start && t.range.end === end) ||
            (t.range.start === start - 1 && t.range.end === end + 1) ||
            (t.range.start === start && t.range.end === end + 1),
        );

        if (!rawTemplate) {
          return null;
        }

        convertNode(path, node, rawTemplate);

        counter++;
      }
      return null;
    },
  });

  if (counter !== rawTemplates.length) {
    throw new Error('failed to process all templates');
  }
}

/**
 * Pre-processes the template info, parsing the template content to Glimmer AST,
 * fixing the offsets and locations of all nodes also calculates the block
 * params locations & ranges and adding it to the info
 */
function preprocess(
  code: string,
  fileName: string,
): {
  code: string;
  rawTemplates: RawGlimmerTemplate[];
} {
  const rawTemplates = p.parse(code, fileName);

  for (const rawTemplate of rawTemplates) {
    code = preprocessTemplateRange(rawTemplate, code);
  }

  return { rawTemplates, code };
}

export const parser: Parser<Node | undefined> = {
  ...typescript,
  astFormat: PRINTER_NAME,

  async parse(code: string, options: Options): Promise<Node> {
    const preprocessed = preprocess(code, options.filepath);
    const ast = await typescript.parse(preprocessed.code, options);
    assert('expected ast', ast);
    convertAst(ast, preprocessed.rawTemplates);
    return ast;
  },
};
