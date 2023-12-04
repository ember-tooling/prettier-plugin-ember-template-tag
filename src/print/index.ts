import type { Node } from '@babel/types';
import type {
  AstPath,
  doc,
  Options as PrettierOptions,
  Printer,
} from 'prettier';
import { printers as estreePrinters } from 'prettier/plugins/estree.js';

import type { Options } from '../options.js';
import { getGlimmerTemplate, isGlimmerTemplate } from '../types/glimmer.js';
import { assert } from '../utils/index.js';
import {
  fixPreviousPrint,
  saveCurrentPrintOnSiblingNode,
} from './ambiguity.js';
import { printTemplateContent, printTemplateTag } from './template.js';

const estreePrinter = estreePrinters['estree'] as Printer<Node | undefined>;

export const printer: Printer<Node | undefined> = {
  ...estreePrinter,

  getVisitorKeys(node, nonTraversableKeys) {
    if (!node || isGlimmerTemplate(node)) {
      return [];
    }
    return estreePrinter.getVisitorKeys?.(node, nonTraversableKeys) || [];
  },

  print(
    path: AstPath<Node | undefined>,
    options: Options,
    print: (path: AstPath<Node | undefined>) => doc.builders.Doc,
    args: unknown,
  ) {
    const { node } = path;
    const hasPrettierIgnore = checkPrettierIgnore(path);
    if (getGlimmerTemplate(node)) {
      if (hasPrettierIgnore) {
        return printRawText(path, options);
      } else {
        let printed = estreePrinter.print(path, options, print, args);
        assert('Expected Glimmer doc to be an array', Array.isArray(printed));
        trimPrinted(printed);

        // Always remove export default so we start with a blank slate
        if (
          docMatchesString(printed[0], 'export') &&
          docMatchesString(printed[1], 'default')
        ) {
          printed = printed.slice(2);
          trimPrinted(printed);
        }

        if (options.templateExportDefault) {
          printed.unshift('export ', 'default ');
        }

        saveCurrentPrintOnSiblingNode(path, printed);
        return printed;
      }
    }

    if (options.semi && node?.extra?.['prevTemplatePrinted']) {
      fixPreviousPrint(
        node.extra['prevTemplatePrinted'] as doc.builders.Doc[],
        path,
        options,
        print,
        args,
      );
    }

    return hasPrettierIgnore
      ? printRawText(path, options)
      : estreePrinter.print(path, options, print, args);
  },

  /** Prints embedded GlimmerExpressions/GlimmerTemplates. */
  embed(path: AstPath<Node | undefined>, embedOptions: PrettierOptions) {
    const { node } = path;

    const hasPrettierIgnore = checkPrettierIgnore(path);

    if (hasPrettierIgnore) {
      return printRawText(path, embedOptions as Options);
    }

    return async (textToDoc) => {
      if (node && isGlimmerTemplate(node)) {
        try {
          const content = await printTemplateContent(
            node.extra.template,
            textToDoc,
            embedOptions as Options,
          );

          const printed = printTemplateTag(
            content,
            node.extra.isDefaultTemplate,
          );
          saveCurrentPrintOnSiblingNode(path, printed);
          return printed;
        } catch {
          const printed = [printRawText(path, embedOptions as Options)];
          saveCurrentPrintOnSiblingNode(path, printed);
          return printed;
        }
      }

      // Nothing to embed, so move on to the regular printer.
      return;
    };
  },
};

/** Remove the empty strings that Prettier added so we can manage them. */
function trimPrinted(printed: doc.builders.Doc[]): void {
  while (docMatchesString(printed[0], '')) {
    printed.shift();
  }
}

function printRawText(
  { node }: AstPath<Node | undefined>,
  options: Options,
): string {
  if (!node) {
    return '';
  }
  assert('expected start', typeof node.start == 'number');
  assert('expected end', typeof node.end == 'number');
  return options.originalText.slice(node.start, node.end);
}

function hasPrettierIgnore(path: AstPath<Node | undefined>): boolean {
  return path.node?.leadingComments?.at(-1)?.value.trim() === 'prettier-ignore';
}

function checkPrettierIgnore(path: AstPath<Node | undefined>): boolean {
  return (
    hasPrettierIgnore(path) ||
    (!!path.getParentNode() &&
      path.callParent((parent) => checkPrettierIgnore(parent)))
  );
}

function docMatchesString(
  doc: doc.builders.Doc | undefined,
  string: string,
): doc is string {
  return typeof doc === 'string' && doc.trim() === string;
}
