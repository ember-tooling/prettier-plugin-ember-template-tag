import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('example/input');
const outputProject = convertFixtureToJson('example/output');

export { inputProject, outputProject };
