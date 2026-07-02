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
