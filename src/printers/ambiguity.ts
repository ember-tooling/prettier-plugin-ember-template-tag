import type { AstPath, doc as AST, Printer } from 'prettier';
import { printers as prettierPrinters } from 'prettier/plugins/estree';

import type { PluginOptions } from '../options.js';
import { flattenDoc } from '../utils/doc.js';
import type { NodeType } from '../utils/index.js';

const printer = prettierPrinters['estree'] as Printer<NodeType>;

/**
 * Search next non EmptyStatement node and set current print, so we can fix it
 * later if its ambiguous
 */
export function saveCurrentPrintOnSiblingNode(
  path: AstPath<NodeType>,
  printed: AST.builders.Doc[],
): void {
  const { index, siblings } = path;

  if (index === null) {
    return;
  }

  const nextNode = siblings
    ?.slice(index + 1)
    .find((n) => n?.type !== 'EmptyStatement');

  if (nextNode) {
    nextNode.extra = nextNode.extra || {};
    nextNode.extra['prevTemplatePrinted'] = printed;
  }
}

/** HACK to fix ASI semi-colons. */
export function fixPreviousPrint(
  previousTemplatePrinted: AST.builders.Doc[],
  path: AstPath<NodeType>,
  options: PluginOptions,
  print: (path: AstPath<NodeType>) => AST.builders.Doc,
  args: unknown,
): void {
  const printedSemiFalse = printer.print(
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
