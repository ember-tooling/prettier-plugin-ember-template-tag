import { traverse } from '@babel/core';
import type {
  BlockStatement,
  File,
  ObjectExpression,
  StaticBlock,
} from '@babel/types';

import { assert } from '../utils/assert.js';
import type { Template } from './preprocess.js';

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
export function convertAst(ast: File, templates: Template[]): void {
  traverse(ast, {
    enter(path) {
      const { node } = path;

      switch (node.type) {
        case 'BlockStatement':
        case 'ObjectExpression':
        case 'StaticBlock': {
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
