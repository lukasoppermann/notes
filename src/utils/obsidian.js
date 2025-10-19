import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Processes Obsidian transclusion syntax (![[filename#section]]) and markdown link style (![title](filename.md))
 * @param {string} content - The markdown content to process
 * @param {string} notesDir - The base directory for notes
 * @returns {string} - The processed content with transclusions resolved
 */
export function processObsidianTransclusions(content, notesDir) {
  // First, process Obsidian-style transclusions: ![[filename#section]] or ![[filename]]
  content = content.replace(/!\[\[([^\]#]+)(?:#([^\]]+))?\]\]/g, (match, filename, section) => {
    return processTransclusion(match, filename.trim(), section?.trim(), notesDir);
  });
  
  // Second, process markdown link-style transclusions: ![title](filename.md)
  // Only match .md files to avoid affecting image links
  content = content.replace(/!\[([^\]]*)\]\((.*?\.md)\)/g, (match, title, filepath) => {
    // Decode URL-encoded filenames (e.g., %20 -> space)
    const decodedPath = decodeURIComponent(filepath);
    
    // Extract filename without .md extension
    const filename = decodedPath.replace(/\.md$/, '');
    
    return processTransclusion(match, filename, null, notesDir);
  });
  
  return content;
}

/**
 * Processes a single transclusion
 * @param {string} match - The original match string
 * @param {string} filename - The filename to transclude
 * @param {string|null} section - The section to extract (optional)
 * @param {string} notesDir - The base directory for notes
 * @returns {string} - The transcluded content or original match if not found
 */
function processTransclusion(match, filename, section, notesDir) {
  try {
    // Find the file - search recursively in the notes directory
    const filePath = findMarkdownFile(filename, notesDir);
    
    if (!filePath) {
      console.warn(`File not found for transclusion: ${filename}`);
      return match; // Return original if file not found
    }
    
    // Read the file content
    const fileContent = readFileSync(filePath, 'utf-8');
    
    // If no section specified, return entire file content
    if (!section) {
      return fileContent;
    }
    
    // Extract the specific section
    const sectionContent = extractSection(fileContent, section);
    
    if (!sectionContent) {
      console.warn(`Section "${section}" not found in ${filename}`);
      return match; // Return original if section not found
    }
    
    return sectionContent;
  } catch (error) {
    console.error(`Error processing transclusion ${match}:`, error);
    return match; // Return original on error
  }
}

/**
 * Recursively finds a markdown file by name
 * @param {string} filename - The filename to search for (without .md extension)
 * @param {string} dir - The directory to search in
 * @returns {string|null} - The full path to the file, or null if not found
 */
function findMarkdownFile(filename, dir) {
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively search subdirectories
        const found = findMarkdownFile(filename, fullPath);
        if (found) return found;
      } else if (item === `${filename}.md`) {
        return fullPath;
      }
    }
  } catch (error) {
    console.error(`Error searching directory ${dir}:`, error);
  }
  
  return null;
}

/**
 * Extracts content under a specific heading from markdown
 * @param {string} content - The markdown content
 * @param {string} heading - The heading to extract (case-insensitive)
 * @returns {string|null} - The extracted content, or null if not found
 */
function extractSection(content, heading) {
  const lines = content.split('\n');
  const headingLower = heading.toLowerCase();
  
  let startIndex = -1;
  let headingLevel = 0;
  
  // Find the heading
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (match) {
      const level = match[1].length;
      const title = match[2].trim().toLowerCase();
      
      if (title === headingLower) {
        startIndex = i;
        headingLevel = level;
        break;
      }
    }
  }
  
  if (startIndex === -1) {
    return null;
  }
  
  // Find the end of this section (next heading of same or higher level)
  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^(#{1,6})\s+/);
    
    if (match) {
      const level = match[1].length;
      if (level <= headingLevel) {
        endIndex = i;
        break;
      }
    }
  }
  
  // Extract the section content (excluding the heading itself)
  const sectionLines = lines.slice(startIndex + 1, endIndex);
  
  // Trim empty lines from start and end
  while (sectionLines.length > 0 && sectionLines[0].trim() === '') {
    sectionLines.shift();
  }
  while (sectionLines.length > 0 && sectionLines[sectionLines.length - 1].trim() === '') {
    sectionLines.pop();
  }
  
  return sectionLines.join('\n');
}
