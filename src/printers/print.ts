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
  return textToDoc(text.trim(), {
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
  const strings: string[] = [];

  // Single pass: collect strings for the hardline/softline decision and
  // simultaneously force any group that contains an HBS comment
  // ({{! ... }} or {{!-- ... --}}) to always expand. This prevents the
  // Glimmer printer from collapsing a component tag onto one line when a
  // Glint annotation comment appears between its attributes.
  const processedContent = AST.utils.mapDoc(content, (node) => {
    if (typeof node === 'string') {
      strings.push(node);
    } else if (
      node &&
      typeof node === 'object' &&
      'type' in node &&
      node.type === 'group'
    ) {
      const groupStrings = flattenDoc(
        (node as { contents: AST.builders.Doc }).contents,
      );
      if (groupStrings.some((s) => s.startsWith('{{!') || s.trim() === '!')) {
        return { ...node, break: true };
      }
    }
    return node;
  });

  const useHardline = strings.some(
    (c) =>
      // contains angle bracket tag
      /<.+>/.test(c) ||
      // contains hbs block
      /{{~?#.+}}/.test(c),
  );
  const line = useHardline ? AST.builders.hardline : AST.builders.softline;

  const doc = [
    TEMPLATE_TAG_OPEN,
    AST.builders.indent([line, AST.builders.group(processedContent)]),
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
