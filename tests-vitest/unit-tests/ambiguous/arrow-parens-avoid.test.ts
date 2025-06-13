import { describe } from 'vitest';

import {
  getAmbiguousCases,
  makeAmbiguousExpressionTest,
} from '../../helpers/ambiguous.js';
import { makeSuite } from '../../helpers/make-suite.js';

describe('ambiguous', () => {
  makeSuite(
    getAmbiguousCases,
    makeAmbiguousExpressionTest(['(oops) => {}', '(oh, no) => {}']),
  )({
    name: 'arrowParens: "avoid"',
    options: { arrowParens: 'avoid' },
  });
});
