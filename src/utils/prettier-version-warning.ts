// Prettier 3.9.0, 3.9.1 and 3.9.2 mis-parse decorators on `declare` class
// fields and throw "Decorators can't be used with a declare field". The fix
// landed in Prettier 3.9.3 (prettier/prettier#19492). This plugin cannot work
// around the bug because the error comes from Prettier's own bundled babel
// parser, so we warn the user to upgrade instead.
//
// See: https://github.com/ember-tooling/prettier-plugin-ember-template-tag/issues/454
const AFFECTED_VERSIONS = new Set(['3.9.0', '3.9.1', '3.9.2']);

/**
 * Warns once if the running Prettier version is known to break on decorators
 * applied to `declare` class fields.
 *
 * The version and warn function are injectable so the check can be tested
 * without depending on the installed Prettier.
 */
export function warnOnBrokenPrettierVersion(
  version: string,
  warn: (message: string) => void = console.warn,
): void {
  if (!AFFECTED_VERSIONS.has(version)) {
    return;
  }

  warn(
    `prettier-plugin-ember-template-tag: Prettier ${version} mis-parses ` +
      'decorators on `declare` class fields and will throw "Decorators ' +
      'can\'t be used with a declare field". Upgrade to Prettier 3.9.3 or ' +
      'later. See https://github.com/ember-tooling/prettier-plugin-ember-template-tag/issues/454',
  );
}
