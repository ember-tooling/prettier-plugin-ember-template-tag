/* eslint-disable jsdoc/require-jsdoc, unicorn/prefer-export-from, unicorn/prevent-abbreviations */
import {
  type Parsed as ContentTag,
  Preprocessor,
  type PreprocessorOptions,
  type Range,
} from 'content-tag';

const BufferMap = new Map<string, Buffer>();

export function getBuffer(str: string): Buffer {
  let buffer = BufferMap.get(str);

  if (!buffer) {
    buffer = Buffer.from(str);
    BufferMap.set(str, buffer);
  }

  return buffer;
}

export function sliceByteRange(
  str: string,
  indexStart: number,
  indexEnd?: number,
): string {
  const buffer = getBuffer(str);

  return buffer.slice(indexStart, indexEnd).toString();
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
    sliceByteRange(file, 0, range.startByte),
    contents,
    sliceByteRange(file, range.endByte),
  ].join('');
}

export type { ContentTag, Range };
