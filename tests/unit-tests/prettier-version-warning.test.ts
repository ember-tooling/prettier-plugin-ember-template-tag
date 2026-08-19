import { describe, expect, test, vi } from 'vitest';

import { warnOnBrokenPrettierVersion } from '../../src/utils/prettier-version-warning.js';

describe('warnOnBrokenPrettierVersion', () => {
  test.each(['3.9.0', '3.9.1', '3.9.2'])(
    'warns for broken version %s',
    (version) => {
      const warn = vi.fn();

      warnOnBrokenPrettierVersion(version, warn);

      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0]?.[0]).toContain(version);
      expect(warn.mock.calls[0]?.[0]).toContain('3.9.3');
    },
  );

  test.each(['3.8.5', '3.9.3', '3.9.4', '3.10.0', '4.0.0'])(
    'stays silent for unaffected version %s',
    (version) => {
      const warn = vi.fn();

      warnOnBrokenPrettierVersion(version, warn);

      expect(warn).not.toHaveBeenCalled();
    },
  );
});
