import fs from 'node:fs';
import path from 'node:path';

export interface TestCase {
  name: string;
  code: string;
  path: string;
}

/**
 * Recursively retrieves all case files from the `dir` within the `baseDir` and
 * returns an array of `TestCase` objects with information about each case.
 */
export async function getCases(
  baseDirectory: fs.PathLike,
  directory: fs.PathLike,
): Promise<TestCase[]> {
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });
  const cases = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        return getCases(
          baseDirectory,
          path.join(directory.toString(), entry.name),
        );
      } else {
        const filename = path.join(directory.toString(), entry.name);
        const code = fs.readFileSync(filename, 'utf8');
        const name = path
          .relative(baseDirectory.toString(), filename)
          .replaceAll('\\', '/');

        return {
          name,
          code,
          path: filename,
        };
      }
    }),
  );

  return cases.flat();
}

/** Gets all of the Test Cases in the `cases` directory. */
export async function getAllCases(): Promise<TestCase[]> {
  const caseDirectory = path.join(__dirname, '../cases');
  return await getCases(__dirname, caseDirectory);
}
