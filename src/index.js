import watch from './commands/watch.js';
import list from './commands/list.js';
import jump from './commands/jump.js';
import remove from './commands/remove.js';
import clear from './commands/clear.js';
import init from './commands/init.js';
import { getPaths, addPath, clearPaths } from './utils/storage.js';
import { searchPaths } from './utils/search.js';

export default {
  watch,
  list,
  jump,
  remove,
  clear,
  init,
};

export {
  watch,
  list,
  jump,
  remove,
  clear,
  init,
  getPaths,
  addPath,
  clearPaths,
  searchPaths,
};