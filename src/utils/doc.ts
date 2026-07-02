import { doc as AST } from 'prettier';

/**
 * Flattens the given doc into a string array, tossing line breaks, etc, for
 * analysis.
 */
export function flattenDoc(doc: AST.builders.Doc): string[] {
  if (Array.isArray(doc)) {
    return doc.flatMap(flattenDoc);
  } else if (typeof doc === 'string') {
    return [doc];
  } else if ('contents' in doc) {
    return flattenDoc(doc.contents);
  } else {
    return [];
  }
}

/**
 * Traverses a Prettier doc and forces any groups that contain HBS comments
 * (`{{! ... }}` or `{{!-- ... --}}`) to always break onto multiple lines.
 *
 * This prevents the Glimmer printer from collapsing component tags onto a
 * single line when a comment (e.g. `{{! @glint-expect-error }}`) appears
 * between attributes.
 */
export function forceBreakGroupsWithComments(
  doc: AST.builders.Doc,
): AST.builders.Doc {
  return AST.utils.mapDoc(doc, (node) => {
    if (
      node &&
      typeof node === 'object' &&
      'type' in node &&
      node.type === 'group'
    ) {
      const flat = flattenDoc(node.contents);
      // HBS comments may appear in the doc in two forms depending on context:
      //   1. As a complete string starting with '{{!' (embed context)
      //   2. As a standalone '!' token (standalone glimmer printer context)
      const hasComment = flat.some(
        (s) => s.startsWith('{{!') || s.trim() === '!',
      );
      if (hasComment) {
        const contents = Array.isArray(node.contents)
          ? [AST.builders.breakParent, ...node.contents]
          : [AST.builders.breakParent, node.contents];
        return { ...node, contents };
      }
    }
    return node;
  });
}
