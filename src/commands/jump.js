import chalk from 'chalk';
import inquirer from 'inquirer';
import { getPaths } from '../utils/storage.js';
import { searchPaths, findExactMatch } from '../utils/search.js';

/**
 * Log info messages to stderr (won't be captured by wrapper)
 */
function logInfo(message) {
  process.stderr.write(message + '\n');
}

/**
 * Jump command - search and output a path for shell wrapper
 * @param {string} [keyword] - Search keyword
 */
export default async function jump(keyword) {
  const paths = getPaths();

  if (paths.length === 0) {
    logInfo(chalk.gray('No paths recorded yet.'));
    logInfo(chalk.gray('Use `go watch [path]` to add a path.'));
    return; // No output to stdout, wrapper won't try to cd
  }

  // No keyword: show all paths for selection
  if (!keyword || keyword.trim() === '') {
    await selectAndOutput(paths, 'Select a path:');
    return;
  }

  // Try exact match first
  const exactMatch = findExactMatch(paths, keyword);
  if (exactMatch) {
    console.log(exactMatch.item.path);
    return;
  }

  // Fuzzy search
  const results = searchPaths(paths, keyword);

  if (results.length === 0) {
    logInfo(chalk.yellow(`No paths found matching "${keyword}".`));
    logInfo(chalk.gray('Use `go list` to see all recorded paths.'));
    return; // No output to stdout
  }

  // Single match: output directly
  if (results.length === 1) {
    console.log(results[0].item.path);
    return;
  }

  // Multiple matches: let user select (always interactive)
  const matchPaths = results.map(r => r.item);
  await selectAndOutput(matchPaths, `Found ${results.length} paths matching "${keyword}":`);
}

/**
 * Interactive selection - always use stderr for UI, stdout for result
 * @param {Array<{path: string, addedAt: string}>} paths
 * @param {string} message
 */
async function selectAndOutput(paths, message) {
  const choices = paths.map((item, index) => ({
    name: `${chalk.cyan(item.path)} ${chalk.gray(`(${new Date(item.addedAt).toLocaleDateString()})`)}`,
    value: item.path,
    short: item.path
  }));

  // Create inquirer prompt that outputs to stderr
  const prompt = inquirer.createPromptModule({ output: process.stderr });

  const answer = await prompt([
    {
      type: 'list',
      name: 'selectedPath',
      message,
      choices
    }
  ]);

  // Output only the path to stdout (for wrapper to capture)
  console.log(answer.selectedPath);
}