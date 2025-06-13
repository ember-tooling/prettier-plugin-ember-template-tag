import { describe } from 'vitest';

import { describeAmbiguitySuite } from '../../helpers/make-suite.js';

describe('ambiguous', () => {
  describeAmbiguitySuite({
    name: 'semi: false',
    options: { semi: false },
  });
});
