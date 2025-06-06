import { traverse } from '@babel/core';
import type {
  BlockStatement,
  File,
  Node,
  ObjectExpression,
  StaticBlock,
} from '@babel/types';
import { Preprocessor } from 'content-tag';
import type { Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel.js';

import { PRINTER_NAME } from '../config.js';
import type { Options } from '../options.js';
import { assert } from '../utils/assert.js';
import {
  byteToCharIndex,
  preprocessTemplateRange,
  type Template,
} from './preprocess.js';

const typescript = babelParsers['babel-ts'] as Parser<Node | undefined>;
const p = new Preprocessor();

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
  const unprocessedTemplates = [...templates];

  traverse(ast, {
    enter(path) {
      const { node } = path;
      if (
        node.type === 'BlockStatement' ||
        node.type === 'ObjectExpression' ||
        node.type === 'StaticBlock'
      ) {
        const { range } = node;
        assert('expected range', range);
        const [start, end] = range;

        const templateIndex = unprocessedTemplates.findIndex(
          (t) =>
            (t.utf16Range.start === start && t.utf16Range.end === end) ||
            (node.type === 'ObjectExpression' &&
              t.utf16Range.start === start - 1 &&
              t.utf16Range.end === end + 1),
        );
        if (templateIndex > -1) {
          const rawTemplate = unprocessedTemplates.splice(templateIndex, 1)[0];
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
        } else {
          return null;
        }
      }

      return null;
    },
  });

  if (unprocessedTemplates.length > 0) {
    throw new Error(
      `failed to process all templates, ${unprocessedTemplates.length} remaining`,
    );
  }
}

/**
 * Pre-processes the template info, parsing the template content to Glimmer AST,
 * fixing the offsets and locations of all nodes also calculates the block
 * params locations & ranges and adding it to the info
 */
export function preprocess(
  code: string,
  fileName: string,
): {
  code: string;
  templates: Template[];
} {
  const templates = codeToGlimmerAst(code, fileName);

  for (const template of templates) {
    code = preprocessTemplateRange(template, code);
  }

  return { templates, code };
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

/** Pre-processes the template info, parsing the template content to Glimmer AST. */
export function codeToGlimmerAst(code: string, filename: string): Template[] {
  const rawTemplates = p.parse(code, { filename });
  const templates: Template[] = rawTemplates.map((r) => ({
    type: r.type,
    range: r.range,
    contentRange: r.contentRange,
    contents: r.contents,
    utf16Range: {
      start: byteToCharIndex(code, r.range.start),
      end: byteToCharIndex(code, r.range.end),
    },
  }));

  return templates;
}
