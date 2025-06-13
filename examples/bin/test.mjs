/* eslint-disable n/no-process-exit, unicorn/no-process-exit */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

import chalk from 'chalk';

const debug = process.argv.includes('--debug');

const logDebug = (message) => {
  if (debug) {
    console.log(`[${chalk.blue('debug')}]`, message);
  }
};

const newLine = () => console.log();

const inputDirectory = './input';
const expectedOutputDirectory = './expected-output';

// NOTE: Run with `--debug` to get debug output (from both this script and prettier)
const run = async () => {
  logDebug('Reading input directory...');

  try {
    const inputFiles = await fs.readdir(inputDirectory);
    const originalFiles = new Map();

    logDebug('Backing up input files...');
    for (const file of inputFiles) {
      const filePath = path.join(inputDirectory, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      originalFiles.set(file, fileContent);
    }

    if (debug) {
      newLine();
    }
    console.log('💅 Running Prettier...');
    const prettier = spawn(
      'node',
      [
        './node_modules/prettier/bin/prettier.cjs',
        './input',
        '--write',
        debug ? '--log-level' : null,
        debug ? 'debug' : null,
      ].filter(Boolean),
      {
        env: {
          ...process.env,
          FORCE_COLOR: true,
        },
      },
    );

    prettier.stdout.pipe(process.stdout);
    prettier.stderr.pipe(process.stderr);

    prettier.on('close', async (code) => {
      if (code !== 0) {
        console.error(chalk.red(`💩 Prettier exited with code ${code}`));
        process.exit(code);
      }

      newLine();
      console.log('👯 Comparing files...');

      let allFilesMatch = true;

      for (const file of inputFiles) {
        const inputFilePath = path.join(inputDirectory, file);
        const expectedOutputFilePath = path.join(expectedOutputDirectory, file);

        try {
          const [inputContent, expectedOutputContent] = await Promise.all([
            fs.readFile(inputFilePath, 'utf8'),
            fs.readFile(expectedOutputFilePath, 'utf8'),
          ]);

          if (inputContent === expectedOutputContent) {
            console.log(
              chalk.green('Pass'),
              `${file}: Formatted content matches expected output.`,
            );
            logDebug(`Resetting ${file}...`);
            await fs.writeFile(inputFilePath, originalFiles.get(file));
          } else {
            console.log(
              chalk.red('Fail'),
              `${file}: Formatted content does not match expected output.`,
            );
            allFilesMatch = false;
          }
        } catch (error) {
          console.error(chalk.red(`Error processing ${file}:`), error);
          allFilesMatch = false;
        }
      }

      newLine();

      if (allFilesMatch) {
        console.log('👋 Exiting...', chalk.green('SUCCESS'));
        process.exit(0);
      } else {
        console.log('👋 Exiting...', chalk.red('FAIL'));
        process.exit(1);
      }
    });
  } catch (error) {
    console.error(chalk.red('💩 Error:'), error);
    process.exit(2);
  }
};

run();
