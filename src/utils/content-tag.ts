/* eslint-disable @typescript-eslint/consistent-type-definitions, eslint-comments/disable-enable-pair, jsdoc/require-jsdoc, unicorn/prefer-export-from */
import {
  type Parsed as ContentTag,
  Preprocessor,
  type PreprocessorOptions,
} from 'content-tag';

type Range = {
  end: number;
  start: number;
};

export function parse(
  file: string,
  options?: PreprocessorOptions,
): ContentTag[] {
  const preprocessor = new Preprocessor();

  return preprocessor.parse(file, options);
}

export type { ContentTag, Range };
