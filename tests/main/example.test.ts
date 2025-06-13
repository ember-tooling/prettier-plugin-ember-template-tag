import { test } from '@codemod-utils/tests';

import { runPrettier } from '../helpers/index.js';

test('main > example', async function () {
  await runPrettier({
    fixturePath: 'example',
  });

  // Check idempotence
  await runPrettier({
    fixturePath: 'example',
  });
});
