import { readdirSync, statSync } from 'fs';
import { join } from 'path';

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
        files.push(relativePath);
      }
    }
    
    return files;
  }
  
  const allFiles = getAllMarkdownFiles(notesDir);
  
  // Build navigation tree
  const navTree = [];
  
  // Process all file paths
  allFiles.forEach(relativePath => {
    const parts = relativePath.split('/');
    
    // Handle root-level files
    if (parts.length === 1) {
      const fileName = parts[0];
        navTree.push({
          title: fileName,
          url: fileName.replace(/—/g, '-'),
        });

      return;
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
    const fileName = parts[parts.length - 1];
    currentLevel.push({
      title: fileName,
      url: relativePath.replace(/—/g, '-'),
    });
  });
  
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
