import type { Node } from '@babel/types';

export type NodeType = Node | undefined;

export const PARSER_NAME = 'ember-template-tag';
export const PRINTER_NAME = 'ember-template-tag-estree';

export const TEMPLATE_TAG_OPEN = '<template>';
export const TEMPLATE_TAG_CLOSE = '</template>';
