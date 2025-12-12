import { type AstPath, doc as AST } from 'prettier';

import type { PluginOptions } from '../options.js';
import { isGlimmerTemplate } from '../types/glimmer.js';
import { assert } from '../utils/assert.js';
import { flattenDoc } from '../utils/doc.js';
import {
  type NodeType,
  TEMPLATE_TAG_CLOSE,
  TEMPLATE_TAG_OPEN,
} from '../utils/index.js';

export function docMatchesString(
  doc: AST.builders.Doc | undefined,
  string: string,
): doc is string {
  return typeof doc === 'string' && doc.trim() === string;
}

export function printRawText(
  { node }: AstPath<NodeType>,
  options: PluginOptions,
): string {
  if (!node) {
    return '';
  }

  if (isGlimmerTemplate(node)) {
    return (
      TEMPLATE_TAG_OPEN + node.extra.template.contents + TEMPLATE_TAG_CLOSE
    );
  }

  assert('expected start', typeof node.start == 'number');
  assert('expected end', typeof node.end == 'number');

  return options.originalText.slice(node.start, node.end);
}

/**
 * Returns a Prettier `Doc` for the given `TemplateLiteral` contents formatted
 * using Prettier's built-in glimmer parser.
 *
 * NOTE: The contents are not surrounded with "`"
 */
export async function printTemplateContent(
  text: string,
  textToDoc: (
    text: string,
    options: PluginOptions<NodeType>,
  ) => Promise<AST.builders.Doc>,
  options: PluginOptions,
): Promise<AST.builders.Doc> {
  return await textToDoc(text.trim(), {
    ...options,
    parser: 'glimmer',
    singleQuote: options.templateSingleQuote ?? options.singleQuote,
  });
}

/**
 * Prints the given template content as a template tag.
 *
 * If `useHardline` is `true`, will use Prettier's hardline builder to force
 * each tag to print on a new line.
 *
 * If `useHardline` is `false`, will use Prettier's softline builder to allow
 * the tags to print on the same line if they fit.
 */
export function printTemplateTag(
  content: AST.builders.Doc,
): AST.builders.Doc[] {
  const contents = flattenDoc(content);

  const useHardline = contents.some(
    (c) =>
      // contains angle bracket tag
      /<.+>/.test(c) ||
      // contains hbs block
      /{{~?#.+}}/.test(c),
  );
  const line = useHardline ? AST.builders.hardline : AST.builders.softline;

  const doc = [
    TEMPLATE_TAG_OPEN,
    AST.builders.indent([line, AST.builders.group(content)]),
    line,
    TEMPLATE_TAG_CLOSE,
  ];

  return [AST.builders.group(doc)];
}

/** Remove the empty strings that Prettier added so we can manage them. */
export function trimPrinted(printed: AST.builders.Doc[]): void {
  while (docMatchesString(printed[0], '')) {
    printed.shift();
  }

  while (docMatchesString(printed.at(-1), '')) {
    printed.pop();
  }
}
