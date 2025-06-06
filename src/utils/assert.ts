/**
 * Throws an error if the condition is false.
 *
 * If no condition is provided, will always throw.
 */
export function assert(
  message: string,
  condition?: unknown,
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
