import { describe, expect, test } from 'vitest';

import type { PluginOptions } from '../../src/options.js';
import {
  AMBIGUOUS_PLACEHOLDER,
  getAmbiguousCases,
  makeAmbiguousExpressionTest,
} from './ambiguous.js';
import type { TestCase } from './cases.js';
import { getAllCases } from './cases.js';
import { format } from './format.js';

export interface Config {
  name: string;
  options?: Partial<PluginOptions>;
}

/**
 * Generates a test suite that tests each case provided by the `caseGetter`
 * against the given `testCallback`.
 */
export function makeSuite(
  caseGetter: () => Promise<TestCase[]>,
  testCallback: (config: Config, testCase: TestCase) => void,
): (config: Config) => void {
  return function _describeConfig(config: Config): void {
    describe('config', async () => {
      const cases = await caseGetter();

      describe(config.name, () => {
        for (const testCase of cases) {
          testCallback(config, testCase);
        }
      });
    });
  };
}

/**
 * Runs a simple `format` test for the given `config` against each case in the
 * `cases` directory`.
 */
export const describeSuite = makeSuite(getAllCases, simpleTest);

/**
 * Runs the `ambiguousExpressionTest` with the given `config` against each case
 * in the `cases` directory that contains the `AMBIGUOUS_PLACEHOLDER`.
 */
export const describeAmbiguitySuite = makeSuite(
  getAmbiguousCases,
  makeAmbiguousExpressionTest(),
);

/** Runs a simple `format` test for the given `config` and `testCase` */
export function simpleTest(config: Config, testCase: TestCase): void {
  test(`it formats ${testCase.name}`, async () => {
    const code = testCase.code.replaceAll(AMBIGUOUS_PLACEHOLDER, '');
    const result = await format(code, config.options);
    expect(result).toMatchSnapshot();
  });
}
