import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  setStorageDir,
  getPaths,
  savePaths,
  addPath,
  removePathsByIndices,
  clearPaths,
  pathExists
} from '../src/utils/storage.js';

// Test against a temp directory
const TEMP_DIR = path.join(os.tmpdir(), 'go-cli-test-' + Date.now());

describe('storage.js', () => {
  beforeAll(() => {
    // Create temp directory and set as storage location
    fs.mkdirSync(TEMP_DIR, { recursive: true });
    setStorageDir(TEMP_DIR);
  });

  afterAll(() => {
    // Cleanup temp directory
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  });

  beforeEach(() => {
    // Clear storage before each test
    clearPaths();
  });

  describe('getPaths', () => {
    it('should return empty array when no paths stored', () => {
      const result = getPaths();
      expect(result).toEqual([]);
    });

    it('should return stored paths', () => {
      savePaths([
        { path: '/test/path1', addedAt: '2024-01-01T00:00:00Z' },
        { path: '/test/path2', addedAt: '2024-01-02T00:00:00Z' }
      ]);
      const result = getPaths();
      expect(result).toHaveLength(2);
      expect(result[0].path).toBe('/test/path1');
    });

    it('should create storage directory and file on first access', () => {
      // Create new temp dir for this test
      const newTemp = path.join(os.tmpdir(), 'go-cli-new-' + Date.now());
      fs.mkdirSync(newTemp, { recursive: true });
      setStorageDir(newTemp);

      const result = getPaths();
      expect(result).toEqual([]);
      expect(fs.existsSync(path.join(newTemp, 'paths.json'))).toBe(true);

      // Cleanup and restore
      fs.rmSync(newTemp, { recursive: true, force: true });
      setStorageDir(TEMP_DIR);
    });
  });

  describe('savePaths', () => {
    it('should save paths to storage file', () => {
      const paths = [
        { path: '/test/path', addedAt: '2024-01-01T00:00:00Z' }
      ];
      savePaths(paths);

      const result = getPaths();
      expect(result).toHaveLength(1);
      expect(result[0].path).toBe('/test/path');
    });
  });

  describe('addPath', () => {
    it('should add new path and return true', () => {
      const result = addPath('/new/project');
      expect(result).toBe(true);

      const paths = getPaths();
      expect(paths).toHaveLength(1);
      expect(paths[0].path).toBe(path.resolve('/new/project'));
    });

    it('should return false if path already exists', () => {
      addPath('/existing/project');
      const result = addPath('/existing/project');
      expect(result).toBe(false);

      const paths = getPaths();
      expect(paths).toHaveLength(1);
    });

    it('should add timestamp when adding path', () => {
      addPath('/test/path');

      const paths = getPaths();
      expect(paths[0].addedAt).toBeDefined();
      expect(new Date(paths[0].addedAt).toISOString()).toBe(paths[0].addedAt);
    });

    it('should resolve relative path to absolute', () => {
      addPath('./relative/path');

      const paths = getPaths();
      expect(paths[0].path).not.toMatch(/^\.\/|^\.\\/);
      expect(path.isAbsolute(paths[0].path)).toBe(true);
    });
  });

  describe('removePathsByIndices', () => {
    it('should remove paths by given indices', () => {
      savePaths([
        { path: '/path/1', addedAt: '2024-01-01T00:00:00Z' },
        { path: '/path/2', addedAt: '2024-01-02T00:00:00Z' },
        { path: '/path/3', addedAt: '2024-01-03T00:00:00Z' }
      ]);

      removePathsByIndices([0, 2]);

      const result = getPaths();
      expect(result).toHaveLength(1);
      expect(result[0].path).toBe('/path/2');
    });

    it('should handle empty indices array', () => {
      savePaths([{ path: '/path/1', addedAt: '2024-01-01T00:00:00Z' }]);
      removePathsByIndices([]);

      const result = getPaths();
      expect(result).toHaveLength(1);
    });
  });

  describe('clearPaths', () => {
    it('should clear all paths', () => {
      savePaths([
        { path: '/path/1', addedAt: '2024-01-01T00:00:00Z' },
        { path: '/path/2', addedAt: '2024-01-02T00:00:00Z' }
      ]);

      clearPaths();

      const result = getPaths();
      expect(result).toHaveLength(0);
    });
  });

  describe('pathExists', () => {
    it('should return true if path exists', () => {
      addPath('/existing/path');
      expect(pathExists('/existing/path')).toBe(true);
    });

    it('should return false if path does not exist', () => {
      expect(pathExists('/nonexistent/path')).toBe(false);
    });
  });
});