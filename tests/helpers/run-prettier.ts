import { readFileSync, writeFileSync } from 'node:fs';
// eslint-disable-next-line unicorn/import-style
import { join } from 'node:path';

import { findFiles } from '@codemod-utils/files';
import { assertFixture, loadFixture } from '@codemod-utils/tests';

import type { PluginOptions } from '../../src/options.js';
import { formatFile } from './format-file.js';

type DirectoryJSON = Parameters<typeof loadFixture>[0];

type Options = {
  fixturePath: string;
  pluginOptions?: Partial<PluginOptions>;
};

export async function runPrettier(options: Options): Promise<void> {
  const { fixturePath, pluginOptions } = options;

  const { inputProject, outputProject } = (await import(
    join('../fixtures', fixturePath, 'index.js')
  )) as {
    inputProject: DirectoryJSON;
    outputProject: DirectoryJSON;
  };

  const projectRoot = join('tmp', fixturePath);

  loadFixture(inputProject, { projectRoot });

  const filePaths = findFiles('**/*.{gjs,gts}', {
    projectRoot,
  });

  await Promise.all(
    filePaths.map(async (filePath) => {
      const oldFile = readFileSync(join(projectRoot, filePath), 'utf8');
      const newFile = await formatFile(oldFile, pluginOptions);

      writeFileSync(join(projectRoot, filePath), newFile, 'utf8');
    }),
  );

  assertFixture(outputProject, { projectRoot });
}
