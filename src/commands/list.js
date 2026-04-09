import chalk from 'chalk';
import { getPaths } from '../utils/storage.js';

/**
 * List command - display all recorded paths
 */
export default function list() {
  const paths = getPaths();

  if (paths.length === 0) {
    console.log(chalk.gray('No paths recorded yet.'));
    console.log(chalk.gray('Use `go watch [path]` to add a path.'));
    return;
  }

  console.log(chalk.bold('\nRecorded paths:\n'));

  paths.forEach((item, index) => {
    const num = chalk.gray(`${index + 1}.`.padStart(4));
    console.log(`${num} ${chalk.cyan(item.path)}`);
    console.log(`     ${chalk.gray(new Date(item.addedAt).toLocaleString())}`);
  });

  console.log(chalk.gray(`\nTotal: ${paths.length} path(s)`));
}