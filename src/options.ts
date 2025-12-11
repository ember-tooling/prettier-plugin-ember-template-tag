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
