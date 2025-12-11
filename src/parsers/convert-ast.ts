import traverse from '@babel/traverse';
import type {
  BlockStatement,
  File,
  ObjectExpression,
  StaticBlock,
} from '@babel/types';
import type { Parser } from 'prettier';

import type { NodeType } from '../utils/index.js';
import type { Template } from './preprocess.js';

type Data = {
  parser: Parser<NodeType>;
  templates: Template[];
};

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
export function convertAst(ast: File, data: Data): void {
  const { parser, templates } = data;

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
          const [start, end] = [parser.locStart(node), parser.locEnd(node)];

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
