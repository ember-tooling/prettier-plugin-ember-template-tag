import { describe, expect, test } from 'vitest';

import {
  codeToGlimmerAst,
  PLACEHOLDER,
  preprocessTemplateRange,
} from '../../src/parse/preprocess.js';

const TEST_CASES = [
  {
    code: '<template>hi</template>',
    expected: [`{/*hi               */}`],
  },
  {
    code: '<template>/* hi */</template>',
    expected: [`{/*${PLACEHOLDER}* hi *${PLACEHOLDER}               */}`],
  },
  {
    code: '<template><div>hi</div></template>',
    expected: [`{/*<div>hi<${PLACEHOLDER}div>               */}`],
  },
  {
    code: '<template>{{#if true}}hi{{/if}}</template>',
    expected: [`{/*{{#if true}}hi{{${PLACEHOLDER}if}}               */}`],
  },
  {
    code: '<template>////////////////</template>',
    expected: [
      `{/*${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}${PLACEHOLDER}               */}`,
    ],
  },
  {
    code: '<template>💩</template>',
    expected: [`{/*💩               */}`],
  },
  {
    code: 'const a = <template>foo</template>; const b = <template>bar</template>;',
    expected: [
      `const a = {/*foo               */}; const b = <template>bar</template>;`,
      `const a = <template>foo</template>; const b = {/*bar               */};`,
    ],
  },
  {
    code: `const a = <template>💩💩💩💩💩💩💩</template>; const b = <template>💩</template>`,
    expected: [
      `const a = {/*💩💩💩💩💩💩💩               */}; const b = <template>💩</template>`,
      `const a = <template>💩💩💩💩💩💩💩</template>; const b = {/*💩               */}`,
    ],
  },
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
