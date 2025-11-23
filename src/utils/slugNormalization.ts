/**
 * Normalizes markdown file paths to be URL-safe
 * Replaces em-dashes with regular hyphens and encodes each path segment
 */
export function normalizeMarkdownPath(path: string): string {
  if (!path) return '';
  
  // Replace em-dashes with regular hyphens, then encode each segment
  return path
    .replace(/—/g, '-')
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

/**
 * Denormalizes a URL-encoded path back to its original form
 * Decodes URL encoding and restores em-dashes (though em-dashes can't be fully restored)
 */
export function denormalizeMarkdownPath(path: string): string {
  if (!path) return '';
  
  // Decode each segment
  return path
    .split('/')
    .map(segment => {
      try {
        return decodeURIComponent(segment);
      } catch {
        // If decoding fails, return as-is
        return segment;
      }
    })
    .join('/');
}
