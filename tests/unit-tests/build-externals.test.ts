import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

describe('build externals', () => {
  const distributionPath = path.resolve(
    import.meta.dirname,
    '../../dist/prettier-plugin-ember-template-tag.js',
  );

  test('prettier/plugins/estree is externalized, not bundled', () => {
    const distribution = readFileSync(distributionPath, 'utf8');

    // The dist should reference estree as an external dependency (require or import)
    expect(distribution).toMatch(
      /require\(["']prettier\/plugins\/estree["']\)|from\s+["']prettier\/plugins\/estree["']/,
    );

    // The dist should NOT contain estree printer internals (canAttachComment is
    // a function from the estree printer that would be present if bundled)
    expect(distribution).not.toMatch(/function\s+\w*canAttachComment/);
  });

  test('prettier/plugins/babel is externalized, not bundled', () => {
    const distribution = readFileSync(distributionPath, 'utf8');

    expect(distribution).toMatch(
      /require\(["']prettier\/plugins\/babel["']\)|from\s+["']prettier\/plugins\/babel["']/,
    );
  });
});
