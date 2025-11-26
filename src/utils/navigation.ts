import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { processMarkdownFile } from './markdown';

/**
 * Builds a hierarchical navigation structure from markdown files
 */
export async function buildNavigation() {
  const notesDir = join(process.cwd(), 'src/data/notes');
  
  // Recursively get all markdown files
  function getAllMarkdownFiles(dir, baseDir = notesDir) {
    const files = [];
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getAllMarkdownFiles(fullPath, baseDir));
      } else if (item.endsWith('.md')) {
        // Get relative path from notes directory
        const relativePath = fullPath.replace(baseDir + '/', '').replace('.md', '');
        files.push({
          relativePath,
          fullPath
        });
      }
    }
    
    return files;
  }
  
  const allFiles = getAllMarkdownFiles(notesDir);
  
  // Build navigation tree
  const navTree = [];
  
  // Process all file paths
  for (const file of allFiles) {
    const parts = file.relativePath.split('/');
    
    // Get frontmatter to extract title
    const { frontmatter } = await processMarkdownFile(file.fullPath);
    const fileName = parts[parts.length - 1];
    const displayTitle = frontmatter.title || fileName;
    
    // Handle root-level files
    if (parts.length === 1) {
        navTree.push({
          title: displayTitle,
          url: fileName.replace(/—/g, '-'),
        });

      continue;
    }
    
    // Handle nested files
    let currentLevel = navTree;
    
    // Process folders
    for (let i = 0; i < parts.length - 1; i++) {
      const folderName = parts[i];
      
      // Find or create folder in current level
      let folder = currentLevel.find(item => item.title === folderName && item.children);
      
      if (!folder) {
        folder = {
          title: folderName,
          children: [],
        };
        currentLevel.push(folder);
      }
      
      currentLevel = folder.children;
    }
    
    // Add the file to the current level
    currentLevel.push({
      title: displayTitle,
      url: file.relativePath.replace(/—/g, '-'),
    });
  }
  
  // Sort navigation alphabetically
  const sortNav = (items) => {
    items.sort((a, b) => a.title.localeCompare(b.title));
    items.forEach(item => {
      if (item.children) {
        sortNav(item.children);
      }
    });
  };
  
  sortNav(navTree);
  
  return navTree;
}

/**
 * Gets all paths from the navigation structure
 */
export function getAllPathsFromNav(navItems) {
  const paths = [];
  
  function traverse(items) {
    for (const item of items) {
      if (item.url) {
        paths.push(item.url);
      }
      if (item.children) {
        traverse(item.children);
      }
    }
  }
  
  traverse(navItems);
  return paths;
}
