import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { addPath, pathExists } from '../utils/storage.js';

/**
 * Watch command - record a directory path
 * @param {string} [targetPath] - Path to watch, defaults to current directory
 */
export default function watch(targetPath = '.') {
  // path.resolve handles both ./xxx (Unix) and .\xxx (Windows) correctly
  const absolutePath = path.resolve(targetPath);

  // Check if path exists
  if (!fs.existsSync(absolutePath)) {
    console.log(chalk.red(`Path does not exist: ${absolutePath}`));
    return;
  }

  // Check if it's a directory
  if (!fs.statSync(absolutePath).isDirectory()) {
    console.log(chalk.red(`Path is not a directory: ${absolutePath}`));
    return;
  }

  if (pathExists(absolutePath)) {
    console.log(chalk.yellow(`Path already recorded: ${absolutePath}`));
    return;
  }

  const added = addPath(absolutePath);

  if (added) {
    console.log(chalk.green(`✓ Path recorded: ${absolutePath}`));
  } else {
    console.log(chalk.yellow(`Path already exists: ${absolutePath}`));
  }
}