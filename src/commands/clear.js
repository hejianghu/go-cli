import chalk from 'chalk';
import inquirer from 'inquirer';
import { getPaths, clearPaths } from '../utils/storage.js';

/**
 * Clear command - clear all paths with confirmation
 */
export default async function clear() {
  const paths = getPaths();

  if (paths.length === 0) {
    console.log(chalk.gray('No paths recorded.'));
    return;
  }

  console.log(chalk.bold(`\nYou have ${paths.length} path(s) recorded.\n`));

  // Ask for confirmation
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Clear all ${paths.length} path(s)? This cannot be undone.`,
      default: false
    }
  ]);

  if (answer.confirm) {
    clearPaths();
    console.log(chalk.green(`✓ Cleared all ${paths.length} path(s).`));
  } else {
    console.log(chalk.gray('Cancelled.'));
  }
}