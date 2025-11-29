import { describe, expect, test } from 'vitest';

import {
  codeToGlimmerAst,
  preprocessTemplateRange,
  TEMPLATE_IDENTIFIER
} from '../../src/parse/preprocess.js';

const TEST_CASES = [
  {
    code: '<template>hi</template>',
    expected: [`${TEMPLATE_IDENTIFIER}\`hi              \``],
  },
  {
    code: '<template>/* hi */</template>',
    expected: [`${TEMPLATE_IDENTIFIER}\`~* hi *~              \``],
  },
  {
    code: '<template><div>hi</div></template>',
    expected: [`${TEMPLATE_IDENTIFIER}\`<div>hi<~div>              \``],
  },
  {
    code: '<template>{{#if true}}hi{{/if}}</template>',
    expected: [`${TEMPLATE_IDENTIFIER}\`{{#if true}}hi{{~if}}              \``],
  },
  {
    code: '<template>////////////////</template>',
    expected: [`${TEMPLATE_IDENTIFIER}\`~~~~~~~~~~~~~~~~              \``],
  },
  {
    code: '<template>💩</template>',
    expected: [`${TEMPLATE_IDENTIFIER}\`💩              \``],
  },
  {
    code: 'const a = <template>foo</template>; const b = <template>bar</template>;',
    expected: [
      `const a = ${TEMPLATE_IDENTIFIER}\`foo              \`; const b = <template>bar</template>;`,
      `const a = <template>foo</template>; const b = ${TEMPLATE_IDENTIFIER}\`bar              \`;`,
    ],
  },
  {
    code: `const a = <template>💩💩💩💩💩💩💩</template>; const b = <template>💩</template>`,
    expected: [
      `const a = ${TEMPLATE_IDENTIFIER}\`💩💩💩💩💩💩💩              \`; const b = <template>💩</template>`,
      `const a = <template>💩💩💩💩💩💩💩</template>; const b = ${TEMPLATE_IDENTIFIER}\`💩              \``,
    ],
  },
  {
    code: 'class Thing { <template>hello</template> }',
    expected: [`class Thing { static{${TEMPLATE_IDENTIFIER}\`hello      \`} }`],
  }
];
const FILE_NAME = 'foo.gts';

describe('preprocess', () => {
  for (const testCase of TEST_CASES) {
    test(`preprocessTemplateRange ${testCase.code}`, () => {
      const templates = codeToGlimmerAst(testCase.code, FILE_NAME);
      for (const [index, template] of templates.entries()) {
        const received = preprocessTemplateRange(template, testCase.code);
        expect(received).toEqual(testCase.expected[index]);
        expect(received).toHaveLength(testCase.code.length);
      }
    });
  }
});
