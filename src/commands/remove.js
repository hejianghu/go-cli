import chalk from 'chalk';
import inquirer from 'inquirer';
import { getPaths, removePathsByIndices } from '../utils/storage.js';
import { searchPaths } from '../utils/search.js';

/**
 * Remove command - remove paths matching keyword with confirmation
 * @param {string} keyword - Search keyword
 */
export default async function remove(keyword) {
  if (!keyword || keyword.trim() === '') {
    console.log(chalk.yellow('Please provide a keyword to remove.'));
    console.log(chalk.gray('Usage: go remove <keyword>'));
    return;
  }

  const paths = getPaths();

  if (paths.length === 0) {
    console.log(chalk.gray('No paths recorded.'));
    return;
  }

  // Search for matches
  const results = searchPaths(paths, keyword);

  if (results.length === 0) {
    console.log(chalk.yellow(`No paths found matching "${keyword}".`));
    return;
  }

  // Display matching paths
  console.log(chalk.bold(`\nFound ${results.length} path(s) matching "${keyword}":\n`));

  results.forEach((result, index) => {
    console.log(`  ${chalk.red('•')} ${chalk.cyan(result.item.path)}`);
  });

  console.log('');

  // Ask for confirmation
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Remove ${results.length} path(s) listed above?`,
      default: false
    }
  ]);

  if (answer.confirm) {
    const indices = results.map(r => r.refIndex);
    removePathsByIndices(indices);
    console.log(chalk.green(`✓ Removed ${results.length} path(s).`));
  } else {
    console.log(chalk.gray('Cancelled.'));
  }
}