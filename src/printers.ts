import { type AstPath, doc as AST, type Printer } from 'prettier';
import { printers as prettierPrinters } from 'prettier/plugins/estree';

import type { PluginOptions } from './options.js';
import {
  checkPrettierIgnore,
  docMatchesString,
  fixPreviousPrint,
  printRawText,
  printTemplateContent,
  printTemplateTag,
  saveCurrentPrintOnSiblingNode,
  trimPrinted,
} from './printers/index.js';
import { isGlimmerTemplate, isGlimmerTemplateParent } from './types/glimmer.js';
import { assert } from './utils/assert.js';
import { type NodeType, PRINTER_NAME } from './utils/index.js';

const printer = prettierPrinters['estree'] as Printer<NodeType>;

function embed(path: AstPath<NodeType>, options: PluginOptions<NodeType>) {
  const { node } = path;

  return async (
    textToDoc: (
      text: string,
      options: PluginOptions<NodeType>,
    ) => Promise<AST.builders.Doc>,
  ) => {
    if (node && isGlimmerTemplate(node)) {
      if (checkPrettierIgnore(path)) {
        return printRawText(path, options);
      }

      try {
        const content = await printTemplateContent(
          node.extra.template.contents,
          textToDoc,
          options,
        );

        const printed = printTemplateTag(content);
        saveCurrentPrintOnSiblingNode(path, printed);
        return printed;
      } catch (error) {
        console.error(error);
        const printed = [printRawText(path, options)];
        saveCurrentPrintOnSiblingNode(path, printed);
        return printed;
      }
    }

    // Nothing to embed, so move on to the regular printer.
    return;
  };
}

function getVisitorKeys(node: NodeType, nonTraversableKeys: Set<string>) {
  if (node && isGlimmerTemplate(node)) {
    return [];
  }
  return printer.getVisitorKeys?.(node, nonTraversableKeys) || [];
}

function print(
  path: AstPath<NodeType>,
  options: PluginOptions<NodeType>,
  print: (path: AstPath<NodeType>) => AST.builders.Doc,
  args?: unknown,
) {
  const { node } = path;

  if (isGlimmerTemplateParent(node)) {
    if (checkPrettierIgnore(path)) {
      return printRawText(path, options);
    } else {
      let printed = printer.print(path, options, print, args);

      assert('Expected Glimmer doc to be an array', Array.isArray(printed));
      trimPrinted(printed);

      // Remove semicolons so we can manage them ourselves
      if (docMatchesString(printed[0], ';')) {
        printed.shift();
      }
      if (docMatchesString(printed.at(-1), ';')) {
        printed.pop();
      }

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
      node.extra['prevTemplatePrinted'] as AST.builders.Doc[],
      path,
      options,
      print,
      args,
    );
  }

  return printer.print(path, options, print, args);
}

function printPrettierIgnored(
  path: AstPath<NodeType>,
  options: PluginOptions<NodeType>,
) {
  return printRawText(path, options);
}

export const printers: Record<string, Printer<NodeType>> = {
  [PRINTER_NAME]: {
    ...printer,
    // @ts-expect-error: Type <...> is not assignable to <...>
    embed,
    getVisitorKeys,
    print,
    printPrettierIgnored,
  },
};
