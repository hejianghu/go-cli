import fs from 'fs';
import path from 'path';
import os from 'os';

// Allow overriding storage path for testing
let _storageDir = null;
let _storageFile = null;

/**
 * Set custom storage directory (for testing)
 * @param {string} customDir
 */
export function setStorageDir(customDir) {
  _storageDir = customDir;
  _storageFile = path.join(customDir, 'paths.json');
}

/**
 * Get storage directory path
 */
function getStorageDir() {
  if (_storageDir) return _storageDir;
  return path.join(os.homedir(), '.go-cli');
}

/**
 * Get storage file path
 */
function getStorageFile() {
  if (_storageFile) return _storageFile;
  return path.join(getStorageDir(), 'paths.json');
}

/**
 * Ensure storage directory and file exist
 */
function ensureStorage() {
  const storageDir = getStorageDir();
  const storageFile = getStorageFile();

  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
  if (!fs.existsSync(storageFile)) {
    fs.writeFileSync(storageFile, JSON.stringify({ paths: [] }, null, 2));
  }
}

/**
 * Read all paths from storage
 * @returns {Array<{path: string, addedAt: string}>}
 */
export function getPaths() {
  ensureStorage();
  const data = fs.readFileSync(getStorageFile(), 'utf-8');
  return JSON.parse(data).paths || [];
}

/**
 * Save paths to storage
 * @param {Array<{path: string, addedAt: string}>} paths
 */
export function savePaths(paths) {
  ensureStorage();
  fs.writeFileSync(getStorageFile(), JSON.stringify({ paths }, null, 2));
}

/**
 * Add a path to storage
 * @param {string} pathToAdd
 * @returns {boolean} true if added, false if already exists
 */
export function addPath(pathToAdd) {
  const absolutePath = path.resolve(pathToAdd);
  const paths = getPaths();

  // Check if path already exists
  if (paths.some(p => p.path === absolutePath)) {
    return false;
  }

  paths.push({
    path: absolutePath,
    addedAt: new Date().toISOString()
  });

  savePaths(paths);
  return true;
}

/**
 * Remove paths by indices
 * @param {number[]} indices
 */
export function removePathsByIndices(indices) {
  const paths = getPaths();
  const newPaths = paths.filter((_, index) => !indices.includes(index));
  savePaths(newPaths);
}

/**
 * Clear all paths
 */
export function clearPaths() {
  savePaths([]);
}

/**
 * Check if a path exists
 * @param {string} pathToCheck
 * @returns {boolean}
 */
export function pathExists(pathToCheck) {
  const absolutePath = path.resolve(pathToCheck);
  const paths = getPaths();
  return paths.some(p => p.path === absolutePath);
}