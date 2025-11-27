import { describe, expect, test } from 'vitest';

import {
  codeToGlimmerAst,
  preprocessTemplateRange,
} from '../../src/parse/preprocess.js';

const TEST_CASES = [
  {
    code: '<template>hi</template>',
    expected: ['{t:`hi               `}'],
  },
  {
    code: '<template>/* hi */</template>',
    expected: ['{t:`~* hi *~               `}'],
  },
  {
    code: '<template><div>hi</div></template>',
    expected: ['{t:`<div>hi<~div>               `}'],
  },
  {
    code: '<template>{{#if true}}hi{{/if}}</template>',
    expected: ['{t:`{{#if true}}hi{{~if}}               `}'],
  },
  {
    code: '<template>////////////////</template>',
    expected: ['{t:`~~~~~~~~~~~~~~~~               `}'],
  },
  {
    code: '<template>💩</template>',
    expected: ['{t:`💩               `}'],
  },
  {
    code: 'const a = <template>foo</template>; const b = <template>bar</template>;',
    expected: [
      'const a = {t:`foo               `}; const b = <template>bar</template>;',
      'const a = <template>foo</template>; const b = {t:`bar               `};',
    ],
  },
  {
    code: `const a = <template>💩💩💩💩💩💩💩</template>; const b = <template>💩</template>`,
    expected: [
      'const a = {t:`💩💩💩💩💩💩💩               `}; const b = <template>💩</template>',
      'const a = <template>💩💩💩💩💩💩💩</template>; const b = {t:`💩               `}',
    ],
  },
  {
    code: 'class Thing { <template>hello</template> }',
    expected: ['class Thing { static{t:`hello         `} }'],
  },
  {
    code: `export default <template>     Explicit default export module top level component. Explicit default export module top level component. Explicit default export module top level component. Explicit default export module top level component. Explicit default export module top level component. </template>
/*AMBIGUOUS*/`,
    expected: [
      `export default {t:` +
        '`     Explicit default export module top level component. Explicit default export module top level component. Explicit default export module top level component. Explicit default export module top level component. Explicit default export module top level component.                `}' +
        `
/*AMBIGUOUS*/`,
    ],
  },
  {
    code: `class MyComponent
  extends Component {
    // prettier-ignore
        <template>


    <h1>   Class top level template. Class top level template. Class top level template. Class top level template. Class top level template. </h1>
  </template>
}`,
    expected: [
      `class MyComponent
  extends Component {
    // prettier-ignore
        static{t:\`


    <h1>   Class top level template. Class top level template. Class top level template. Class top level template. Class top level template. <~h1>
           \`}
}`,
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
