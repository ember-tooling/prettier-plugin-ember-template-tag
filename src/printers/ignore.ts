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
  let possibleComment = path.node?.leadingComments?.at(-1)?.value.trim();

  // @ts-expect-error Comments exist on node sometimes
  if (!path.node?.leadingComments && path.node?.comments) {
    // @ts-expect-error Comments exist on node sometimes
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    possibleComment = path.node.comments?.at(-1)?.value.trim();
  }

  return possibleComment === 'prettier-ignore';
}
