import { searchPaths, getPathDisplayName, findExactMatch } from '../src/utils/search.js';

describe('search.js', () => {
  const mockPaths = [
    { path: '/home/user/projects/my-project', addedAt: '2024-01-01T00:00:00Z' },
    { path: '/home/user/work/product-api', addedAt: '2024-01-02T00:00:00Z' },
    { path: '/home/user/personal/portfolio', addedAt: '2024-01-03T00:00:00Z' },
    { path: '/home/user/work/project-manager', addedAt: '2024-01-04T00:00:00Z' }
  ];

  describe('searchPaths', () => {
    it('should return all paths when keyword is empty', () => {
      const result = searchPaths(mockPaths, '');
      expect(result).toHaveLength(4);
      expect(result[0].refIndex).toBe(0);
    });

    it('should return all paths when keyword is whitespace', () => {
      const result = searchPaths(mockPaths, '   ');
      expect(result).toHaveLength(4);
    });

    it('should return all paths when keyword is null', () => {
      const result = searchPaths(mockPaths, null);
      expect(result).toHaveLength(4);
    });

    it('should find matching paths by keyword', () => {
      const result = searchPaths(mockPaths, 'project');
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(r => r.item.path.includes('project'))).toBe(true);
    });

    it('should find partial matches', () => {
      const result = searchPaths(mockPaths, 'pro');
      expect(result.length).toBeGreaterThan(0);
      // Should match 'my-project', 'product-api', 'portfolio', 'project-manager'
    });

    it('should return empty array for no matches', () => {
      const result = searchPaths(mockPaths, 'nonexistent');
      expect(result).toHaveLength(0);
    });

    it('should include refIndex in results', () => {
      const result = searchPaths(mockPaths, 'product');
      expect(result[0].refIndex).toBeDefined();
      expect(typeof result[0].refIndex).toBe('number');
    });
  });

  describe('getPathDisplayName', () => {
    it('should return the last directory name', () => {
      expect(getPathDisplayName('/home/user/projects/my-project')).toBe('my-project');
    });

    it('should handle Windows paths', () => {
      expect(getPathDisplayName('C:\\Users\\test\\app')).toBe('app');
    });

    it('should handle paths with trailing slash', () => {
      expect(getPathDisplayName('/home/user/projects/')).toBe('projects');
    });

    it('should handle root path', () => {
      expect(getPathDisplayName('/')).toBe('');
    });
  });

  describe('findExactMatch', () => {
    it('should find exact match by directory name (case insensitive)', () => {
      const result = findExactMatch(mockPaths, 'my-project');
      expect(result).not.toBeNull();
      expect(result.item.path).toBe('/home/user/projects/my-project');
    });

    it('should find exact match with different case', () => {
      const result = findExactMatch(mockPaths, 'MY-PROJECT');
      expect(result).not.toBeNull();
      expect(result.item.path).toBe('/home/user/projects/my-project');
    });

    it('should find exact match by full path', () => {
      const result = findExactMatch(mockPaths, '/home/user/work/product-api');
      expect(result).not.toBeNull();
      expect(result.item.path).toBe('/home/user/work/product-api');
    });

    it('should return null when no exact match', () => {
      const result = findExactMatch(mockPaths, 'random-name');
      expect(result).toBeNull();
    });

    it('should return null for partial directory name', () => {
      // 'my-pro' is not exact match for 'my-project'
      const result = findExactMatch(mockPaths, 'my-pro');
      expect(result).toBeNull();
    });

    it('should return correct refIndex', () => {
      const result = findExactMatch(mockPaths, 'portfolio');
      expect(result.refIndex).toBe(2);
    });
  });
});