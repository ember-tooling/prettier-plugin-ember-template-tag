import { traverse } from '@babel/core';
import type {
  BlockStatement,
  File,
  Node,
  ObjectExpression,
  StaticBlock,
} from '@babel/types';
import type { Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel.js';

import { PRINTER_NAME } from '../config.js';
import type { Options } from '../options.js';
import { assert } from '../utils/assert.js';
import { preprocess, type Template } from './preprocess.js';

const typescript = babelParsers['babel-ts'] as Parser<Node | undefined>;

/** Converts a node into a GlimmerTemplate node */
function convertNode(
  node: BlockStatement | ObjectExpression | StaticBlock,
  rawTemplate: Template,
): void {
  node.innerComments = [];
  node.extra = Object.assign(node.extra ?? {}, {
    isGlimmerTemplate: true as const,
    template: rawTemplate,
  });
}

/** Traverses the AST and replaces the transformed template parts with other AST */
function convertAst(ast: File, templates: Template[]): void {
  traverse(ast, {
    enter(path) {
      const { node } = path;

      switch (node.type) {
        case 'BlockStatement':
        case 'ObjectExpression':
        case 'StaticBlock': {
          if (!node.range) {
            // prettier 3.7.0 onwards removed `node.range`
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            node.range = [node.start!, node.end!];
          }
          assert('expected range', node.range);
          const [start, end] = node.range;

          const templateIndex = templates.findIndex((template) => {
            const { utf16Range } = template;

            if (utf16Range.start === start && utf16Range.end === end) {
              return true;
            }

            return (
              node.type === 'ObjectExpression' &&
              utf16Range.start === start - 1 &&
              utf16Range.end === end + 1
            );
          });

          if (templateIndex === -1) {
            return null;
          }

          const rawTemplate = templates.splice(templateIndex, 1)[0];

          if (!rawTemplate) {
            throw new Error(
              'expected raw template because splice index came from findIndex',
            );
          }

          const index =
            node.innerComments?.[0] &&
            ast.comments?.indexOf(node.innerComments[0]);

          if (ast.comments && index !== undefined && index >= 0) {
            ast.comments.splice(index, 1);
          }

          convertNode(node, rawTemplate);
        }
      }

      return null;
    },
  });

  if (templates.length > 0) {
    throw new Error(
      `failed to process all templates, ${templates.length} remaining`,
    );
  }
}

export const parser: Parser<Node | undefined> = {
  ...typescript,
  astFormat: PRINTER_NAME,

  async parse(code: string, options: Options): Promise<Node> {
    const preprocessed = preprocess(code, options.filepath);

    const ast = await typescript.parse(preprocessed.code, options);
    assert('expected ast', ast);
    convertAst(ast as File, preprocessed.templates);

    return ast;
  },
};
