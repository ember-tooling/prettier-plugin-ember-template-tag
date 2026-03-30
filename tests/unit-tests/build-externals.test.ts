import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

describe('build externals', () => {
  const distPath = resolve(
    import.meta.dirname,
    '../../dist/prettier-plugin-ember-template-tag.js',
  );

  test('prettier/plugins/estree is externalized, not bundled', () => {
    const dist = readFileSync(distPath, 'utf-8');

    // The dist should require estree as an external dependency
    expect(dist).toContain('require("prettier/plugins/estree")');

    // The dist should NOT contain estree printer internals (canAttachComment is
    // a function from the estree printer that would be present if bundled)
    expect(dist).not.toMatch(/function\s+\w*canAttachComment/);
  });

  test('prettier/plugins/babel is externalized, not bundled', () => {
    const dist = readFileSync(distPath, 'utf-8');

    expect(dist).toContain('require("prettier/plugins/babel")');
  });
});
