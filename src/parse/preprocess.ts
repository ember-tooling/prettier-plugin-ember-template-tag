import { getBuffer, parse, type Range } from '../utils/content-tag.js';

export interface Template {
  contents: string;
  type: string;
  range: Range;
  utf16Range: {
    start: number;
    end: number;
  };
}

const PLACEHOLDER = '~';

/** Slice string using byte range */
function sliceByteRange(s: string, a: number, b?: number): string {
  const buf = getBuffer(s);
  return buf.subarray(a, b).toString();
}

/** Converts byte index to js char index (utf16) */
function byteToCharIndex(s: string, byteOffset: number): number {
  const buf = getBuffer(s);
  return buf.subarray(0, byteOffset).toString().length;
}

function replaceRange(
  s: string,
  start: number,
  end: number,
  substitute: string,
): string {
  return sliceByteRange(s, 0, start) + substitute + sliceByteRange(s, end);
}

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
    prefix = 'static{/*';
    suffix = '*/}';
  } else {
    // Replace with BlockStatement or ObjectExpression
    prefix = '{/*';
    suffix = '*/}';

    const nextToken = code.slice(template.range.end).toString().match(/\S+/);

    if (nextToken && (nextToken[0] === 'as' || nextToken[0] === 'satisfies')) {
      // Replace with parenthesized ObjectExpression
      prefix = '(' + prefix;
      suffix = suffix + ')';
    }
  }

  // We need to replace forward slash with _something else_, because
  // forward slash breaks the parsed templates.
  const content = template.contents.replaceAll('/', PLACEHOLDER);

  const tplLength = template.range.end - template.range.start;
  const spaces =
    tplLength - getBuffer(content).length - prefix.length - suffix.length;
  const total = prefix + content + ' '.repeat(spaces) + suffix;

  return replaceRange(code, template.range.start, template.range.end, total);
}

/** Pre-processes the template info, parsing the template content to Glimmer AST. */
export function codeToGlimmerAst(code: string, filename: string): Template[] {
  const rawTemplates = parse(code, { filename });

  const templates: Template[] = rawTemplates.map((r) => ({
    type: r.type,
    range: r.range,
    contentRange: r.contentRange,
    contents: r.contents,
    utf16Range: {
      start: byteToCharIndex(code, r.range.start),
      end: byteToCharIndex(code, r.range.end),
    },
  }));

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

  return { templates, code };
}
