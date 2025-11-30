import {
  parse,
  type Range,
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

/**
 * Replace the template with a parsable placeholder that takes up the same
 * range.
 */
export function preprocessTemplateRange(
  template: Template,
  code: string,
): string {
  const { start, end } = template.utf16Range;
  const after = code.slice(end);

  let prefix: string;
  let suffix: string;

  if (template.type === 'class-member') {
    // Replace with StaticBlock
    prefix = 'static{/*';
    suffix = '*/}';
  } else {
    // Replace with BlockStatement or ObjectExpression
    prefix = '{/*';
    suffix = '*/}';

    const nextToken = after.match(/\S+/);

    if (nextToken && (nextToken[0] === 'as' || nextToken[0] === 'satisfies')) {
      // Replace with parenthesized ObjectExpression
      prefix = '(' + prefix;
      suffix = suffix + ')';
    }
  }

  const before = code.slice(0, start);
  const spaces = code
    .slice(start + prefix.length, end - suffix.length)
    // Replace everything except `\n` with space, so the line and column remain correct
    // Prettier normalized EOL to `\n`, so we don't need worry about `\r` and `\r\n`
    .replaceAll(/[^\n]/g, ' ');

  return before + prefix + spaces + suffix + after;
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
