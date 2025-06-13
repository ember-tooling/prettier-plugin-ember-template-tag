import path from 'node:path';

import type { TestCase } from '../../helpers/cases.js';
import { getCases } from '../../helpers/cases.js';
import { makeSuite, simpleTest } from '../../helpers/make-suite.js';

const describeTemplateSingleQuoteSuite = makeSuite(getQuoteCases, simpleTest);

describeTemplateSingleQuoteSuite({
  name: 'singleQuote: false, templateSingleQuote should inherit',
  options: { singleQuote: false },
});

describeTemplateSingleQuoteSuite({
  name: 'singleQuote: false, templateSingleQuote: true',
  options: { singleQuote: false, templateSingleQuote: true },
});

describeTemplateSingleQuoteSuite({
  name: 'singleQuote: true, templateSingleQuote should inherit',
  options: { singleQuote: true },
});

describeTemplateSingleQuoteSuite({
  name: 'singleQuote: true, templateSingleQuote: false',
  options: { singleQuote: true, templateSingleQuote: false },
});

async function getQuoteCases(): Promise<TestCase[]> {
  const caseDirectory = path.join(__dirname, './quote-cases');
  return await getCases(__dirname, caseDirectory);
}
