import type { Options as PrettierOptions } from 'prettier';
import { doc } from 'prettier';

import type { Options } from '../options.js';
import { getTemplateSingleQuote } from '../options.js';
import { flattenDoc } from '../utils/doc.js';
import { TEMPLATE_TAG_CLOSE, TEMPLATE_TAG_OPEN } from '../utils/index.js';

const {
  builders: { group, hardline, indent, softline },
} = doc;

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
    // Don't use our `Options` here even though technically they are available
    // because we don't want to accidentally pass them into `textToDoc`. We
    // should normalize them into standard Prettier options at this point.
    options: PrettierOptions,
  ) => Promise<doc.builders.Doc>,
  options: Options,
): Promise<doc.builders.Doc> {
  return await textToDoc(text.trim(), {
    ...options,
    parser: 'glimmer',
    singleQuote: getTemplateSingleQuote(options),
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
  content: doc.builders.Doc,
): doc.builders.Doc[] {
  const contents = flattenDoc(content);
  const useHardline = contents.some(
    (c) =>
      // contains angle bracket tag
      /<.+>/.test(c) ||
      // contains hbs block
      /{{~?#.+}}/.test(c),
  );
  const line = useHardline ? hardline : softline;
  const doc = [
    TEMPLATE_TAG_OPEN,
    indent([line, group(content)]),
    line,
    TEMPLATE_TAG_CLOSE,
  ];
  return [group(doc)];
}
