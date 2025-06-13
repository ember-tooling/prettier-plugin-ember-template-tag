import type { Plugin } from 'prettier';
import { format as prettierFormat } from 'prettier';

import { languages, options, parsers, printers } from '../../src/main.js';
import type { PluginOptions } from '../../src/options.js';

const plugin: Plugin = {
  languages,
  options,
  parsers,
  printers,
};

/**
 * Formats the given code with default options that ensure our plugin is used.
 *
 * Optionally, provide Options overrides, which will be merged with the default
 * options.
 */
export async function format(
  code: string,
  overrides: Partial<PluginOptions> = {},
): Promise<string> {
  return await prettierFormat(code, {
    ...overrides,
    parser: 'ember-template-tag',
    plugins: [plugin],
  });
}
