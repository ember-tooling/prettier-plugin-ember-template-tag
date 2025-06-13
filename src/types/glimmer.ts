import type {
  BlockStatement,
  ExportDefaultDeclaration,
  ExpressionStatement,
  Node,
  ObjectExpression,
  StaticBlock,
  TSAsExpression,
} from '@babel/types';

import type { ContentTag } from '../utils/content-tag.js';

type GlimmerTemplateProperties = (
  | BlockStatement
  | ObjectExpression
  | StaticBlock
) & {
  /**
   * Range of the contents, inclusive of inclusive of the
   * `<template></template>` tags.
   */
  range: [start: number, end: number];

  /** Beginning of the range, before the opening `<template>` tag. */
  start: number;

  /** End of the range, after the closing `</template>` tag. */
  end: number;

  extra: {
    isGlimmerTemplate: true;
    template: ContentTag;
    [key: string]: unknown;
  };
};

type GlimmerTemplate = (BlockStatement | ObjectExpression | StaticBlock) &
  GlimmerTemplateProperties;

/** Returns true if the node is a GlimmerTemplate. */
export function isGlimmerTemplate(node: Node): node is Node & GlimmerTemplate {
  return node.extra?.['isGlimmerTemplate'] === true;
}

export type GlimmerTemplateParent =
  | GlimmerStatementTS
  | GlimmerExportDefaultDeclaration
  | GlimmerExportDefaultDeclarationTS;

/**
 * Type predicate for nodes that should be special-cased as the parent of a
 * GlimmerTemplate.
 */
export function isGlimmerTemplateParent(
  node: Node | undefined,
): node is GlimmerTemplateParent {
  if (!node) return false;

  return (
    isGlimmerStatementTS(node) ||
    isGlimmerExportDefaultDeclaration(node) ||
    isGlimmerExportDefaultDeclarationTS(node)
  );
}

type GlimmerStatementTS = ExpressionStatement & {
  expression: TSAsExpression & {
    expression: ObjectExpression & GlimmerTemplateProperties;
  };
};

/**
 * Type predicate for:
 *
 * ```gts
 * <template></template> as TemplateOnlyComponent<Signature>
 * ```
 */
function isGlimmerStatementTS(node: Node): node is GlimmerStatementTS {
  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'TSAsExpression' &&
    node.expression.expression.type === 'ObjectExpression' &&
    isGlimmerTemplate(node.expression.expression)
  );
}

type GlimmerExportDefaultDeclaration = ExportDefaultDeclaration & {
  declaration: ObjectExpression & GlimmerTemplateProperties;
};

/**
 * Type predicate for:
 *
 * ```gts
 * export default <template></template>;
 * ```
 */
function isGlimmerExportDefaultDeclaration(
  node: Node,
): node is GlimmerExportDefaultDeclaration {
  return (
    node.type === 'ExportDefaultDeclaration' &&
    node.declaration.type === 'ObjectExpression' &&
    isGlimmerTemplate(node.declaration)
  );
}

type GlimmerExportDefaultDeclarationTS = ExportDefaultDeclaration & {
  declaration: TSAsExpression & {
    expression: ObjectExpression & GlimmerTemplateProperties;
  };
};

/**
 * Type predicate for:
 *
 * ```gts
 * export default <template></template> as TemplateOnlyComponent<Signature>
 * ```
 */
function isGlimmerExportDefaultDeclarationTS(
  node: Node,
): node is GlimmerExportDefaultDeclarationTS {
  return (
    node.type === 'ExportDefaultDeclaration' &&
    node.declaration.type === 'TSAsExpression' &&
    node.declaration.expression.type === 'ObjectExpression' &&
    isGlimmerTemplate(node.declaration.expression)
  );
}
