import { describe, expect, test } from 'vitest';

import type { Options } from '../../src/options.js';
import { parse } from '../../src/utils/content-tag.js';
import type { TestCase } from '../helpers/cases.js';
import { getAllCases } from '../helpers/cases.js';
import { format } from '../helpers/format.js';
import type { Config } from './make-suite.js';

/**
 * Add this comment to any test case and it will be replaced by the
 * `AMBIGUOUS_EXPRESSIONS` below in the test cases.
 */
export const AMBIGUOUS_PLACEHOLDER = '/*AMBIGUOUS*/';

const AMBIGUOUS_EXPRESSIONS = [
  '(oops) => {}',
  '(oh, no) => {}',
  '["oops"]',
  '`oops`',
  '/oops/',
  '+"oops"',
  '-"oops"',
  '<template>oops</template>',
];

/**
 * `caseFilter` for `describeConfig` that will return only cases that include
 * the `AMBIGUOUS_PLACEHOLDER`.
 */
export async function getAmbiguousCases(): Promise<TestCase[]> {
  const cases = await getAllCases();
  return cases.filter((c) => c.code.includes(AMBIGUOUS_PLACEHOLDER));
}

/**
 * Tests the provided `config` and `testCase` against each ambiguous expression
 * from `AMBIGUOUS_EXPRESSIONS`, with and without user-provided semicolons.
 *
 * @see https://github.com/gitKrystan/prettier-plugin-ember-template-tag/issues/1 for more details
 */
export function makeAmbiguousExpressionTest(
  ambiguousExpressions = AMBIGUOUS_EXPRESSIONS,
) {
  return function ambiguousExpressionTest(
    config: Config,
    testCase: TestCase,
  ): void {
    for (const ambiguousExpression of ambiguousExpressions) {
      describe(ambiguousExpression, () => {
        describe('without semi, with newline', () => {
          test(`it formats ${testCase.name}`, async () => {
            const code = testCase.code
              .replaceAll(AMBIGUOUS_PLACEHOLDER, ambiguousExpression)
              .replaceAll(';\n', '\n');
            await behavesLikeFormattedAmbiguousCase(code, config.options);
          });
        });
        describe('with semi, with newline', () => {
          test(`it formats ${testCase.name}`, async () => {
            const code = testCase.code
              .replaceAll(AMBIGUOUS_PLACEHOLDER, ambiguousExpression)
              .replaceAll('</template>\n', '</template>;\n')
              .replaceAll('<Signature>\n', '<Signature>;\n');
            await behavesLikeFormattedAmbiguousCase(code, config.options);
          });
        });
        describe('without semi, without newline', () => {
          test(`it formats ${testCase.name}`, async () => {
            const code = testCase.code
              .replaceAll(AMBIGUOUS_PLACEHOLDER, ambiguousExpression)
              .replaceAll(';\n', '');
            await behavesLikeFormattedAmbiguousCase(code, config.options);
          });
        });
        describe('with semi, without newline', () => {
          test(`it formats ${testCase.name}`, async () => {
            const code = testCase.code
              .replaceAll(AMBIGUOUS_PLACEHOLDER, ambiguousExpression)
              .replaceAll('</template>\n', '</template>;')
              .replaceAll('<Signature>\n', '<Signature>;');
            await behavesLikeFormattedAmbiguousCase(code, config.options);
          });
        });
      });
    }
  };
}

async function behavesLikeFormattedAmbiguousCase(
  code: string,
  formatOptions: Partial<Options> = {},
): Promise<void> {
  try {
    const result = await format(code, formatOptions);
    expect(result).toMatchSnapshot();
    parse(result);
  } catch (error: unknown) {
    // Some of the ambiguous cases are Syntax Errors when parsed
    const isSyntaxError =
      error instanceof SyntaxError ||
      String(error).startsWith('SyntaxError') ||
      String(error).startsWith('Error: Parse Error');
    if (!isSyntaxError) {
      throw error;
    }
    expect(isSyntaxError, 'Expected SyntaxError').toBeTruthy();
    expect('Syntax Error').toMatchSnapshot();
  }
}
