import type {
  BooleanSupportOption,
  ParserOptions,
  SupportOptions,
} from 'prettier';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PluginOptions<T = any> extends ParserOptions<T> {
  templateExportDefault?: boolean;
  templateSingleQuote?: boolean;
}

const templateExportDefault: BooleanSupportOption = {
  category: 'Format',
  default: false,
  description:
    'Prepend default export template tags with "export default". Since 0.1.0.',
  type: 'boolean',
};

/**
 * Extracts a valid `templateSingleQuote` option out of the provided options. If
 * `templateSingleQuote` is defined, it will be used, otherwise the value for
 * `singleQuote` will be inherited.
 */
export function getTemplateSingleQuote(options: PluginOptions): boolean {
  const { singleQuote, templateSingleQuote } = options;
  return typeof templateSingleQuote === 'boolean'
    ? templateSingleQuote
    : singleQuote;
}

const templateSingleQuote: BooleanSupportOption = {
  category: 'Format',
  description:
    'Use single quotes instead of double quotes within template tags. Since 0.0.3.',
  type: 'boolean',
};

export const options: SupportOptions = {
  templateExportDefault,
  templateSingleQuote,
};
