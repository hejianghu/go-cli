import Fuse from 'fuse.js';
import path from 'path';

/**
 * Search paths by keyword using fuzzy matching
 * @param {Array<{path: string, addedAt: string}>} paths
 * @param {string} keyword
 * @returns {Array<{item: {path: string, addedAt: string}, refIndex: number}>}
 */
export function searchPaths(paths, keyword) {
  if (!keyword || keyword.trim() === '') {
    return paths.map((item, index) => ({ item, refIndex: index }));
  }

  const fuse = new Fuse(paths, {
    keys: ['path'],
    threshold: 0.4,
    includeMatches: true,
    findAllMatches: true,
  });

  const results = fuse.search(keyword);
  return results.map(result => ({
    item: result.item,
    refIndex: paths.findIndex(p => p.path === result.item.path),
    matches: result.matches
  }));
}

/**
 * Get the display name for a path (last directory name)
 * @param {string} fullPath
 * @returns {string}
 */
export function getPathDisplayName(fullPath) {
  return path.basename(fullPath);
}

/**
 * Find exact match by path or directory name
 * @param {Array<{path: string, addedAt: string}>} paths
 * @param {string} keyword
 * @returns {{item: {path: string, addedAt: string}, refIndex: number} | null}
 */
export function findExactMatch(paths, keyword) {
  const index = paths.findIndex(p => {
    const dirName = path.basename(p.path).toLowerCase();
    return dirName === keyword.toLowerCase() || p.path === keyword;
  });

  if (index !== -1) {
    return { item: paths[index], refIndex: index };
  }
  return null;
}