import type { AstPath } from 'prettier';

import type { NodeType } from '../utils/index.js';

export function checkPrettierIgnore(path: AstPath<NodeType>): boolean {
  if (hasPrettierIgnore(path)) {
    return true;
  }

  return (
    Boolean(path.getParentNode()) &&
    path.callParent((parent) => checkPrettierIgnore(parent))
  );
}

export function hasPrettierIgnore(path: AstPath<NodeType>): boolean {
  return path.node?.leadingComments?.at(-1)?.value.trim() === 'prettier-ignore';
}
