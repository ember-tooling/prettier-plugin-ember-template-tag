import {
  getBuffer,
  parse,
  type Range,
  replaceContents,
  sliceByteRange,
} from '../utils/content-tag.js';

export interface Template {
  contentRange: Range;
  contents: string;
  range: Range;
  type: 'class-member' | 'expression';
  utf16Range: {
    end: number;
    start: number;
  };
}

const PLACEHOLDER = '~';

/**
 * Replace the template with a parsable placeholder that takes up the same
 * range.
 */
export function preprocessTemplateRange(
  template: Template,
  code: string,
): string {
  let prefix: string;
  let suffix: string;

  if (template.type === 'class-member') {
    // Replace with StaticBlock
    prefix = 'static{t:`';
    suffix = '`}';
  } else {
    // Replace with BlockStatement or ObjectExpression
    prefix = '{t:`';
    suffix = '`}';

    const nextToken = sliceByteRange(code, template.range.endByte).match(/\S+/);

    if (nextToken && (nextToken[0] === 'as' || nextToken[0] === 'satisfies')) {
      // Replace with parenthesized ObjectExpression
      prefix = '(' + prefix;
      suffix = suffix + ')';
    }
  }

  // We need to replace forward slash with _something else_, because
  // forward slash breaks the parsed templates.
  const contents = template.contents.replaceAll('/', PLACEHOLDER);

  const templateLength = template.range.endByte - template.range.startByte;
  const spaces =
    templateLength - getBuffer(contents).length - prefix.length - suffix.length;

  return replaceContents(code, {
    contents: [prefix, contents, ' '.repeat(spaces), suffix].join(''),
    range: template.range,
  });
}

/** Pre-processes the template info, parsing the template content to Glimmer AST. */
export function codeToGlimmerAst(code: string, filename: string): Template[] {
  const contentTags = parse(code, { filename });

  const templates: Template[] = contentTags.map((contentTag) => {
    const { contentRange, contents, range, type } = contentTag;

    const utf16Range = {
      end: sliceByteRange(code, 0, range.endByte).length,
      start: sliceByteRange(code, 0, range.startByte).length,
    };

    return {
      contentRange,
      contents,
      range,
      type,
      utf16Range,
    };
  });

  return templates;
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

  return { code, templates };
}
