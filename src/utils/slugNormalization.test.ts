import { describe, it } from 'node:test';
import assert from 'node:assert';
import { normalizeMarkdownPath, denormalizeMarkdownPath } from './slugNormalization.ts';

describe('normalizeMarkdownPath', () => {
  it('should return empty string for empty input', () => {
    assert.strictEqual(normalizeMarkdownPath(''), '');
  });

  it('should replace em-dashes with hyphens', () => {
    const input = 'some—path—with—dashes';
    const expected = 'some-path-with-dashes';
    assert.strictEqual(normalizeMarkdownPath(input), expected);
  });

  it('should URL-encode special characters', () => {
    const input = 'Pâte Sucrée';
    const result = normalizeMarkdownPath(input);
    assert.strictEqual(result, 'P%C3%A2te%20Sucr%C3%A9e');
  });

  it('should encode ampersands', () => {
    const input = 'Cooking & Baking';
    const result = normalizeMarkdownPath(input);
    assert.strictEqual(result, 'Cooking%20%26%20Baking');
  });

  it('should handle paths with forward slashes', () => {
    const input = 'Cooking & Baking/Cakes/Pâte Sucrée';
    const result = normalizeMarkdownPath(input);
    assert.strictEqual(result, 'Cooking%20%26%20Baking/Cakes/P%C3%A2te%20Sucr%C3%A9e');
  });

  it('should replace em-dashes and encode in complex paths', () => {
    const input = 'Folder—Name/File & Name/Crème—Brûlée';
    const result = normalizeMarkdownPath(input);
    assert.strictEqual(result, 'Folder-Name/File%20%26%20Name/Cr%C3%A8me-Br%C3%BBl%C3%A9e');
  });

  it('should handle parentheses', () => {
    const input = 'Cream - Pie Cream (no eggs)';
    const result = normalizeMarkdownPath(input);
    assert.strictEqual(result, 'Cream%20-%20Pie%20Cream%20(no%20eggs)');
  });

  it('should handle paths with only ASCII characters', () => {
    const input = 'simple/path/name';
    const result = normalizeMarkdownPath(input);
    assert.strictEqual(result, 'simple/path/name');
  });
});

describe('denormalizeMarkdownPath', () => {
  it('should return empty string for empty input', () => {
    assert.strictEqual(denormalizeMarkdownPath(''), '');
  });

  it('should decode URL-encoded special characters', () => {
    const input = 'P%C3%A2te%20Sucr%C3%A9e';
    const expected = 'Pâte Sucrée';
    assert.strictEqual(denormalizeMarkdownPath(input), expected);
  });

  it('should decode ampersands', () => {
    const input = 'Cooking%20%26%20Baking';
    const expected = 'Cooking & Baking';
    assert.strictEqual(denormalizeMarkdownPath(input), expected);
  });

  it('should handle paths with forward slashes', () => {
    const input = 'Cooking%20%26%20Baking/Cakes/P%C3%A2te%20Sucr%C3%A9e';
    const expected = 'Cooking & Baking/Cakes/Pâte Sucrée';
    assert.strictEqual(denormalizeMarkdownPath(input), expected);
  });

  it('should decode complex paths', () => {
    const input = 'Folder-Name/File%20%26%20Name/Cr%C3%A8me-Br%C3%BBl%C3%A9e';
    const expected = 'Folder-Name/File & Name/Crème-Brûlée';
    assert.strictEqual(denormalizeMarkdownPath(input), expected);
  });

  it('should handle parentheses', () => {
    const input = 'Cream%20-%20Pie%20Cream%20(no%20eggs)';
    const expected = 'Cream - Pie Cream (no eggs)';
    assert.strictEqual(denormalizeMarkdownPath(input), expected);
  });

  it('should handle already decoded paths', () => {
    const input = 'simple/path/name';
    const expected = 'simple/path/name';
    assert.strictEqual(denormalizeMarkdownPath(input), expected);
  });

  it('should handle invalid encoded sequences gracefully', () => {
    const input = 'path%/invalid%ZZ';
    // Should not throw, just return as-is for invalid segments
    const result = denormalizeMarkdownPath(input);
    assert.ok(typeof result === 'string');
  });
});

describe('round-trip conversion', () => {
  it('should maintain data integrity for simple paths', () => {
    const original = 'simple/path/name';
    const normalized = normalizeMarkdownPath(original);
    const denormalized = denormalizeMarkdownPath(normalized);
    assert.strictEqual(denormalized, original);
  });

  it('should maintain data integrity for paths with special characters (except em-dashes)', () => {
    const original = 'Cooking & Baking/Cakes/Pâte Sucrée';
    const normalized = normalizeMarkdownPath(original);
    const denormalized = denormalizeMarkdownPath(normalized);
    assert.strictEqual(denormalized, original);
  });

  it('should convert em-dashes to hyphens permanently', () => {
    const original = 'path—with—em-dashes';
    const normalized = normalizeMarkdownPath(original);
    const denormalized = denormalizeMarkdownPath(normalized);
    // Em-dashes are replaced with hyphens and cannot be restored
    assert.strictEqual(denormalized, 'path-with-em-dashes');
    assert.notStrictEqual(denormalized, original);
  });

  it('should handle complex real-world paths', () => {
    const original = 'Cooking & Baking/Cakes/Cream - Pie Cream (no eggs)';
    const normalized = normalizeMarkdownPath(original);
    const denormalized = denormalizeMarkdownPath(normalized);
    assert.strictEqual(denormalized, original);
  });
});
