import type { Node } from '@babel/types';
import type { Printer } from 'prettier';

export type NodeType = Node | undefined;

/**
 * The type of the `print` callback that prettier passes to a printer's `print`
 * method. We derive it from prettier's own `Printer` type so it stays correct
 * across prettier versions (the signature changed in 3.9).
 */
export type PrettierPrint = Parameters<Printer<NodeType>['print']>[2];

export const PARSER_NAME = 'ember-template-tag';
export const PRINTER_NAME = 'ember-template-tag-estree';

export const TEMPLATE_TAG_OPEN = '<template>';
export const TEMPLATE_TAG_CLOSE = '</template>';
