export interface Template {
  contents: string;
  type: string;
  range: {
    start: number;
    end: number;
  };
  utf16Range: {
    start: number;
    end: number;
  };
}

const BufferMap: Map<string, Buffer> = new Map();

export const PLACEHOLDER = '~';

function getBuffer(s: string): Buffer {
  let buf = BufferMap.get(s);
  if (!buf) {
    buf = Buffer.from(s);
    BufferMap.set(s, buf);
  }
  return buf;
}

/** Slice string using byte range */
export function sliceByteRange(s: string, a: number, b?: number): string {
  const buf = getBuffer(s);
  return buf.subarray(a, b).toString();
}

/** Converts byte index to js char index (utf16) */
export function byteToCharIndex(s: string, byteOffset: number): number {
  const buf = getBuffer(s);
  return buf.subarray(0, byteOffset).toString().length;
}

/** Calculate byte length */
export function byteLength(s: string): number {
  return getBuffer(s).length;
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
    tplLength - byteLength(content) - prefix.length - suffix.length;
  const total = prefix + content + ' '.repeat(spaces) + suffix;
  return replaceRange(code, template.range.start, template.range.end, total);
}
