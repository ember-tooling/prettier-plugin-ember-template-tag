/* eslint-disable jsdoc/require-jsdoc, unicorn/prefer-export-from */
import {
  type Parsed as ContentTag,
  Preprocessor,
  type PreprocessorOptions,
  type Range,
} from 'content-tag';

const BufferMap = new Map<string, Buffer>();

export function getBuffer(string_: string): Buffer {
  let buffer = BufferMap.get(string_);

  if (!buffer) {
    buffer = Buffer.from(string_);
    BufferMap.set(string_, buffer);
  }

  return buffer;
}

export function parse(
  file: string,
  options?: PreprocessorOptions,
): ContentTag[] {
  const preprocessor = new Preprocessor();

  return preprocessor.parse(file, options);
}

export function replaceContents(
  file: string,
  options: {
    contents: string;
    range: Range;
  },
): string {
  const { contents, range } = options;

  return [
    file.slice(0, range.startChar),
    contents,
    file.slice(range.endChar),
  ].join('');
}

export type { ContentTag, Range };
