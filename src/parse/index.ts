import { traverse } from '@babel/core';
import type {
  BlockStatement,
  File,
  Node,
  StaticBlock,
  TaggedTemplateExpression,
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
  node: BlockStatement | TaggedTemplateExpression | StaticBlock,
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
        case 'StaticBlock':
        case 'TaggedTemplateExpression': {
          const range = [typescript.locStart(node), typescript.locEnd(node)];
          assert('expected range', typeof range[0] === 'number' && typeof range[1] === 'number');
          const [start, end] = range;

          const templateIndex = templates.findIndex((template) => {
            const { utf16Range } = template;

            if (utf16Range.start === start && utf16Range.end === end) {
              return true;
            }

            return false;
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
