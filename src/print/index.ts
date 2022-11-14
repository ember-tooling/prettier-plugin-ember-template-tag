import type { AstPath, doc, Plugin, Printer } from 'prettier';

import {
  TEMPLATE_TAG_CLOSE,
  TEMPLATE_TAG_OPEN,
  TEMPLATE_TAG_PLACEHOLDER,
} from '../config';
import type { Options } from '../options';
import type { BaseNode } from '../types/ast';
import {
  getGlimmerExpression,
  isGlimmerExportDefaultDeclarationPath,
  isGlimmerExportDefaultDeclarationTSPath,
  isGlimmerExpressionStatementPath,
  isGlimmerExpressionStatementTSPath,
} from '../types/glimmer';
import {
  isGlimmerArrayExpressionPath,
  isGlimmerClassPropertyPath,
} from '../types/raw';
import { assert, assertExists } from '../utils/index';
import { printTemplateTag } from './template';

// @ts-expect-error FIXME: HACK because estree printer isn't exported. See below.
export const printer: Printer<BaseNode> = {};

/**
 * FIXME: HACK because estree printer isn't exported.
 *
 * @see https://github.com/prettier/prettier/issues/10259
 * @see https://github.com/prettier/prettier/issues/4424
 */
export function definePrinter(options: Options): void {
  const estreePlugin = assertExists(options.plugins.find(isEstreePlugin));
  const estreePrinter = estreePlugin.printers.estree;

  const defaultHasPrettierIgnore = assertExists(
    estreePrinter.hasPrettierIgnore
  );

  // Part of the HACK described above
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const defaultPrint = estreePrinter.print;

  Reflect.setPrototypeOf(
    printer,
    Object.create(estreePrinter) as Printer<BaseNode>
  );

  printer.print = (
    path: AstPath<BaseNode>,
    options: Options,
    print: (path: AstPath<BaseNode>) => doc.builders.Doc,
    args: unknown
  ) => {
    const hasPrettierIgnore = checkPrettierIgnore(
      path,
      defaultHasPrettierIgnore
    );

    if (
      isGlimmerExportDefaultDeclarationPath(path) ||
      isGlimmerExportDefaultDeclarationTSPath(path) ||
      isGlimmerExpressionStatementPath(path) ||
      isGlimmerExpressionStatementTSPath(path)
    ) {
      if (hasPrettierIgnore) {
        return printRawText(path, options);
      } else {
        const printed = defaultPrint(path, options, print, args);
        const glimmerExpression = getGlimmerExpression(path);

        assert(
          'Expected GlimmerExpression doc to be an array',
          Array.isArray(printed)
        );

        // Remove the semicolons that Prettier added so we can manage them
        let adjusted = printed.filter(
          (doc) => typeof doc !== 'string' || doc !== ';'
        );

        // FIXME: Make configurable
        if (
          !options.templateExportDefault &&
          docMatchesString(adjusted[0], 'export') &&
          docMatchesString(adjusted[1], 'default')
        ) {
          adjusted = adjusted.slice(2);
          if (docMatchesString(adjusted[0], '')) {
            adjusted = adjusted.slice(1);
          }
        }

        if (options.semi && glimmerExpression.extra.forceSemi) {
          // We only need to push the semi-colon in semi: true mode because
          // in semi: false mode, the ambiguous statement will get a prefixing
          // semicolon
          adjusted.push(';');
        }

        return adjusted;
      }
    } else {
      if (hasPrettierIgnore) {
        return printRawText(path, options);
      } else {
        return defaultPrint(path, options, print, args);
      }
    }
  };

  /** Prints embedded GlimmerExpressions. */
  printer.embed = (path, _print, textToDoc, embedOptions) => {
    const hasPrettierIgnore = checkPrettierIgnore(
      path,
      defaultHasPrettierIgnore
    );

    if (isGlimmerClassPropertyPath(path)) {
      return printTemplateTag(
        path.getValue().key.arguments[0],
        textToDoc,
        embedOptions,
        hasPrettierIgnore
      );
    } else if (isGlimmerArrayExpressionPath(path)) {
      return printTemplateTag(
        path.getValue().elements[0].arguments[0],
        textToDoc,
        embedOptions,
        hasPrettierIgnore
      );
    } else {
      // Nothing to embed, so move on to the regular printer.
      return null;
    }
  };

  /**
   * Turn off built-in prettier-ignore handling because it will skip embedding,
   * which will print `[__GLIMMER_TEMPLATE(...)]` instead of
   * `<template>...</template>`.
   */
  printer.hasPrettierIgnore = (_path): boolean => {
    return false;
  };
}

function isEstreePlugin(
  plugin: string | Plugin<BaseNode>
): plugin is Plugin<BaseNode> & {
  printers: { estree: Printer<BaseNode> };
} {
  return Boolean(
    typeof plugin !== 'string' && plugin.printers && plugin.printers.estree
  );
}

function printRawText(path: AstPath<BaseNode>, options: Options): string {
  const node = path.getValue();
  assert('expected start', node.start);
  assert('expected end', node.end);
  let raw = options.originalText.slice(node.start, node.end);

  if (!options.__inputWasPreprocessed) {
    // HACK: We don't have access to the original raw text :-(
    raw = raw.replaceAll(`[${TEMPLATE_TAG_PLACEHOLDER}(\``, TEMPLATE_TAG_OPEN);
    raw = raw.replaceAll('`, { strictMode: true })]', TEMPLATE_TAG_CLOSE);
  }

  return raw;
}

function checkPrettierIgnore(
  path: AstPath<BaseNode>,
  hasPrettierIgnore: (path: AstPath<BaseNode>) => boolean
): boolean {
  return (
    hasPrettierIgnore(path) ||
    (!!path.getParentNode() &&
      path.callParent((parent) =>
        checkPrettierIgnore(parent, hasPrettierIgnore)
      ))
  );
}

function docMatchesString(
  doc: doc.builders.Doc | undefined,
  string: string
): doc is string {
  return typeof doc === 'string' && doc.trim() === string;
}
