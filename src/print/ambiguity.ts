import type { Node } from '@babel/types';
import type { AstPath, doc, Printer } from 'prettier';
import { printers as estreePrinters } from 'prettier/plugins/estree.js';

import type { PluginOptions } from '../options.js';
import { flattenDoc } from '../utils/doc.js';

const estreePrinter = estreePrinters['estree'] as Printer<Node | undefined>;

/**
 * Search next non EmptyStatement node and set current print, so we can fix it
 * later if its ambiguous
 */
export function saveCurrentPrintOnSiblingNode(
  path: AstPath<Node | undefined>,
  printed: doc.builders.Doc[],
): void {
  const { index, siblings } = path;
  if (index !== null) {
    const nextNode = siblings
      ?.slice(index + 1)
      .find((n) => n?.type !== 'EmptyStatement');
    if (nextNode) {
      nextNode.extra = nextNode.extra || {};
      nextNode.extra['prevTemplatePrinted'] = printed;
    }
  }
}

/** HACK to fix ASI semi-colons. */
export function fixPreviousPrint(
  previousTemplatePrinted: doc.builders.Doc[],
  path: AstPath<Node | undefined>,
  options: PluginOptions,
  print: (path: AstPath<Node | undefined>) => doc.builders.Doc,
  args: unknown,
): void {
  const printedSemiFalse = estreePrinter.print(
    path,
    { ...options, semi: false },
    print,
    args,
  );
  const flat = flattenDoc(printedSemiFalse);
  const previousFlat = flattenDoc(previousTemplatePrinted);
  if (flat[0]?.startsWith(';') && previousFlat.at(-1) !== ';') {
    previousTemplatePrinted.push(';');
  }
}
