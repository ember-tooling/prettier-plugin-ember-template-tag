import traverse from '@babel/traverse';
import type {
  BlockStatement,
  File,
  Node,
  ObjectExpression,
  StaticBlock,
} from '@babel/types';
import type { Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel.js';

import type { PluginOptions } from '../options.js';
import { assert } from '../utils/assert.js';
import { PRINTER_NAME } from '../utils/index.js';
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

function findCorrectCommentBlockIndex(
  comments: File['comments'],
  start: number,
  end: number,
): number {
  if (!comments) {
    return -1;
  }

  return comments.findIndex((comment) => {
    const { start: commentStart, end: commentEnd } = comment;

    return (
      (commentStart === start && commentEnd === end) ||
      (commentStart === start + 1 && commentEnd === end - 1) ||
      (commentStart === start + 7 && commentEnd === end - 1)
    );
  });
}

/** Traverses the AST and replaces the transformed template parts with other AST */
function convertAst(ast: File, templates: Template[]): void {
  traverse(ast, {
    enter(path) {
      if (templates.length === 0) {
        return null;
      }

      const { node } = path;

      switch (node.type) {
        case 'BlockStatement':
        case 'ObjectExpression':
        case 'StaticBlock': {
          const [start, end] = [
            typescript.locStart(node),
            typescript.locEnd(node),
          ];

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

          if (ast.comments && ast.comments.length > 0) {
            const commentBlockIndex = findCorrectCommentBlockIndex(
              ast.comments,
              start,
              end,
            );

            if (commentBlockIndex !== undefined && commentBlockIndex >= 0) {
              ast.comments.splice(commentBlockIndex, 1);
            }
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

  async parse(code: string, options: PluginOptions): Promise<Node> {
    const preprocessed = preprocess(code, options.filepath);

    const ast = await typescript.parse(preprocessed.code, options);
    assert('expected ast', ast);
    convertAst(ast as File, preprocessed.templates);

    return ast;
  },
};
